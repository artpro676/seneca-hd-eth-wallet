import {provider} from './db-provider';

provider.connection;

import * as Models from './models';
import {AccountRepository} from './repos';

const models: any = Object.values(Models).reduce((acc: any, model: any) => {
  if (!model || !model.name) return;

  acc[model.name] = model;

  return acc;
}, {});

Object.values(Models).forEach(async (model: any) => {

  await model.sync();

  if (model.associate && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export const accountRepository = new AccountRepository(models);


