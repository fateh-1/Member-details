import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { sqliteDb } from './server/sqlite-db.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize SQLite database
  await sqliteDb.initialize();

  app.use(express.json());

  // Database Health Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    try {
      const stats = sqliteDb.getStats();
      res.json({
        status: 'ok',
        database: 'SQLite 3 Connected',
        engine: 'SQLite 3 via sql.js (customers.sqlite)',
        recordsCount: stats.totalDatabaseRecords,
        file: sqliteDb.getDatabasePath(),
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'SQLite connection error' });
    }
  });

  // Download Raw SQLite Database File
  app.get('/api/database/download-sqlite', (_req: Request, res: Response) => {
    try {
      const filePath = sqliteDb.getDatabasePath();
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'SQLite database file not found' });
      }
      res.setHeader('Content-Type', 'application/x-sqlite3');
      res.setHeader('Content-Disposition', 'attachment; filename="customers.sqlite"');
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to download SQLite file' });
    }
  });

  // Download iOS .ipa Package
  app.get('/api/download/ios-ipa', (_req: Request, res: Response) => {
    try {
      const ipaPath = path.resolve(process.cwd(), 'public/downloads/CustomerManager.ipa');
      if (!fs.existsSync(ipaPath)) {
        return res.status(404).json({ error: 'CustomerManager.ipa file not found. Please build IPA first.' });
      }
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="CustomerManager.ipa"');
      const fileStream = fs.createReadStream(ipaPath);
      fileStream.pipe(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to download IPA package' });
    }
  });

  // Dynamic Apple OTA manifest.plist
  app.get('/api/download/ios-manifest', (req: Request, res: Response) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    const ipaUrl = `${baseUrl}/api/download/ios-ipa`;
    const iconUrl = `${baseUrl}/apple-touch-icon.png`;
    const fullIconUrl = `${baseUrl}/pwa-512x512.png`;

    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
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
                    <string>${ipaUrl}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>url</key>
                    <string>${iconUrl}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>full-size-image</string>
                    <key>url</key>
                    <string>${fullIconUrl}</string>
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
</plist>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(manifestXml);
  });

  // Download Android .apk Package
  app.get('/api/download/android-apk', (_req: Request, res: Response) => {
    try {
      const apkPath = path.resolve(process.cwd(), 'public/downloads/CustomerManager.apk');
      if (!fs.existsSync(apkPath)) {
        return res.status(404).json({ error: 'CustomerManager.apk file not found. Please build APK first.' });
      }
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="CustomerManager.apk"');
      const fileStream = fs.createReadStream(apkPath);
      fileStream.pipe(res);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to download APK package' });
    }
  });

  // Customers API (backed by SQLite)
  app.get('/api/customers', (req: Request, res: Response) => {
    try {
      const filter = req.query.filter as string | undefined;
      const query = req.query.q as string | undefined;
      const customers = sqliteDb.getCustomers(filter, query);
      res.json({ customers, total: customers.length, engine: 'sqlite' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to query SQLite database' });
    }
  });

  app.get('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const customer = sqliteDb.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found in SQLite database' });
      }
      res.json({ customer });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to query SQLite customer' });
    }
  });

  app.post('/api/customers', (req: Request, res: Response) => {
    try {
      const { name, email, phone, address, status, tier, notes } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required fields' });
      }

      const newCustomer = sqliteDb.createCustomer({
        name,
        email,
        phone,
        address: address || '',
        status: status || 'active',
        tier: tier || 'standard',
        notes: notes || '',
      });

      res.status(201).json({ customer: newCustomer });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to insert into SQLite database' });
    }
  });

  app.put('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const updated = sqliteDb.updateCustomer(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Customer not found in SQLite database' });
      }
      res.json({ customer: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update SQLite customer' });
    }
  });

  app.delete('/api/customers/:id', (req: Request, res: Response) => {
    try {
      const deleted = sqliteDb.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Customer not found in SQLite database' });
      }
      res.json({ customer: deleted, success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete from SQLite database' });
    }
  });

  app.post('/api/customers/restore', (req: Request, res: Response) => {
    try {
      const { customer } = req.body;
      if (!customer || !customer.id) {
        return res.status(400).json({ error: 'Valid customer object required for restoration' });
      }
      const restored = sqliteDb.restoreCustomer(customer);
      res.json({ customer: restored, success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to restore into SQLite database' });
    }
  });

  // Dashboard Stats API
  app.get('/api/dashboard/stats', (_req: Request, res: Response) => {
    try {
      const stats = sqliteDb.getStats();
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to compute SQLite stats' });
    }
  });

  // Activity Logs API
  app.get('/api/activities', (_req: Request, res: Response) => {
    try {
      const activities = sqliteDb.getActivities();
      res.json({ activities });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to query SQLite activities' });
    }
  });

  // Database Reset API
  app.post('/api/database/reset', (_req: Request, res: Response) => {
    try {
      sqliteDb.resetDatabase();
      const stats = sqliteDb.getStats();
      res.json({ success: true, count: stats.totalDatabaseRecords });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to reset SQLite database' });
    }
  });

  // Vite Integration in Development / Static Serving in Production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SQLite Database Server] Ready on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
