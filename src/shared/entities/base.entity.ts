import { Types } from "mongoose";

/**
 * Base Entity
 * Provides common properties and methods for all domain entities
 */
export abstract class BaseEntity {
  protected readonly _id: Types.ObjectId;
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;

  constructor(id?: string | Types.ObjectId) {
    this._id = id ? new Types.ObjectId(id) : new Types.ObjectId();
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id.toString();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  equals(other: BaseEntity): boolean {
    return this._id.equals(other._id);
  }

  protected updateTimestamp(): void {
    (this as any)._updatedAt = new Date();
  }
}
