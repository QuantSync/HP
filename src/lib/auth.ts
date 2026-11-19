// Auth library using ONLY Web Crypto API (crypto.subtle)
// Works in both Edge middleware and Node.js routes

const COOKIE_NAME = 'mum_session';
const TOKEN_EXPIRY_DAYS = 30;

export { COOKIE_NAME };

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || 'a3f8d2e1c9b74a6f0e5d3c2b1a8f7e6d4c3b2a1f9e8d7c6b5a4f3e2d1c0b9a8f';
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface SessionPayload {
  exp: number;
  iat: number;
}

export async function generateToken(): Promise<string> {
  const secret = getSecret();
  const key = await getKey(secret);
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
  };
  const data = JSON.stringify(payload);
  const enc = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigB64 = uint8ToBase64Url(new Uint8Array(sigBuffer));
  const dataB64 = uint8ToBase64Url(enc.encode(data));
  return `${dataB64}.${sigB64}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = getSecret();
    const key = await getKey(secret);
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [dataB64, sigB64] = parts;
    const dataBytes = base64UrlToUint8(dataB64);
    const sigBytes = base64UrlToUint8(sigB64);
    const enc = new TextEncoder();
    const dataStr = new TextDecoder().decode(dataBytes);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(dataStr));
    if (!valid) return false;
    const payload: SessionPayload = JSON.parse(dataStr) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Perform comparison anyway to prevent length-based timing attacks
    let diff = 0;
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
