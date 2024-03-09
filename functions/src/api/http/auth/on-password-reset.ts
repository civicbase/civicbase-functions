import * as functions from 'firebase-functions'
import { sendPasswordResetEmail } from 'firebase/auth'
import { middleware } from '../../../services/auth'
import { Request, Response } from '../../../types/function'
import { auth } from '../../../config/firebase'

const resetPasswordFn = (req: Request, res: Response) => {
  const { email } = req.body

  sendPasswordResetEmail(auth, email)
    .then(() => res.status(200).json({ message: 'Please check your email' }))
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ message: 'User not found' })
      }

      functions.logger.error('Reset password', error)
      return res.status(500).json({ ...error })
    })
}

export default functions.https.onRequest(middleware(resetPasswordFn, { method: 'POST' }))
