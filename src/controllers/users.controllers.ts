import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import omit from 'lodash/omit'
import { WithId } from 'mongodb'

import { USER_MESSAGES } from '~/constants/message'
import { LoginReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schema'
import userService from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as WithId<User>
  const result = await userService.login(user)
  const userConfig = omit(user, [
    'password',
    'avatar',
    'phoneNumber',
    'verifyEmailToken',
    'forgotPasswordToken',
    'addresses',
    'status',
    'role',
    'verify'
  ])
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    data: {
      ...result,
      user: userConfig
    }
  })
}

export const resendEmailVerifyUserController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await userService.resendEmailVerifyUser(userId)
  return res.json({
    message: USER_MESSAGES.RESEND_EMAIL_VERIFY_USER_SUCCESS
  })
}

export const verifyEmailController = async (req: Request, res: Response) => {
  const { userId } = req.decodedVerifyEmailToken as TokenPayload
  const result = await userService.verifyEmail(userId)
  return res.json({
    message: USER_MESSAGES.EMAIL_VERIFICATION_SUCCESS,
    data: result
  })
}
