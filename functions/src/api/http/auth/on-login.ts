import * as functions from 'firebase-functions'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { admin, db, auth } from '../../../config/firebase'
import { middleware } from '../../../services/auth'
import { Request, Response } from '../../../types/function'

const loginFn = (req: Request, res: Response) => {
  const { email, password } = req.body
  let uid: string

  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      uid = user.uid

      if (!user.emailVerified) {
        res.status(403).json({ message: 'Please verify your email address' })
      }

      return user.getIdToken()
    })
    .then((idToken: string) => {
      const expiresIn = 60 * 60 * 24 * 5 * 1000

      return admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then((token: string) => {
          db.doc(`/users/${uid}`)
            .get()
            .then((doc) => {
              res.cookie('__civicbase_auth_token__', token, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                // TODO: LAX
              })

              return res.status(200).json({ user: doc.data(), token })
            })
        })
        .catch((error) => {
          functions.logger.error('Unauthorized request', error)
          res.status(401).json({ message: 'Unauthorized request', ...error })
        })
    })
    .catch((error) => {
      functions.logger.error(error)
      res.status(403).json({ message: 'Your email or password is incorrect', ...error })
    })
}

export default functions.https.onRequest(middleware(loginFn, { method: 'POST' }))
