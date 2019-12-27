import { DB_MODEL_NAME } from '../../enums';

export interface IRepository {
  ModelName: string;
}

export abstract class BaseRepository implements IRepository{

  abstract readonly ModelName: DB_MODEL_NAME;
  private models: any;

  get Model() {
    return this.models[this.ModelName];
  }

  constructor(models: any) {

    this.models = models;

    if (!this.Model) {
      throw new Error('Wrong parameter "keyModel"');
    }
  }

  create(value: any, options?: any) {
    return this.Model.create(value, options);
  }

  findOne(options: any) {
    return this.Model.findOne(options);
  }

  count(options: any) {
    return this.Model.count(options);
  }

  delete(options: any) {
    return this.Model.destroy(options);
  }
}
