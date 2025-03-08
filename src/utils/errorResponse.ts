export class ErrorResponse extends Error {
  constructor(
    message: string | string[],
    readonly statusCode: number,
    public options?: {}
  ) {
    super(message as string);
    this.statusCode = statusCode;
    this.options = options;
  }
}
