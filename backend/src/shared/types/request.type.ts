export { Request } from 'express';

export type RequestWith<T> = Request & T;
