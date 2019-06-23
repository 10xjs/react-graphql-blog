/// <reference types="net" />

declare module 'killable' {
  import {Server} from 'net';

  function killable<T extends Server>(
    server: T,
  ): T & {kill(callback: () => void): void};

  export = killable;
}
