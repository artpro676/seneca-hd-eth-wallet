import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';
import { accountRepository } from '../lib/dal';
import { Wallet } from '../lib/wallet';

const log = new Logger('PGN:SignTransactionPlugin');

export class SignTransactionPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:signTx';
  }

  async handle(message: any) {
    log.info(message);

    // TODO use joi to validate messages;

      if (!message.tx) {
        throw new Error('Invalid tx data');
      }


      let account = await accountRepository.findByUid(message.uid);

      if (!account) {
        throw new Error('Account not found');
      }

      const wallet = await Wallet.fromMnemonic(account.mnemonic);


      const signedTx = wallet.signTransaction(message.tx);

      return {signedTx};

  }
}

