import { randomUUID } from 'crypto';

import { IDeathMessageStatus } from '@shared/enums/death-message-status.enum';
import { decrypt } from '@shared/helpers/decrypt.helper';
import { encrypt } from '@shared/helpers/encrypt.helper';

type ICreateInput = {
  routingKey: string;
  exchange: string;
  reason: string;
  traceId: string | null;
  serviceName: string;
  content: string;
};

type IRestoreInput = {
  id: string;
  status: IDeathMessageStatus;
  successAt?: Date | null;
  routingKey: string;
  exchange: string;
  reason: string;
  traceId: string | null;
  iv: string;
  authTag: string;
  serviceName: string;
  encryptedContent: string;
  createdAt: Date;
  updatedAt: Date;
};

export class DeathMessage {
  private readonly _id: string;
  private _status: IDeathMessageStatus;
  private _successAt?: Date | null;
  private readonly _routingKey: string;
  private readonly _exchange: string;
  private readonly _reason: string;
  private readonly _traceId: string | null;
  private readonly _iv: string;
  private readonly _authTag: string;
  private readonly _encryptedContent: string;
  private readonly _serviceName: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(message: IRestoreInput) {
    this._id = message.id;
    this._status = message.status;
    this._successAt = message.successAt ?? null;
    this._routingKey = message.routingKey;
    this._exchange = message.exchange;
    this._reason = message.reason;
    this._traceId = message.traceId;
    this._iv = message.iv;
    this._authTag = message.authTag;
    this._serviceName = message.serviceName;
    this._encryptedContent = message.encryptedContent;
    this._createdAt = message.createdAt;
    this._updatedAt = message.updatedAt;
  }

  static create({
    traceId,
    content,
    exchange,
    serviceName,
    reason,
    routingKey,
  }: ICreateInput): DeathMessage {
    const { iv, encryptedContent, authTag } = encrypt(JSON.stringify(content));

    return new DeathMessage({
      id: randomUUID(),
      status: IDeathMessageStatus.pending,
      exchange,
      routingKey,
      reason,
      iv,
      authTag,
      serviceName,
      traceId,
      encryptedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(message: IRestoreInput): DeathMessage {
    return new DeathMessage(message);
  }

  updateStatus(status: IDeathMessageStatus) {
    if (this._status === IDeathMessageStatus.success) {
      throw new Error(
        `[${this._id}] - This death message was already processed successfully, your status cannot be changed`,
      );
    }

    this._status = status;
    this._updatedAt = new Date();

    if (status === IDeathMessageStatus.success) {
      this._successAt = new Date();
    }
  }

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  get successAt() {
    return this._successAt;
  }

  get routingKey() {
    return this._routingKey;
  }

  get exchange() {
    return this._exchange;
  }

  get reason() {
    return this._reason;
  }

  get traceId() {
    return this._traceId;
  }

  get authTag() {
    return this._authTag;
  }

  get serviceName() {
    return this._serviceName;
  }

  get iv() {
    return this._iv;
  }

  get encryptedContent() {
    return this._encryptedContent;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get decryptedMessage(): unknown {
    return decrypt({
      encryptedContent: this._encryptedContent,
      iv: this._iv,
      authTag: this._authTag,
    });
  }

  toObject() {
    return {
      id: this._id,
      status: this._status,
      successAt: this._successAt,
      routingKey: this._routingKey,
      exchange: this._exchange,
      reason: this._reason,
      traceId: this._traceId,
      iv: this._iv,
      authTag: this._authTag,
      serviceName: this._serviceName,
      encryptedContent: this._encryptedContent,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
