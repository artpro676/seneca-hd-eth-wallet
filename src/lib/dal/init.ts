import * as Models from './models';
import * as Repositories from './repos';

const models: any = Object.values(Models).reduce((model: any, acc: any) => {
  if (!model)
  {throw new Error('Cannot get property "model"!');}

  acc[model.name] = model;

  return acc;
}, {});

Object.values(Models).forEach(async (model: any) => {

  await model.sync();

  if (model.associate && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export const REPO = Object.values(Repositories).reduce((Repository: any, acc: any) => {
  const repository = new Repository(models);
  acc[repository.ModelName] = repository;

  return acc;
}, {});


