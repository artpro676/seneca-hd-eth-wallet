import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';
import {EthHdWallet} from '../lib/wallet';

const log = new Logger('PGN:CreateWalletPlugin');

export class CreateWalletPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:create';
  }

  handle(message: any) {
    log.info(message);

    const mnemonic = EthHdWallet.generateMnemonic();

    return {mnemonic};
  }
}

