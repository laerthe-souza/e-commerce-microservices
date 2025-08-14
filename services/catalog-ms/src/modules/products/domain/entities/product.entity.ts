import { Category } from '@modules/categories/domain/entities/category.entity';
import { randomUUID } from 'node:crypto';

import { slugify } from '@shared/helpers/slugify.helper';

export class Product {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _description: string;
  private _externalId?: string | null;
  private _price: number;
  private _categoryId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _category: Category;

  constructor(props: {
    id: string;
    name: string;
    slug: string;
    description: string;
    externalId?: string | null;
    price: number;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._description = props.description;
    this._externalId = props.externalId;
    this._price = props.price;
    this._categoryId = props.categoryId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._category = props.category;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get slug() {
    return this._slug;
  }

  get description() {
    return this._description;
  }

  get externalId() {
    return this._externalId;
  }

  get price() {
    return this._price;
  }

  get categoryId() {
    return this._categoryId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get category() {
    return this._category;
  }

  link(externalId: string) {
    this._externalId = externalId;
  }

  updateName(name: string) {
    this._name = name;
    this._slug = slugify(name);
  }

  updateDescription(description: string) {
    this._description = description;
  }

  updatePrice(price: number) {
    if (price < 0) throw new Error('Price must be a positive number');

    this._price = price;
  }

  changeCategory(categoryId: string) {
    this._categoryId = categoryId;
  }

  toObject() {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      externalId: this._externalId,
      price: this._price,
      categoryId: this._categoryId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static create(props: {
    name: string;
    description: string;
    price: number;
    category: Category;
  }): Product {
    return new Product({
      id: randomUUID(),
      name: props.name,
      slug: slugify(props.name),
      description: props.description,
      price: props.price,
      categoryId: props.category.id,
      category: props.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    name: string;
    slug: string;
    description: string;
    externalId?: string | null;
    price: number;
    categoryId: string;
    category: ReturnType<Category['toObject']>;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product({
      ...props,
      category: Category.restore(props.category),
    });
  }
}
