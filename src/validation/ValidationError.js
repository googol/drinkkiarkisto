export class ValidationError extends Error {
  constructor(model, errorMessages, returnTo) {
    const message = 'Validation of a model failed';
    super(message);
    this.name = 'ValidationError';
    this.stack = (new Error(message)).stack;

    this.statusCode = 400;
    this.model = model;
    this.errorMessages = errorMessages;
    this.returnTo = returnTo;
  }
}
