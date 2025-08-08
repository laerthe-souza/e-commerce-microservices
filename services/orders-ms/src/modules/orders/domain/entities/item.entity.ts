import { randomUUID } from 'node:crypto';

export class Item {
  private readonly _id: string;
  private readonly _productId: string;
  private readonly _productName: string;
  private readonly _price: number;
  private readonly _quantity: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._productId = props.productId;
    this._productName = props.productName;
    this._price = props.price;
    this._quantity = props.quantity;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id() {
    return this._id;
  }

  get productId() {
    return this._productId;
  }

  get productName() {
    return this._productName;
  }

  get price() {
    return this._price;
  }

  get quantity() {
    return this._quantity;
  }

  get totalPrice() {
    return this._price * this._quantity;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  public toObject() {
    return {
      id: this._id,
      productId: this._productId,
      productName: this._productName,
      price: this._price,
      quantity: this._quantity,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static create(props: {
    productId: string;
    productName: string;
    externalProductId: string;
    price: number;
    quantity: number;
  }): Item {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (props.price < 0) {
      throw new Error('Price must be a positive integer');
    }

    return new Item({
      id: randomUUID(),
      productId: props.productId,
      productName: props.productName,
      price: props.price,
      quantity: props.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
  }): Item {
    return new Item(props);
  }
}
