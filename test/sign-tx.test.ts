import { getAppInstance } from './_app';


test('Wallet creation', async () => {

  const seneca: any = await getAppInstance();

  seneca.act({
    role: 'wallet',
    cmd: 'get',
    uid: 1,
  }, function (ignore: any, wallet: any) {

    describe('Should create and return wallet', () => {

      it('should not return any errors', () => {
        expect(ignore).toEqual(null);
      });

      const addr = wallet.wallet.addresses[0].address;

      seneca.act({
        role: 'wallet',
        cmd: 'signTx',
        uid: 1,
        tx: {
          "nonce": 0,
          "from": addr,
          "to": "0x30b4d63b00ca3f76c94dac89b8ed70e8d3d5abe0",
          "value": 0.000000000000001,
          "gasLimit": 21000,
          "gasPrice": 51000000000,
          "chainId": "3"
        }
      }, function (ignore: any, result: any) {

        it('should not return any errors', () => {
          expect(ignore).toEqual(null);
        });

        it('should return signed tx', () => {
          expect(typeof result.signedTx).toBe('string');
        });
      });
    });
  });
});
