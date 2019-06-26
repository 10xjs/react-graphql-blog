interface HLJSMessage {
  type: 'HIGHLIGHT';
  id: string;
  value: string;
  language: string;
}

interface HLJSResponseMessage {
  type: 'HIGHLIGHT_RESPONSE';
  id: string;
  value: string;
  language: string;
}

export type HLJSWorkerMessage = HLJSMessage | HLJSResponseMessage;

export interface HLJSWorkerMessageEvent extends MessageEvent {
  data: HLJSWorkerMessage;
}

type EventListener<T> = (event: T) => void;

interface EventListenerObject<T> {
  handleEvent: EventListener<T>;
}

type EventListenerOrEventListenerObject<T> =
  | EventListener<T>
  | EventListenerObject<T>;

export declare class HLJSWorker extends Worker {
  constructor();

  onmessage: ((this: HLJSWorker, ev: HLJSWorkerMessageEvent) => any) | null;

  postMessage(message: HLJSWorkerMessage, transfer: Transferable[]): void;
  postMessage(message: HLJSWorkerMessage, options?: PostMessageOptions): void;

  addEventListener(
    type: 'message',
    listener: EventListenerOrEventListenerObject<HLJSWorkerMessageEvent>,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: 'message',
    listener: EventListenerOrEventListenerObject<HLJSWorkerMessageEvent>,
    options?: boolean | EventListenerOptions,
  ): void;
}
