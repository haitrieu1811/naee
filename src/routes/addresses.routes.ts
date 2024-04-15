import { Router } from 'express'

import { createAddressController } from '~/controllers/addresses.controllers'
import { createAddressValidator } from '~/middlewares/addresses.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const addressesRouter = Router()

addressesRouter.post('/', accessTokenValidator, createAddressValidator, wrapRequestHandler(createAddressController))

export default addressesRouter
