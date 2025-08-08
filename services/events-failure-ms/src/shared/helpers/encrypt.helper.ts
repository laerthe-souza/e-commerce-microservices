import crypto from 'node:crypto';

const iv = crypto.randomBytes(12);

type IOutput = {
  encryptedContent: string;
  iv: string;
  authTag: string;
};

export function encrypt(content: string): IOutput {
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(myEnv.ENCRYPTION_KEY, 'utf-8'),
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(content, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    encryptedContent: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: tag.toString('base64'),
  };
}
