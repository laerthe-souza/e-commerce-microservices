import { createDecipheriv } from 'node:crypto';

type IInput = {
  encryptedContent: string;
  iv: string;
  authTag: string;
};

export function decrypt<T>({ authTag, encryptedContent, iv }: IInput): T {
  const decipher = createDecipheriv(
    'aes-256-gcm',
    Buffer.from(myEnv.ENCRYPTION_KEY, 'utf-8'),
    Buffer.from(iv, 'base64'),
  );

  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedContent, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as T;
}
