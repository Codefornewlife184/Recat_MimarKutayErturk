<?php

declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

function respond(int $statusCode, string $message): void {
  http_response_code($statusCode);
  echo $message;
  exit;
}

function readSecretFile(string $filePath): string {
  if (!is_file($filePath)) return '';
  $raw = @file_get_contents($filePath);
  if (!is_string($raw)) return '';
  if (strncmp($raw, "\xEF\xBB\xBF", 3) === 0) {
    $raw = substr($raw, 3);
  }
  $value = trim($raw);
  if (strlen($value) >= 2 && (($value[0] === '"' && $value[strlen($value) - 1] === '"') || ($value[0] === "'" && $value[strlen($value) - 1] === "'"))) {
    $value = substr($value, 1, -1);
  }
  return trim($value);
}

function normalize(string $value): string {
  $value = trim($value);
  $value = str_replace(["\r", "\n"], ' ', $value);
  return preg_replace('/\s+/', ' ', $value) ?? $value;
}

function isValidEmail(string $email): bool {
  return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function sendViaPhpMail(string $to, string $subject, string $body, string $from, string $replyTo): bool {
  $headers = [
    'From: ' . $from,
    'Reply-To: ' . $replyTo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
  ];
  return (bool) @mail($to, $subject, $body, implode("\r\n", $headers));
}

function readPost(string $key): string {
  $raw = $_POST[$key] ?? '';
  if (!is_string($raw)) return '';
  return normalize($raw);
}

function smtpRead($socket): string {
  $data = '';
  while (!feof($socket)) {
    $line = fgets($socket, 515);
    if ($line === false) break;
    $data .= $line;
    if (preg_match('/^\d{3}\s/', $line)) break;
  }
  return $data;
}

function smtpWrite($socket, string $command): void {
  fwrite($socket, $command . "\r\n");
}

function smtpExpect($socket, array $allowedCodes): void {
  $resp = smtpRead($socket);
  if (!preg_match('/^(\d{3})\b/', $resp, $m)) {
    throw new RuntimeException('SMTP cevap okunamadı.');
  }
  $code = (int) $m[1];
  if (!in_array($code, $allowedCodes, true)) {
    throw new RuntimeException('SMTP hata: ' . $code);
  }
}

function sendViaSmtp(array $cfg, string $from, string $to, string $replyTo, string $subject, string $bodyText): void {
  $transport = ($cfg['secure'] ? 'ssl://' : 'tcp://') . $cfg['host'] . ':' . $cfg['port'];
  $socket = @stream_socket_client($transport, $errno, $errstr, 15, STREAM_CLIENT_CONNECT);
  if (!$socket) {
    throw new RuntimeException('SMTP bağlantı hatası.');
  }
  stream_set_timeout($socket, 15);

  smtpExpect($socket, [220]);
  smtpWrite($socket, 'EHLO ' . ($cfg['ehlo'] ?: 'localhost'));
  smtpExpect($socket, [250]);

  if (!$cfg['secure'] && !empty($cfg['starttls'])) {
    smtpWrite($socket, 'STARTTLS');
    smtpExpect($socket, [220]);

    $cryptoOk = @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    if ($cryptoOk !== true) {
      throw new RuntimeException('SMTP TLS başlatılamadı.');
    }

    smtpWrite($socket, 'EHLO ' . ($cfg['ehlo'] ?: 'localhost'));
    smtpExpect($socket, [250]);
  }

  smtpWrite($socket, 'AUTH LOGIN');
  smtpExpect($socket, [334]);
  smtpWrite($socket, base64_encode($cfg['user']));
  smtpExpect($socket, [334]);
  smtpWrite($socket, base64_encode($cfg['pass']));
  smtpExpect($socket, [235]);

  smtpWrite($socket, 'MAIL FROM:<' . $from . '>');
  smtpExpect($socket, [250]);

  smtpWrite($socket, 'RCPT TO:<' . $to . '>');
  smtpExpect($socket, [250, 251]);

  smtpWrite($socket, 'DATA');
  smtpExpect($socket, [354]);

  $headers = [
    'From: ' . $from,
    'To: ' . $to,
    'Reply-To: ' . $replyTo,
    'Subject: ' . $subject,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  $data = implode("\r\n", $headers) . "\r\n\r\n" . $bodyText;
  $data = str_replace(["\r\n.\r\n", "\n.\n", "\r.\r"], ["\r\n..\r\n", "\n..\n", "\r..\r"], $data);
  smtpWrite($socket, $data . "\r\n.");
  smtpExpect($socket, [250]);

  smtpWrite($socket, 'QUIT');
  smtpRead($socket);
  fclose($socket);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  respond(405, 'Method not allowed');
}

$fullname = readPost('fullname');
$email = readPost('email');
$phone = readPost('phone');
$service = readPost('service');
$message = trim((string) ($_POST['message'] ?? ''));

$message = str_replace(["\r\n", "\r"], "\n", $message);
$message = preg_replace("/\n{3,}/", "\n\n", $message) ?? $message;
$message = trim($message);

if ($fullname === '' || $email === '' || $phone === '' || $message === '') {
  respond(400, 'Lütfen tüm zorunlu alanları doldurun.');
}

if (!isValidEmail($email)) {
  respond(400, 'Lütfen geçerli bir e-posta adresi girin.');
}

$smtpHost = getenv('SMTP_HOST') ?: 'mail.mimarkutayerturk.com';
$smtpPort = (int) (getenv('SMTP_PORT') ?: '465');
$smtpSecure = strtolower((string) (getenv('SMTP_SECURE') ?: 'true')) === 'true';
$smtpStarttls = strtolower((string) (getenv('SMTP_STARTTLS') ?: 'false')) === 'true';
$smtpUser = getenv('SMTP_USER') ?: 'info@mimarkutayerturk.com';
$smtpPass = getenv('SMTP_PASS') ?: '';
if ($smtpPass === '') {
  $smtpPass = readSecretFile(__DIR__ . '/.smtp_pass');
}

$to = getenv('CONTACT_TO') ?: $smtpUser;
$from = getenv('CONTACT_FROM') ?: $smtpUser;

$subject = 'İletişim Formu: ' . $fullname;
$body = "Ad Soyad: {$fullname}\nE-posta: {$email}\nTelefon: {$phone}\nHizmet: " . ($service !== '' ? $service : '-') . "\n\nMesaj:\n{$message}\n";

try {
  if ($smtpPass !== '') {
    $ehlo = getenv('SMTP_EHLO') ?: (is_string($_SERVER['SERVER_NAME'] ?? null) ? (string) $_SERVER['SERVER_NAME'] : '');
    $candidateUsers = [$smtpUser];
    if (strpos($smtpUser, '@') !== false) {
      $candidateUsers[] = strstr($smtpUser, '@', true);
    }

    $lastError = null;
    foreach ($candidateUsers as $candidateUser) {
      try {
        sendViaSmtp(
          [
            'host' => $smtpHost,
            'port' => $smtpPort,
            'secure' => $smtpSecure,
            'starttls' => $smtpStarttls,
            'user' => $candidateUser,
            'pass' => $smtpPass,
            'ehlo' => $ehlo,
          ],
          $from,
          $to,
          $email,
          $subject,
          $body
        );
        $lastError = null;
        break;
      } catch (Throwable $inner) {
        $lastError = $inner;
        $m = $inner->getMessage();
        if (strpos($m, 'SMTP hata: 535') === false && strpos($m, 'SMTP hata: 534') === false) {
          throw $inner;
        }
      }
    }

    if ($lastError) {
      throw $lastError;
    }
    respond(200, 'Mesajınız başarıyla gönderildi. Teşekkürler.');
  }

  $headers = [
    'From: ' . $from,
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  $ok = @mail($to, $subject, $body, implode("\r\n", $headers));
  if (!$ok) {
    respond(500, 'Mesaj gönderilemedi. public_html/.smtp_pass dosyasına e-posta şifresini ekleyin.');
  }

  respond(200, 'Mesajınız başarıyla gönderildi. Teşekkürler.');
} catch (Throwable $e) {
  $msg = $e->getMessage();
  if (strpos($msg, 'SMTP hata: 535') !== false || strpos($msg, 'SMTP hata: 534') !== false) {
    $ok = sendViaPhpMail($to, $subject, $body, $from, $email);
    if ($ok) {
      respond(200, 'Mesajınız başarıyla gönderildi. Teşekkürler.');
    }
    respond(500, 'SMTP kullanıcı adı veya şifre hatalı.');
  }
  if (strpos($msg, 'SMTP hata: 530') !== false || strpos($msg, 'SMTP hata: 538') !== false) {
    respond(500, 'Sunucu TLS istiyor. SMTP_PORT=587, SMTP_SECURE=false, SMTP_STARTTLS=true deneyin.');
  }
  if (strpos($msg, 'SMTP bağlantı hatası') !== false) {
    respond(500, 'SMTP sunucusuna bağlanılamadı. Hosting SMTP çıkışını engelliyor olabilir.');
  }
  if (strpos($msg, 'SMTP TLS başlatılamadı') !== false) {
    respond(500, 'SMTP TLS başlatılamadı. SMTP ayarlarını kontrol edin.');
  }
  respond(500, 'Mesaj gönderilemedi.');
}
