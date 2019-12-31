import * as sequelize from 'sequelize';
import { Sequelize } from 'sequelize';

import { Logger } from '../logger';
import { configs } from '../../configs';

const log = new Logger('DB:Provider');

class DbProvider {
  db: Sequelize;

  constructor(storage = ':memory:', encryptionKey: string | null = null) {

    const options = encryptionKey
      ? [
        'database',
        '',
        encryptionKey,
        {
          storage,
          dialect: 'sqlite',
          dialectModulePath: '@journeyapps/sqlcipher',
          dialectOptions: { decimalNumbers: true },
          logging: (msg: string) => log.info(msg)
        }
      ]
      : [
        {
          storage,
          dialect: 'sqlite',
          dialectOptions: { decimalNumbers: true },
          logging: (msg: string) => log.info(msg)
        }
      ];

    this.db = new (sequelize as any)(...options);

    // SQLCipher config
    this.db.query('PRAGMA cipher_compatibility = 3');
    this.db.query(`PRAGMA key = '${encryptionKey}'`);

  }
}

export const db = (new DbProvider(configs.DB_STORAGE, configs.DB_ENCRYPT_KEY)).db;
