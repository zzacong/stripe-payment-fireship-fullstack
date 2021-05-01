import { Request, Response, NextFunction } from 'express'

/**
 * Catch async errors when awaiting promises
 */
export function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next)
  }
}

/**
 * Throws an error if the currentUser does not exist on the request
 */
export function validateUser(req: Request) {
  const user = req.currentUser
  if (!user) {
    throw new Error(
      'You must be logged in to make this request. i.e. Authorization: Bearer <token>'
    )
  }
  return user
}
