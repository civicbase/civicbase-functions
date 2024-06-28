import cors from 'cors';
import { adminAuth } from './firebase';

const corsHandler = cors({
  origin: 'http://localhost:3000',
  credentials: true,
});

const isAuthenticated = async (req: any, res: any): Promise<boolean> => {
  return new Promise((resolve) => {
    const authToken = req.cookies['__civicbase_auth_token__'];
    console.log('authToken', authToken);

    if (!authToken) {
      res.status(403).json({ message: 'Forbidden' });
      resolve(false);
    } else {
      adminAuth
        .verifySessionCookie(authToken, true /** checkRevoked */)
        .then((decodedIdToken) => {
          req.user = {
            uid: decodedIdToken.uid,
            email: decodedIdToken.email,
            token: authToken,
          };
          resolve(true);
        })
        .catch((error) => {
          console.error('Error verifying auth token:', error);
          res.status(401).json({ message: 'Unauthorized' });
          resolve(false);
        });
    }
  });
};

export const middleware =
  (
    handler: (req: any, res: any) => Promise<void> | void,
    { authenticatedRoute = false, method = '' } = {},
  ) =>
  async (req: any, res: any) => {
    console.log('######', req);
    corsHandler(req, res, async () => {
      if (req.method === 'OPTIONS') {
        // Handle preflight request
        return res.status(204).end();
      }

      console.log('CAME HERE 2');
      if (method === req.method || req.method === 'OPTIONS') {
        console.log('CAME HERE 3');
        if (authenticatedRoute) {
          const isAuthorized = await isAuthenticated(req, res);
          if (!isAuthorized) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
        }

        return handler(req, res);
      } else {
        return res.status(405).json({ message: 'Wrong Method' });
      }
    });
  };

// export const middleware =
//   (
//     handler: (req: any, res: any) => Promise<void> | void,
//     { authenticatedRoute = false, method = '' } = {},
//   ) =>
//   async (req: any, res: any) => {
//     console.log('method', req.method);
//     corsHandler(req, res, async () => {
//       if (method === req.method || method === 'OPTIONS') {
//         if (authenticatedRoute) {
//           const isAuthorized = await isAuthenticated(req, res);
//           if (!isAuthorized) {
//             return res.status(401).json({ message: 'Unauthorized' });
//           }
//         }

//         return handler(req, res);
//       } else {
//         return res.status(405).json({ message: 'Wrong Method' });
//       }
//     });
//   };
