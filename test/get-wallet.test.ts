import { getAppInstance } from './_app';


test('Wallet creation', async () => {

  const seneca: any = await getAppInstance();

  describe('Should create and return wallet', () => {

    seneca.act({
      role: 'wallet',
      cmd: 'get',
      uid: 1,
    }, function (ignore: any, result: any) {

      it('should not return any errors', () => {
        expect(ignore).toEqual(null);
      });

      it('should return non empty response', () => {
        expect(result).not.toBeUndefined();
      });
      it('should return non empty response', () => {
        expect(result).not.toBeUndefined();
      });
      it('should contains field "wallet"', () => {
        expect(result.wallet).not.toBeUndefined();
      });

    });
  });
});
