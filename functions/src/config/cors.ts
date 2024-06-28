import { CorsOptions } from 'cors';

const allowedOrigins: string[] = [
  'https://civicbase.io',
  'https://civicbase-dev.web.app',
];

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  allowedOrigins.push('http://localhost:3000');
}

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
