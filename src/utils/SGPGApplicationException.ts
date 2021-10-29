export class SGPGApplicationException {
  message: string;
  stack?: string;
  name?: string;

  constructor(message: string, _error?: Error) {
    this.message = message;
    this.stack = _error?.stack;
    this.name = _error?.name;
  }
}
