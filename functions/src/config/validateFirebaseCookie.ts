import { adminAuth } from './firebase';

const validateFirebaseCookie = async (req: any, res: any, next: any) => {
  const sessionCookie = req.cookies.__civicbase_auth_token__;

  if (!sessionCookie) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return res.status(401).send('Unauthorized');
  }
};

export default validateFirebaseCookie;
