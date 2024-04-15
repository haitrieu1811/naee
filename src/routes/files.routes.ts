import { Router } from 'express'

import { uploadImageController } from '~/controllers/files.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const filesRouter = Router()

filesRouter.post('/upload-image', accessTokenValidator, wrapRequestHandler(uploadImageController))

export default filesRouter
