import { BaseEntity } from "@/shared/entities";

/**
 * Base Repository Interface
 * Defines common repository operations
 */
export interface BaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
