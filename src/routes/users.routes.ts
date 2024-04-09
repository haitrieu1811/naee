import { Router } from 'express'

import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resendEmailVerifyValidator,
  verifyEmailValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

usersRouter.post(
  '/resend-email-verify',
  accessTokenValidator,
  resendEmailVerifyValidator,
  wrapRequestHandler(resendEmailVerifyController)
)

usersRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

usersRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

export default usersRouter
