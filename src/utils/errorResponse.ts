export class ErrorResponse extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    public options?: {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.options = options;
  }
}
