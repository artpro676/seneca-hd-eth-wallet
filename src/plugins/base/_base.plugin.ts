import { IPlugin } from './interfaces';

export abstract class BasePlugin implements IPlugin{

  /* eslint-disable  @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  private config: any;
  /* eslint-enable  @typescript-eslint/ban-ts-ignore */

  abstract readonly methodSign: string;

  constructor(config: any) {
    this.config = config;
  }

  abstract handle(message: any): any | Promise<any>
}
