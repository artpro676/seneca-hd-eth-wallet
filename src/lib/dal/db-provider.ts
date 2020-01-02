import * as sequelize from 'sequelize';
import { Sequelize } from 'sequelize';

import { Logger } from '../logger';
import { configs } from '../../configs';

const log = new Logger('DB:Provider');

export class DbProvider {

  db: Sequelize;

  get connection() {
    return this.db || {};
  }

  constructor(storage = ':memory:', encryptionKey: string | null = null) {

   const options = encryptionKey
    ? [
       // establish connection to db with enryption key
       'database',
       '',
       encryptionKey,
       {
         storage: storage,
         dialect: 'sqlite',
         dialectModulePath: '@journeyapps/sqlcipher',
         dialectOptions: {decimalNumbers: true},
         logging: (msg: string) => log.info(msg),
         hooks: {
           afterConnect: () => {
             // SQLCipher config
             this.db.query.call(this.db, 'PRAGMA cipher_compatibility = 3;');
             this.db.query.call(this.db, `PRAGMA key = '${encryptionKey}';`);
           }
         }
       }
     ]
     : [
       // establish simple connection to db
       {
         storage: storage,
         dialect: 'sqlite',
         dialectOptions: {decimalNumbers: true},
         logging: (msg: string) => log.info(msg)
       }
     ];

    this.db = new (sequelize as any)(...options);
  }

  // async connect() {
  //
  //   try {
  //
  //     if (this.encryptionKey) {
  //
  //
  //       this.db = new (sequelize as any)(
  //
  //       );
  //
  //
  //     } else {
  //
  //
  //
  //       this.db = new (sequelize as any)({
  //         storage: this.storage,
  //         dialect: 'sqlite',
  //         dialectOptions: {decimalNumbers: true},
  //         logging: (msg: string) => log.info(msg)
  //       });
  //     }
  //
  //     await this.db.authenticate();
  //   } catch (err) {
  //     log.error(err);
  //     throw err;
  //   }
  // }
}

export const provider = new DbProvider(configs.DB_STORAGE, configs.DB_ENCRYPT_KEY);
