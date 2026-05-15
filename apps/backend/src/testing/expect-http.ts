import type { Response } from 'supertest';

/** Domain errors from GenerateHttpExceptionFilter. */
export function expectDomainError(
  res: Response,
  code: string,
  status = 400,
): void {
  expect(res.status).toBe(status);
  expect(res.body).toEqual({
    ok: false,
    error: {
      code,
      message: expect.any(String),
    },
  });
}

/** DTO / ValidationPipe errors also pass through GenerateHttpExceptionFilter. */
export function expectValidationRejected(res: Response, status = 400): void {
  expect(res.status).toBe(status);
  if (res.body?.ok === false && res.body?.error) {
    expect(res.body.error.message).toEqual(expect.any(String));
    return;
  }
  expect(res.body.statusCode).toBe(status);
}
