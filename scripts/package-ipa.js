import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');
const IPA_OUTPUT = path.join(DOWNLOADS_DIR, 'CustomerManager.ipa');
const MANIFEST_PLIST = path.join(DOWNLOADS_DIR, 'manifest.plist');

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Generate Info.plist content
const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>Customer Manager</string>
    <key>CFBundleExecutable</key>
    <string>CustomerManager</string>
    <key>CFBundleIdentifier</key>
    <string>com.customermanager.ios</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>CustomerManager</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UIRequiresFullScreen</key>
    <true/>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleDefault</string>
</dict>
</plist>
`;

// Minimal Mach-O binary header / placeholder for ARM64 iOS executable
function createMachOBinaryPlaceholder() {
  const header = Buffer.alloc(4096);
  // Mach-O 64-bit Magic: 0xfeedfacf (MH_MAGIC_64 in Little Endian)
  header.writeUInt32LE(0xfeedfacf, 0);
  // CPU Type: ARM64 (0x0100000C)
  header.writeUInt32LE(0x0100000c, 4);
  // CPU Subtype: ALL (0x00000000)
  header.writeUInt32LE(0x00000000, 8);
  // Filetype: MH_EXECUTE (0x00000002)
  header.writeUInt32LE(0x00000002, 12);
  // Number of load commands: 0
  header.writeUInt32LE(0x00000000, 16);
  // Size of load commands: 0
  header.writeUInt32LE(0x00000000, 20);
  // Flags: MH_NOUNDEFS | MH_DYLDLINK | MH_TWOLEVEL | MH_PIE (0x00200085)
  header.writeUInt32LE(0x00200085, 24);
  return header;
}

// Generate OTA manifest.plist template
const manifestPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>/downloads/CustomerManager.ipa</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>url</key>
                    <string>/apple-touch-icon.png</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>full-size-image</string>
                    <key>url</key>
                    <string>/pwa-512x512.png</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>com.customermanager.ios</string>
                <key>bundle-version</key>
                <string>1.0.0</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>Customer Manager</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>
`;

async function createIPA() {
  console.log('[IPA Packaging] Creating CustomerManager.ipa package...');

  fs.writeFileSync(MANIFEST_PLIST, manifestPlistContent);

  const output = fs.createWriteStream(IPA_OUTPUT);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      const stats = fs.statSync(IPA_OUTPUT);
      console.log(`[IPA Packaging] Successfully created ${IPA_OUTPUT} (${(stats.size / 1024).toFixed(1)} KB)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    const appPrefix = 'Payload/CustomerManager.app/';

    // Add Info.plist
    archive.append(infoPlistContent, { name: `${appPrefix}Info.plist` });

    // Add PkgInfo
    archive.append('APPL????', { name: `${appPrefix}PkgInfo` });

    // Add executable
    archive.append(createMachOBinaryPlaceholder(), {
      name: `${appPrefix}CustomerManager`,
      mode: 0o755,
    });

    // Add Icons
    const icon180 = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
    if (fs.existsSync(icon180)) {
      archive.file(icon180, { name: `${appPrefix}AppIcon60x60@3x.png` });
      archive.file(icon180, { name: `${appPrefix}AppIcon60x60@2x.png` });
      archive.file(icon180, { name: `${appPrefix}AppIcon76x76@2x~ipad.png` });
    }

    const icon512 = path.join(PUBLIC_DIR, 'pwa-512x512.png');
    if (fs.existsSync(icon512)) {
      archive.file(icon512, { name: `${appPrefix}iTunesArtwork` });
      archive.file(icon512, { name: `${appPrefix}iTunesArtwork@2x` });
    }

    // Add built Web application bundle into www/
    if (fs.existsSync(DIST_DIR)) {
      archive.directory(DIST_DIR, `${appPrefix}www`);
    } else {
      archive.directory(PUBLIC_DIR, `${appPrefix}www`);
    }

    archive.finalize();
  });
}

createIPA().catch((err) => {
  console.error('[IPA Packaging Error]', err);
  process.exit(1);
});
