export interface IPlugin {
  readonly pin: string;
  handle(message: any): Promise<any>;
}
