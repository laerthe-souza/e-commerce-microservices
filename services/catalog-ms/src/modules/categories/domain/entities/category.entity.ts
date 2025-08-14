import { randomUUID } from 'node:crypto';

import { slugify } from '@shared/helpers/slugify.helper';

export class Category {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
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

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  updateName(name: string) {
    this._name = name;
    this._slug = slugify(name);
  }

  toObject() {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static create(props: { name: string }): Category {
    return new Category({
      id: randomUUID(),
      name: props.name,
      slug: slugify(props.name),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    return new Category(props);
  }
}
