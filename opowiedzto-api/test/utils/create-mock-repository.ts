import {
  DeleteResult,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';

export type MockRepository<Entity extends ObjectLiteral> = {
  find: jest.Mock<Promise<Entity[]>, [FindManyOptions<Entity>?]>;
  findOne: jest.Mock<Promise<Entity | null>, [FindOneOptions<Entity>?]>;
  findOneBy: jest.Mock<Promise<Entity | null>, [Partial<Entity>]>;
  findAndCount: jest.Mock<Promise<[Entity[], number]>, [FindManyOptions<Entity>?]>;
  create: jest.Mock<Entity | Entity[], [DeepPartial<Entity> | DeepPartial<Entity>[]]>;
  save: jest.Mock<Promise<Entity | Entity[]>, [DeepPartial<Entity> | DeepPartial<Entity>[], SaveOptions?]>;
  update: jest.Mock<Promise<UpdateResult>, [Partial<Entity>, DeepPartial<Entity>]>;
  delete: jest.Mock<Promise<DeleteResult>, [Partial<Entity>]>;
  remove: jest.Mock<Promise<Entity | Entity[]>, [Entity | Entity[]]>;
  count: jest.Mock<Promise<number>, [FindManyOptions<Entity>?]>;
  increment: jest.Mock<Promise<UpdateResult>, [Partial<Entity>, keyof Entity, number]>;
  decrement: jest.Mock<Promise<UpdateResult>, [Partial<Entity>, keyof Entity, number]>;
  createQueryBuilder: jest.Mock<unknown, [string?]>;
  manager: Repository<Entity>['manager'];
};

export const createMockRepository = <Entity extends ObjectLiteral>(): MockRepository<Entity> => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {} as Repository<Entity>['manager'],
  };
};

