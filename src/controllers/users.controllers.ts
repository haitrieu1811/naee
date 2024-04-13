import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import omit from 'lodash/omit'
import { WithId } from 'mongodb'

import { USER_MESSAGES } from '~/constants/message'
import {
  ChangePasswordReqBody,
  ForgotPasswordTokenReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
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

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await userService.resendEmailVerify(userId)
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

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  await userService.logout(req.body.refreshToken)
  return res.json({
    message: USER_MESSAGES.LOGOUT_SUCCESS
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { userId, verify, status, role, exp } = req.decodedRefreshToken as TokenPayload
  const result = await userService.refreshToken({
    refreshToken: req.body.refreshToken,
    userId,
    verify,
    status,
    role,
    refreshTokenExp: exp
  })
  return res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: result
  })
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const user = req.user as WithId<User>
  const { _id, email } = user
  await userService.forgotPassword({
    userId: _id.toString(),
    email
  })
  return res.json({
    message: USER_MESSAGES.FORGOT_PASSWORD_SUCCESS
  })
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordTokenReqBody>,
  res: Response
) => {
  return res.json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { userId } = req.decodedForgotPasswordToken as TokenPayload
  const result = await userService.resetPassword({
    password: req.body.password,
    userId
  })
  return res.json({
    message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
    data: result
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await userService.changePassword({
    userId,
    password: req.body.password
  })
  return res.json({
    message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    data: result
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await userService.getMe(userId)
  return res.json({
    message: USER_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
}
