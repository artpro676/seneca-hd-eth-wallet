import { DataTypes, Model, ModelAttributes } from 'sequelize';

import { db } from '../connection';
import { DBModelFieldInit } from '../types';
import { DB_MODEL_NAME } from '../enums';

export interface IAccountModel {
  id: number;
  uid: number; // user`s id
  mnemonic: string;
  createdAt?: string;
  updatedAt?: string;
}

const modelAttributes: DBModelFieldInit<IAccountModel> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: DataTypes.INTEGER,
  },
  mnemonic: {
    type: DataTypes.STRING,
  }
};

export class AccountDBModel extends Model {

  toJSON(){
    const obj: any = this.get({ plain: true });
    if(obj.mnemonic) {
      obj.mnemonic = '*********************';
    }
    return obj;
  }

}

AccountDBModel.init(
  modelAttributes as ModelAttributes,
  {
    sequelize: db,
    modelName: DB_MODEL_NAME.ACCOUNT,
    tableName: 'accounts',
    timestamps: true
  }
);
