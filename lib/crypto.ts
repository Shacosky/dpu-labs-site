import crypto from 'crypto';

type EncryptedPayload = {
  iv: string; // base64
  tag: string; // base64
  ct: string; // base64
  alg: 'AES-256-GCM';
  kver: number; // key version for potential rotation
};

function getKeyFromEnv(): { key: Buffer; version: number; prevKey?: Buffer } {
  const base64Key = process.env.OSINT_ENCRYPTION_KEY;
  const base64Prev = process.env.OSINT_ENCRYPTION_KEY_PREVIOUS;
  if (!base64Key) {
    throw new Error('Missing OSINT_ENCRYPTION_KEY env var (base64 32 bytes)');
  }
  const key = Buffer.from(base64Key, 'base64');
  if (key.length !== 32) {
    throw new Error('OSINT_ENCRYPTION_KEY must decode to 32 bytes');
  }
  let prevKey: Buffer | undefined;
  if (base64Prev) {
    const pk = Buffer.from(base64Prev, 'base64');
    if (pk.length === 32) prevKey = pk;
  }
  return { key, version: 1, prevKey };
}

export function encryptString(plaintext: string): EncryptedPayload {
  const { key, version } = getKeyFromEnv();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ct: ct.toString('base64'),
    alg: 'AES-256-GCM',
    kver: version,
  };
}

export function decryptString(payload: EncryptedPayload): string {
  const { key, prevKey } = getKeyFromEnv();
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ct = Buffer.from(payload.ct, 'base64');

  // Try current key first, then previous if provided
  const tryDecrypt = (k: Buffer): string => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', k, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString('utf8');
  };

  try {
    return tryDecrypt(key);
  } catch (e) {
    if (prevKey) {
      return tryDecrypt(prevKey);
    }
    throw e;
  }
}

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export type { EncryptedPayload };
