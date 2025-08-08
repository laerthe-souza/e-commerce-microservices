import { OrderStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { Item } from './item.entity';

export class Order {
  private readonly _id: string;
  private readonly _customerId: string;
  private _transactionId: string | null = null;
  private _status: OrderStatus = OrderStatus.pending;
  private _items: Item[] = [];
  private _total: number = 0;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: {
    id: string;
    customerId: string;
    transactionId: string | null;
    status: OrderStatus;
    items?: Item[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._customerId = props.customerId;
    this._transactionId = props.transactionId;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._items = props.items ?? [];

    this._calculateTotal();
  }

  get id() {
    return this._id;
  }

  get customerId() {
    return this._customerId;
  }

  get transactionId() {
    return this._transactionId;
  }

  get status() {
    return this._status;
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._total;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  public addItem(item: Item) {
    this._items.push(item);
    this._calculateTotal();
  }

  public approve(transactionId: string) {
    if (this._status !== OrderStatus.pending) {
      throw new Error('Only pending orders can be approved');
    }

    this._transactionId = transactionId;
    this._status = OrderStatus.approved;
  }

  public toObject() {
    return {
      id: this._id,
      customerId: this._customerId,
      transactionId: this._transactionId,
      status: this._status,
      total: this._total,
      items: this._items.map(item => item.toObject()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public fail() {
    this._status = OrderStatus.failed;
  }

  public cancel() {
    if (this._status === OrderStatus.approved) {
      throw new Error('Approved orders cannot be cancelled');
    }

    this._status = OrderStatus.canceled;
  }

  private _calculateTotal() {
    this._total = this._items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  static create(props: { customerId: string; items: Item[] }): Order {
    if (!props.items.length) {
      throw new Error('Order must have at least one item');
    }

    return new Order({
      id: randomUUID(),
      customerId: props.customerId,
      status: OrderStatus.pending,
      transactionId: null,
      items: props.items,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    customerId: string;
    transactionId: string | null;
    status: OrderStatus;
    items?: Item[];
    createdAt: Date;
    updatedAt: Date;
  }): Order {
    return new Order(props);
  }
}
