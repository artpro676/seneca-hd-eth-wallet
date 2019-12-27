import * as sequelize from 'sequelize';
import { Sequelize } from 'sequelize';

import { Logger } from '../logger';
import { configs } from '../../configs';

const log = new Logger('DB:Provider');

class DbProvider {
  db: Sequelize;

  constructor(storage: string = ':memory') {
    this.db = new (sequelize as any)(
      {
        storage,
        dialect: 'sqlite',
        dialectOptions: { decimalNumbers: true },
        logging: (msg: string) => log.info(msg)
      }
    );
  }
}

export const db = (new DbProvider(configs.DB_STORAGE)).db;
