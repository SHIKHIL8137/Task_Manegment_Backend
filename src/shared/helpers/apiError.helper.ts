export class ApiError extends Error {
  status: number;
  meta?: Record<string, string | boolean | number>;

  constructor(status: number, message: string,meta?: Record<string, string | boolean | number>) {
    super(message); 
    this.status = status; 
    if (meta) this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}
