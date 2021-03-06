import { addHexPrefix } from 'ethereumjs-util';
import { fromExtendedKey, fromMasterSeed } from 'ethereumjs-wallet/hdkey';
import { Transaction as EthereumTx, TxData } from 'ethereumjs-tx';
import * as EthSigUtil from 'eth-sig-util';
import { TOKEN_TYPES } from './enums';

/* eslint-disable  @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import * as bip39 from 'bip39';
/* eslint-enable  @typescript-eslint/ban-ts-ignore */

const WALLET_TOKEN_TYPES = [
  TOKEN_TYPES.ETHEREUM,
  // TOKEN_TYPES.DEFAULT_TOKEN,
  // TOKEN_TYPES.REWARD_TOKEN,
];

export interface SignTransactionOptions {
  nonce: string; // transaction nonce, security feature that prevents double spending
  from: string;
  to: string; //  the address to whom the funds are to be sent
  value: string;
  data: any;
  gasLimit: string;
  gasPrice: string;
  chainId: string; // 1 for mainnet, 3 for Ropsten testnet. Here’s a complete list : https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
}


export function generateMnemonic() {
  return bip39.generateMnemonic();
}

/**
 * Normalize an Etherum address
 * @param  {String} addr Address
 * @return {Striung}
 */
export function normalizeAddress(addr: string) {
  return addr ? addHexPrefix(addr.toLowerCase()) : addr;
}

/**
 * Represents a wallet instance.
 */
export class Wallet {

  private _hdKey: any;
  private _children: any[];

  /**
   * @constructor
   * @param  {String} hdKey Extended HD private key
   */
  constructor(xPrivKey: string) {
    this._hdKey = fromExtendedKey(xPrivKey);
    this._children = [];
  }

  toJSON() {
    return {addresses:  this._children.map(k => ({address: k.address, type: k.type}))};
  }

  /**
   * Construct HD wallet instance from given mnemonic
   * @param  {String} mnemonic Mnemonic/seed string.
   * @return {Wallet}
   */
  static async fromMnemonic(mnemonic: string): Promise<Wallet> {
    const seed: Buffer = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root: any = fromMasterSeed(seed as any);
    const xprv = root.privateExtendedKey();
    const wallet = new Wallet(xprv.toString('hex'));

    WALLET_TOKEN_TYPES.map((tokenType: number) => ({
      addresses: wallet.generateAddresses(1, tokenType),
      token: TOKEN_TYPES[tokenType]
    }));

    return wallet;
  }

  /**
   * Generate new addresses.
   * @param  {Number} num No. of new addresses to generate.
   * @return {[String]}
   */
  generateAddresses(num: number, coinType: TOKEN_TYPES) {
    const newKeys: any = this._deriveNewKeys(num, coinType);

    return newKeys.map((k: any) => k.address);
  }

  /**
   * Discard generated addresses.
   *
   * This is in effect the reverse of `generateAddresses()`.
   *
   * @param  {Number} num The number of addresses to remove from the end of the list of addresses.
   * @return {[String]} The discarded addresses
   */
  discardAddresses(num: number) {
    const discard = this._children.splice(-num);

    return discard.map(k => k.address);
  }


  /**
   * Get all addresses.
   * @return {[String]}
   */
  getAddresses() {
    return this._children.map(k => k.address);
  }


  /**
   * Get no. of addresses.
   * @return {Number}
   */
  getAddressCount() {
    return this._children.length;
  }


  /**
   * Check whether given address is present in current list of generated addresses.
   * @param  {String}  addr
   * @return {Boolean}
   */
  hasAddress(addr: string) {
    addr = normalizeAddress(addr);

    return !!this._children.find(({address}) => addr === address);
  }


  /**
   * Get private key for given address.
   * @param  {String}  addr Public key address
   * @return {Buffer} private key buffer
   */
  getPrivateKey(addr: string) {
    addr = normalizeAddress(addr);

    const result = this._children.find(({address: a}) => addr === a) || {};

    if (!result || !result.wallet) {
      throw new Error('Invalid address');
    }

    return result.wallet.getPrivateKey();
  }


  /**
   * Sign transaction data.
   *
   * @param  {String} from From address
   * @param  {String} [to] If omitted then deploying a contract
   * @param  {Number} value Amount of wei to send
   * @param  {String} data Data
   * @param  {Number} gasLimit Total Gas to use
   * @param  {Number} gasPrice Gas price (wei per gas unit)
   * @param  {String} chainId Chain id
   *
   * @return {String} Raw transaction string.
   */
  signTransaction(options: SignTransactionOptions) {
    const from = normalizeAddress(options.from);
    const to = normalizeAddress(options.to);

    const result = this._children.find(({address}) => from === address) || {};

    if (!result || !result.wallet) {
      throw new Error('Invalid from address');
    }

    const tx = new EthereumTx({
      to,
      nonce: options.nonce,
      value:  options.value,
      data: options.data,
      gasLimit: options.gasLimit,
      gasPrice: options.gasPrice,
      chainId: options.chainId
    } as TxData);

    tx.sign(result.wallet.getPrivateKey());

    return addHexPrefix(tx.serialize().toString('hex'));
  }


  /**
   * Sign data.
   *
   * @param  {String} address Address whos private key to sign with
   * @param  {String|Buffer|BN} data Data
   *
   * @return {String} Signed data..
   */
  sign(address: string, data: TxData) {
    const wallet = this._findWallet(address);

    return addHexPrefix(EthSigUtil.personalSign(wallet.getPrivateKey(), {data}));
  }


  /**
   * Recover public key of signing account.
   *
   * @param  {String} signature The signed message..
   * @param  {String|Buffer|BN} data The original input data.
   *
   * @return {String} Public signing key.
   */
  recoverSignerPublicKey(signature: string, data: any) {
    return EthSigUtil.recoverPersonalSignature({sig: signature, data});
  }


  /**
   * Derive new key pairs.
   *
   * This will increment the internal key index counter and add the
   * generated keypairs to the internal list.
   *
   * @param  {Number} num no. of new keypairs to generate
   * @return {[String]} Generated keypairs.
   */
  _deriveNewKeys(num: number, coinType: TOKEN_TYPES) {
    let count = num;

    while (--count >= 0) {
      const child = this._getRoot(coinType).deriveChild(this._children.length).getWallet();

      this._children.push({
        type: coinType,
        wallet: child,
        address: normalizeAddress(child.getAddress().toString('hex'))
      });
    }

    return this._children.slice(-num);
  }

  /**
   *
   * @param address
   * @private
   */
  _findWallet(address: string) {

    const normalizedAddr = normalizeAddress(address);

    const result = this._children.find(({address: a}) => normalizedAddr === a) || {};

    if (!result || !result.wallet) {
      throw new Error('Invalid address');
    }

    return result.wallet;
  }

  _getRoot(coinType: TOKEN_TYPES = TOKEN_TYPES.DEFAULT_TOKEN) {
    return this._hdKey.derivePath(`m/44'/${coinType}'/0'/0`);
  }
}
