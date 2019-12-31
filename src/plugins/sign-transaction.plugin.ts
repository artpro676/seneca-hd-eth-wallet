import * as Joi from 'joi';
import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';
import { accountRepository } from '../lib/dal';
import { Wallet } from '../lib/wallet';

const log = new Logger('PGN:SignTransactionPlugin');

export class SignTransactionPlugin extends BasePlugin {
  get pin() {
    return {
      role: 'wallet',
      cmd: 'signTx',
      uid: Joi.required(),
      tx: Joi
        .object({
          nonce: Joi.number(),
          from: Joi.string().required(),
          to: Joi.string().required(),
          value: Joi.number().required(),
          gasLimit: Joi.number().required(),
          gasPrice: Joi.number().required(),
          chainId: Joi.number().required()
      }).required()
    };
  }

  async handle(message: any) {
    log.info(message);

      let account = await accountRepository.findByUid(message.uid);

      if (!account) {
        throw new Error('Account not found');
      }

      const wallet = await Wallet.fromMnemonic(account.mnemonic);
      const signedTx = wallet.signTransaction(message.tx);
      return {signedTx};
  }
}

