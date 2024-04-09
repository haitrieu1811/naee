import 'express'
import { WithId } from 'mongodb'

import { TokenPayload } from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schema'

declare module 'express' {
  interface Request {
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedVerifyEmailToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
    user?: WithId<User>
  }
}
