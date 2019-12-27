import { BasePlugin } from './base/_base.plugin';

export class PingpongPlugin extends BasePlugin {
  get pin() {
    return 'cmd:ping';
  }

  handle(message: any) {
    return {answer: 'pong'};
  }
}

