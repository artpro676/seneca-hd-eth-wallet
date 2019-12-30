import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';
import {Wallet, generateMnemonic} from '../lib/wallet';
//import {REPO} from '../lib/dal';

const log = new Logger('PGN:CreateWalletPlugin');

export class CreateAddressPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:create';
  }

  async handle(message: any) {
    log.info(message);

    const mnemonic = message.mnemonic ? message.mnemonic : generateMnemonic();

    const wallet = await Wallet.fromMnemonic(mnemonic);

    const addresses = wallet.generateAddresses(5);

    return {mnemonic, addresses};
  }
}

