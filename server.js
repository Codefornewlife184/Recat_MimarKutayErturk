const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const host = process.env.HOST || '0.0.0.0';
const initialPort = Number(process.env.PORT) || 4173;
const distRoot = path.join(__dirname, 'dist');
const root = fs.existsSync(path.join(distRoot, 'index.html')) ? distRoot : __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf'
};

const rateLimit = new Map();

function sendFile(filePath, res) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.end(data);
  });
}

function readBody(req, limitBytes = 100 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, 'utf8') > limitBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
      }
    });

    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseFormBody(body, contentType) {
  if (typeof body !== 'string') return {};
  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(body || '{}');
    } catch (error) {
      return {};
    }
  }

  const params = new URLSearchParams(body);
  return Object.fromEntries(params.entries());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const last = rateLimit.get(ip) || 0;
  const windowMs = 10_000;
  if (now - last < windowMs) return true;
  rateLimit.set(ip, now);
  return false;
}

function sendText(res, statusCode, text) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

async function handleContact(req, res) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    sendText(res, 429, 'Lütfen biraz bekleyip tekrar deneyin.');
    return;
  }

  const contentType = String(req.headers['content-type'] || '');
  let bodyText = '';
  try {
    bodyText = await readBody(req);
  } catch (error) {
    const statusCode = error && error.statusCode ? error.statusCode : 400;
    sendText(res, statusCode, 'İstek işlenemedi.');
    return;
  }

  const data = parseFormBody(bodyText, contentType);
  const fullname = String(data.fullname || '').trim();
  const email = String(data.email || '').trim();
  const phone = String(data.phone || '').trim();
  const service = String(data.service || '').trim();
  const message = String(data.message || '').trim();

  if (!fullname || !email || !phone || !message) {
    sendText(res, 400, 'Lütfen tüm zorunlu alanları doldurun.');
    return;
  }

  if (!isValidEmail(email)) {
    sendText(res, 400, 'Lütfen geçerli bir e-posta adresi girin.');
    return;
  }

  const smtpHost = process.env.SMTP_HOST || 'mail.mimarkutayerturk.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';
  const smtpUser = process.env.SMTP_USER || 'info@mimarkutayerturk.com';
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpPass) {
    sendText(res, 500, 'Sunucu e-posta ayarı eksik (SMTP_PASS).');
    return;
  }

  const to = process.env.CONTACT_TO || smtpUser;
  const from = process.env.CONTACT_FROM || smtpUser;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `İletişim Formu: ${fullname}`;
  const text = [
    `Ad Soyad: ${fullname}`,
    `E-posta: ${email}`,
    `Telefon: ${phone}`,
    `Hizmet: ${service || '-'}`,
    '',
    'Mesaj:',
    message,
    '',
    `IP: ${ip}`,
  ].join('\n');

  try {
    await transporter.sendMail({
      from: `"Web Formu" <${from}>`,
      to,
      replyTo: email,
      subject,
      text,
    });
  } catch (error) {
    sendText(res, 500, 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    return;
  }

  sendText(res, 200, 'Mesajınız başarıyla gönderildi. Teşekkürler.');
}

const server = http.createServer((req, res) => {
  const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (rawPath === '/api/contact' || rawPath === '/api/contact/') {
    if (req.method !== 'POST') {
      sendText(res, 405, 'Method not allowed');
      return;
    }
    handleContact(req, res);
    return;
  }

  const requestPath = rawPath === '/' ? '/index.html' : rawPath;
  const filePath = path.normalize(path.join(root, requestPath));

  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error) {
      if (!path.extname(filePath)) {
        sendFile(path.join(root, 'index.html'), res);
        return;
      }

      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    if (stats.isDirectory()) {
      sendFile(path.join(filePath, 'index.html'), res);
      return;
    }

    sendFile(filePath, res);
  });
});

function startServer(port) {
  currentPort = port;
  server.listen(port, host, () => {
    console.log(`Static server running at http://${host}:${port}/`);
  });
}

let currentPort = initialPort;
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    startServer(currentPort + 1);
    return;
  }

  throw error;
});

startServer(initialPort);
