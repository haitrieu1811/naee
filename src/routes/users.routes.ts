import { Router } from 'express'

import {
  loginController,
  registerController,
  resendEmailVerifyUserController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
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
  wrapRequestHandler(resendEmailVerifyUserController)
)

usersRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

export default usersRouter
