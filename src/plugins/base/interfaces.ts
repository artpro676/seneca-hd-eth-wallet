export interface IPlugin {
  readonly methodSign: string;
  handle(message: any): Promise<any>;
}
