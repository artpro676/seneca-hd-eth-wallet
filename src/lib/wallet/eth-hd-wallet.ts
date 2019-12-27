import { addHexPrefix } from 'ethereumjs-util';
import {fromExtendedKey} from 'ethereumjs-wallet/hdkey';
import { Transaction as EthereumTx, TxData } from 'ethereumjs-tx';
import * as EthSigUtil from 'eth-sig-util';

/* eslint-disable  @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import * as Mnemonic from 'bitcore-mnemonic';
/* eslint-enable  @typescript-eslint/ban-ts-ignore */


// See https://github.com/ethereum/EIPs/issues/85
const BIP44_PATH = `m/44'/60'/0'/0`;


export interface SignTransactionOptions {
  nonce: string;
  from: string;
  to: string;
  value: string;
  data: any;
  gasLimit: string;
  gasPrice: string;
  chainId: string;
}


/**
 * Normalize an Etherum address
 * @param  {String} addr Address
 * @return {Striung}
 */
const normalizeAddress = (addr: string) => addr ? addHexPrefix(addr.toLowerCase()) : addr;


/**
 * Represents a wallet instance.
 */
export class EthHdWallet {

  private _hdKey: any;
  private _root: any;
  private _children: any[];

  /**
   * @constructor
   * @param  {String} hdKey Extended HD private key
   */
  constructor(xPrivKey: string) {
    this._hdKey = fromExtendedKey(xPrivKey);
    this._root = this._hdKey.derivePath(BIP44_PATH);
    this._children = [];
  }


  /**
   * Construct HD wallet instance from given mnemonic
   * @param  {String} mnemonic Mnemonic/seed string.
   * @return {EthHdWallet}
   */
  static fromMnemonic(mnemonic: string) {
    const mnemonicInstance = new Mnemonic(mnemonic);
    const {xprivkey} = mnemonicInstance.toHDPrivateKey();

    return new EthHdWallet(xprivkey);
  }

  /**
   * Generate a 12-word mnemonic in English.
   * @return {[String]}
   */
  static generateMnemonic = () => {
    return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
  };

  /**
   * Generate new addresses.
   * @param  {Number} num No. of new addresses to generate.
   * @return {[String]}
   */
  generateAddresses(num: number) {
    const newKeys: any = this._deriveNewKeys(num);

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
      value: options.value,
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
  _deriveNewKeys(num: number) {
    let count = num;

    while (--count >= 0) {
      const child = this._root.deriveChild(this._children.length).getWallet();

      this._children.push({
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
  _findWallet(address: string){

    const normalizedAddr = normalizeAddress(address);

    const result = this._children.find(({address: a}) => normalizedAddr === a) || {};

    if (!result || !result.wallet) {
      throw new Error('Invalid address');
    }

    return result.wallet;
  }
}
