import { BasePlugin } from './base/_base.plugin';
import { Logger } from '../lib/logger';
import { Wallet, generateMnemonic } from '../lib/wallet';
import { accountRepository } from '../lib/dal';

const log = new Logger('PGN:CreateWalletPlugin');

export type CreateAddressOptions = {
  role: string,
  cmd: string,
  mnemonic?: string,
  uid: number
}

export class GetWalletPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:get,uid:*';
  }

  async handle(message: CreateAddressOptions) {
    log.info(message);

    let account = await accountRepository.findByUid(message.uid);

    if(!account) {
      const mnemonic = message.mnemonic ? message.mnemonic : generateMnemonic();
      account = await accountRepository.create({uid: message.uid, mnemonic});
    }

    const wallet = await Wallet.fromMnemonic(account.mnemonic);

    return {wallet, account}; // TODO remove account field
  }
}

