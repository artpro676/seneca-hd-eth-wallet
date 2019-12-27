import { DataTypes, Model, ModelAttributes } from 'sequelize';

import { db } from '../connection';
import { DBModelFieldInit } from '../types';
import { DB_MODEL_NAME } from '../enums';

export interface IAccountModel {
  id: number;
  userId: number;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

const modelAttributes: DBModelFieldInit<IAccountModel> = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER
  },
  address: {
    type: DataTypes.STRING,
  },
};

export class CommentDBModel extends Model {}

CommentDBModel.init(
  modelAttributes as ModelAttributes,
  {
    sequelize: db,
    modelName: DB_MODEL_NAME.ACCOUNT,
    tableName: 'accounts',
    timestamps: true
  }
);
