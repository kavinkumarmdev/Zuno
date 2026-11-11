import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function gmailOtpDevPlugin(): Plugin {
  const otpStore = new Map<string, { code: string; expiresAt: number }>();
  let transporterPromise: Promise<any> | null = null;

  const getTransporter = async () => {
    if (!transporterPromise) {
      transporterPromise = (async () => {
        try {
          const nmModule: any = await import('nodemailer');
          const nm = nmModule.default || nmModule;
          return nm.createTransport({
            service: 'gmail',
            auth: {
              user: 'kavimkumarm6383@gmail.com',
              pass: 'zuvrttbhikhbwilk'
            }
          });
        } catch (err) {
          console.error('[Vite Gmail Plugin] Failed to initialize nodemailer:', err);
          return null;
        }
      })();
    }
    return transporterPromise;
  };

  const sendOtpEmail = async (toEmail: string, otp: string, purpose: string) => {
    const transporter = await getTransporter();
    if (!transporter) throw new Error('Gmail SMTP transporter could not be initialized');
    await transporter.sendMail({
      from: '"Zuno ERP Security" <kavimkumarm6383@gmail.com>',
      to: toEmail,
      subject: `[Zuno ERP] Your ${purpose} Verification Code: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <h1 style="color: #1e40af; margin: 0; font-size: 22px;">ZUNO ERP Enterprise</h1>
            <p style="color: #64748b; margin: 4px 0 0; font-size: 13px;">Cloud Business Operations & Security</p>
          </div>
          <div style="padding: 24px 0;">
            <h3 style="color: #0f172a; margin: 0 0 8px; font-size: 16px;">${purpose} Verification</h3>
            <p style="color: #475569; font-size: 13px; margin: 0 0 20px; line-height: 1.5;">
              Use the 6-digit one-time passcode below to verify your corporate identity for <strong>${toEmail}</strong>:
            </p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0;">
              <div style="font-size: 11px; font-weight: 700; color: #15803d; letter-spacing: 1.5px; text-transform: uppercase;">One-Time Passcode</div>
              <div style="font-size: 36px; font-weight: 800; color: #166534; letter-spacing: 8px; font-family: monospace; margin: 10px 0;">${otp}</div>
              <div style="font-size: 11px; color: #64748b;">Valid for 10 minutes &bull; Strictly confidential</div>
            </div>
            <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 20px;">
              If you did not request this verification code, please ignore this email or notify your system administrator.
            </p>
          </div>
          <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            Sent by Zuno ERP Engine from kavimkumarm6383@gmail.com
          </div>
        </div>
      `
    });
  };

  return {
    name: 'gmail-otp-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split('?')[0];

        // 1. Send Registration OTP
        if (req.method === 'POST' && url === '/api/v1/auth/register-send-otp') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const email = (data.email || '').trim().toLowerCase();
              if (!email || !email.includes('@')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Valid corporate email address is required' }));
              }
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              otpStore.set(`reg:${email}`, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });
              await sendOtpEmail(email, otp, 'Tenant Registration');
              console.log(`[Gmail OTP Dev Engine] ✅ Sent registration OTP to ${email}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: true, message: `Verification code sent to ${email}` }));
            } catch (err: any) {
              console.error('[Gmail OTP Dev Engine] ❌ Error:', err?.message || err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ message: err?.message || 'Failed to dispatch email via Gmail SMTP' }));
            }
          });
          return;
        }

        // 2. Verify Registration OTP
        if (req.method === 'POST' && url === '/api/v1/auth/register-verify-otp') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const email = (data.email || '').trim().toLowerCase();
              const otp = (data.otp || '').trim();
              const entry = otpStore.get(`reg:${email}`);
              if (!entry || entry.code !== otp || entry.expiresAt < Date.now()) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Invalid or expired OTP code provided.' }));
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: true, message: 'OTP verified successfully' }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ message: 'Invalid request format' }));
            }
          });
          return;
        }

        // 3. Send Forgot Password OTP
        if (req.method === 'POST' && url === '/api/v1/auth/forgot-password') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const email = (data.email || '').trim().toLowerCase();
              if (!email || !email.includes('@')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Valid registered email address is required' }));
              }
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              otpStore.set(`forgot:${email}`, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });
              await sendOtpEmail(email, otp, 'Password Reset');
              console.log(`[Gmail OTP Dev Engine] ✅ Sent password reset OTP to ${email}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: true, message: `Verification code sent to ${email}` }));
            } catch (err: any) {
              console.error('[Gmail OTP Dev Engine] ❌ Error:', err?.message || err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ message: err?.message || 'Failed to dispatch email via Gmail SMTP' }));
            }
          });
          return;
        }

        // 4. Reset Password with OTP
        if (req.method === 'POST' && url === '/api/v1/auth/reset-password') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const email = (data.email || '').trim().toLowerCase();
              const otp = (data.otp || '').trim();
              const entry = otpStore.get(`forgot:${email}`);
              if (!entry || entry.code !== otp || entry.expiresAt < Date.now()) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Invalid or expired OTP code provided.' }));
              }
              otpStore.delete(`forgot:${email}`);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: true, message: 'Password reset successfully' }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ message: 'Invalid request format' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    gmailOtpDevPlugin(),
    {
      name: 'cloudflare-spa-fallback',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist');
        const indexPath = path.resolve(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, path.resolve(distPath, '200.html'));
          fs.copyFileSync(indexPath, path.resolve(distPath, '404.html'));
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zuno/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@zuno/shared-validation': path.resolve(__dirname, '../../packages/shared-validation/src'),
      '@zuno/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});

