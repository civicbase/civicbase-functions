declare module 'express-serve-static-core' {
  interface Request {
    rawBody: Buffer;
    user?: {
      uid: string;
      email?: string;
      token: string;
    };
  }
}
