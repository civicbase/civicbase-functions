import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase-client';
import { adminAuth } from '../../config/firebase';

const login = async (req: any, res: any): Promise<void> => {
  // Your function logic here
  // res.status(200).send('Response from your function');

  const { email, password } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (!user.emailVerified) {
      res.status(403).json({ message: 'Please verify your email address' });
    }

    const idToken = await user.getIdToken();
    const token = await adminAuth.createSessionCookie(idToken, { expiresIn });

    res.cookie('__civicbase_auth_token__', token, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
    });

    return res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export default login;
