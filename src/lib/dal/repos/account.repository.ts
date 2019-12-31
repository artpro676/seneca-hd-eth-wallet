import { BaseRepository } from './base/_base.repository';
import { DB_MODEL_NAME } from '../enums';

/* eslint-disable  @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export class AccountRepository extends BaseRepository {
  /* eslint-enable  @typescript-eslint/ban-ts-ignore */

  get ModelName() {
    return DB_MODEL_NAME.ACCOUNT;
  }

  findByUid(uid: number){
    return this.Model.findOne({where: {uid}});
  }

}

