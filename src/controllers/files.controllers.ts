import { Request, Response } from 'express'

import { FILE_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/requests/User.requests'
import fileService from '~/services/files.services'
import { sendFileFromS3 } from '~/utils/s3'

export const uploadImageController = async (req: Request, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await fileService.uploadImage({ req, userId })
  return res.json({
    message: FILE_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    data: result
  })
}

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params
  sendFileFromS3(res, `images/${name}`)
}
