import { Router } from 'express'

import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
