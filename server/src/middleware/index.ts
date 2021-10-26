import { Request, Response, NextFunction } from 'express'
import { auth } from '../firebase'

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
export async function decodeJWT(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split(' ')[1] // get string after 'Bearer '

    try {
      const decodedToken = await auth.verifyIdToken(idToken)
      req.currentUser = decodedToken
    } catch (err) {
      console.log(err)
    }
  }

  next()
}
