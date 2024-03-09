import * as functions from 'firebase-functions'
import { admin } from '../config/firebase'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const corsHandler = cors({ origin: true, credentials: true })

export const auth = (req: any, res: any, next: any) => {
  // Use cookieParser directly with callback to ensure asynchronous execution is handled correctly.
  cookieParser()(req, res, () => {
    const authToken = req.cookies['__civicbase_auth_token__']
    console.log('authToken', authToken)

    if (!authToken) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Now that we have authToken, proceed to verify it.
    admin
      .auth()
      .verifySessionCookie(authToken, true) // Check if token was revoked.
      .then((decodedIdToken) => {
        req.user = {
          uid: decodedIdToken.uid,
          email: decodedIdToken.email,
          token: authToken,
        }

        next()
      })
      .catch((error) => {
        console.error('Session Cookie verification failed', error)
        return res.status(403).json({ ...error })
      })
  })
}

const isAuthenticated = async (req: any, res: any): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    cookieParser()(req, res, () => {
      const authToken = req.cookies['__civicbase_auth_token__']
      console.log('authToken', authToken)

      if (!authToken) {
        res.status(403).json({ message: 'Forbidden' })
        resolve(false)
      } else {
        admin
          .auth()
          .verifySessionCookie(authToken, true /** checkRevoked */)
          .then((decodedIdToken) => {
            req.user = {
              uid: decodedIdToken.uid,
              email: decodedIdToken.email,
              token: authToken,
            }
            resolve(true)
          })
          .catch((error) => {
            console.error('Error verifying auth token:', error)
            res.status(401).json({ message: 'Unauthorized' })
            resolve(false)
          })
      }
    })
  })
}

export const middleware =
  (handler: (req: any, res: any) => Promise<void> | void, { authenticatedRoute = false, method = '' } = {}) =>
  async (req: any, res: any) => {
    corsHandler(req, res, async () => {
      if (method === req.method || method === 'OPTIONS') {
        if (authenticatedRoute) {
          const isAuthorized = await isAuthenticated(req, res)
          if (!isAuthorized) {
            functions.logger.warn('Unauthorized user')

            return res.status(401).json({ message: 'Unauthorized' })
          }
        }

        return handler(req, res)
      } else {
        functions.logger.warn(`Wrong method ${req.method}`)

        return res.status(405).json({ message: 'Wrong Method' })
      }
    })
  }
