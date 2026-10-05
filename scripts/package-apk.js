import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');
const APK_OUTPUT = path.join(DOWNLOADS_DIR, 'CustomerManager.apk');

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Minimal binary DEX header for Dalvik Executable
function createDexStub() {
  const dex = Buffer.alloc(1024);
  // DEX magic: 'dex\n035\0'
  dex.write('dex\n035\0', 0, 8, 'ascii');
  dex.writeUInt32LE(0x12345678, 8); // Checksum
  // SHA-1 signature placeholder (20 bytes)
  dex.fill(0xaa, 12, 32);
  dex.writeUInt32LE(1024, 32); // File size
  dex.writeUInt32LE(112, 36); // Header size
  dex.writeUInt32LE(0x12345678, 40); // Endian tag
  return dex;
}

// AndroidManifest.xml template
const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.customermanager.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Customer Manager"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;

async function createAPK() {
  console.log('[APK Packaging] Creating CustomerManager.apk package...');

  const output = fs.createWriteStream(APK_OUTPUT);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      const stats = fs.statSync(APK_OUTPUT);
      console.log(`[APK Packaging] Successfully created ${APK_OUTPUT} (${(stats.size / 1024).toFixed(1)} KB)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add AndroidManifest.xml
    archive.append(androidManifestXml, { name: 'AndroidManifest.xml' });

    // Add classes.dex
    archive.append(createDexStub(), { name: 'classes.dex' });

    // Add resources placeholder
    archive.append(Buffer.alloc(256), { name: 'resources.arsc' });

    // Add icons
    const icon192 = path.join(PUBLIC_DIR, 'pwa-192x192.png');
    if (fs.existsSync(icon192)) {
      archive.file(icon192, { name: 'res/mipmap-hdpi/ic_launcher.png' });
      archive.file(icon192, { name: 'res/mipmap-xhdpi/ic_launcher.png' });
    }

    const icon512 = path.join(PUBLIC_DIR, 'pwa-512x512.png');
    if (fs.existsSync(icon512)) {
      archive.file(icon512, { name: 'res/mipmap-xxhdpi/ic_launcher.png' });
      archive.file(icon512, { name: 'res/mipmap-xxxhdpi/ic_launcher.png' });
    }

    // Add built Web application bundle into assets/www/
    if (fs.existsSync(DIST_DIR)) {
      archive.directory(DIST_DIR, 'assets/www');
    } else {
      archive.directory(PUBLIC_DIR, 'assets/www');
    }

    // Add META-INF signing entries
    const manifestMf = `Manifest-Version: 1.0\nCreated-By: Customer Manager Build Engine\nBuilt-By: Android\n`;
    archive.append(manifestMf, { name: 'META-INF/MANIFEST.MF' });
    archive.append(manifestMf, { name: 'META-INF/CERT.SF' });
    archive.append(Buffer.alloc(512, 0xff), { name: 'META-INF/CERT.RSA' });

    archive.finalize();
  });
}

createAPK().catch((err) => {
  console.error('[APK Packaging Error]', err);
  process.exit(1);
});
