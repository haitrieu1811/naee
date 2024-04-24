import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import Review from '~/models/schemas/Review.schema'
import ReviewReply from '~/models/schemas/ReviewReply.schema'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class ReviewService {
  async create({ dto, productId, userId }: { dto: CreateReviewReqBody; productId: string; userId: string }) {
    const { insertedId } = await databaseService.reviews.insertOne(
      new Review({
        ...dto,
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        photos: dto.photos?.map((item) => new ObjectId(item))
      })
    )
    const insertedReview = await databaseService.reviews.findOne({ _id: insertedId })
    return {
      review: insertedReview
    }
  }

  async update({ dto, reviewId }: { dto: UpdateReviewReqBody; reviewId: string }) {
    const updatedReview = await databaseService.reviews.findOneAndUpdate(
      {
        _id: new ObjectId(reviewId)
      },
      {
        $set: {
          ...dto,
          photos: dto.photos.map((item) => new ObjectId(item))
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      review: updatedReview
    }
  }

  async delete(reviewId: string) {
    await databaseService.reviews.deleteOne({ _id: new ObjectId(reviewId) })
    return true
  }

  async reply({ reviewId, content, userId }: { reviewId: string; userId: string; content: string }) {
    const { insertedId } = await databaseService.reviewReplies.insertOne(
      new ReviewReply({
        reviewId: new ObjectId(reviewId),
        userId: new ObjectId(userId),
        content
      })
    )
    const [updatedReview, insertedReviewReply] = await Promise.all([
      databaseService.reviews.findOneAndUpdate(
        {
          _id: new ObjectId(reviewId)
        },
        {
          $push: {
            replies: insertedId
          },
          $currentDate: {
            updatedAt: true
          }
        },
        {
          returnDocument: 'after'
        }
      ),
      databaseService.reviewReplies.findOne({ _id: insertedId })
    ])
    return {
      review: updatedReview,
      reviewReply: insertedReviewReply
    }
  }

  async updateReply({ replyId, content }: { replyId: string; content: string }) {
    const updatedReply = await databaseService.reviewReplies.findOneAndUpdate(
      {
        _id: new ObjectId(replyId)
      },
      {
        $set: {
          content
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      replyReview: updatedReply
    }
  }

  async deleteReply(replyId: string) {
    await databaseService.reviewReplies.deleteOne({ _id: new ObjectId(replyId) })
    return true
  }

  async getProductReviews({ productId, query }: { productId: string; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { productId: new ObjectId(productId) }
    const [reviews, totalRows] = await Promise.all([
      databaseService.reviews
        .aggregate([
          {
            $match: match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $unwind: {
              path: '$author'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'author.avatar',
              foreignField: '_id',
              as: 'authorAvatar'
            }
          },
          {
            $unwind: {
              path: '$authorAvatar',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'photos',
              foreignField: '_id',
              as: 'photos'
            }
          },
          {
            $lookup: {
              from: 'reviewReplies',
              localField: 'replies',
              foreignField: '_id',
              as: 'replies'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'replies.userId',
              foreignField: '_id',
              as: 'replyAuthors'
            }
          },
          {
            $addFields: {
              'author.avatar': {
                $cond: {
                  if: '$authorAvatar',
                  then: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$authorAvatar.name']
                  },
                  else: ''
                }
              },
              photos: {
                $map: {
                  input: '$photos',
                  as: 'photo',
                  in: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$$photo.name']
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$replies',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              'replies.author': {
                $cond: {
                  if: '$replies',
                  then: {
                    $filter: {
                      input: '$replyAuthors',
                      as: 'item',
                      cond: {
                        $eq: ['$$item._id', '$replies.userId']
                      }
                    }
                  },
                  else: null
                }
              }
            }
          },
          {
            $unwind: {
              path: '$replies.author',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'replies.author.avatar',
              foreignField: '_id',
              as: 'replyAuthorAvatars'
            }
          },
          {
            $unwind: {
              path: '$replyAuthorAvatars',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              'replies.author.avatar': {
                $cond: {
                  if: '$replyAuthorAvatars',
                  then: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$replyAuthorAvatars.name']
                  },
                  else: null
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              starPoint: {
                $first: '$starPoint'
              },
              author: {
                $first: '$author'
              },
              content: {
                $first: '$content'
              },
              photos: {
                $first: '$photos'
              },
              replies: {
                $push: '$replies'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              }
            }
          },
          {
            $addFields: {
              replies: {
                $cond: {
                  if: {
                    $first: '$replies.author.avatar'
                  },
                  then: '$replies',
                  else: []
                }
              }
            }
          },
          {
            $project: {
              'author.password': 0,
              'author.phoneNumber': 0,
              'author.verifyEmailToken': 0,
              'author.forgotPasswordToken': 0,
              'author.addresses': 0,
              'author.status': 0,
              'author.role': 0,
              'author.verify': 0,
              'author.createdAt': 0,
              'author.updatedAt': 0,
              'replies.author.password': 0,
              'replies.author.phoneNumber': 0,
              'replies.author.verifyEmailToken': 0,
              'replies.author.forgotPasswordToken': 0,
              'replies.author.addresses': 0,
              'replies.author.status': 0,
              'replies.author.role': 0,
              'replies.author.verify': 0,
              'replies.author.createdAt': 0,
              'replies.author.updatedAt': 0,
              'replies.userId': 0
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.reviews.countDocuments(match)
    ])
    return {
      reviews,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const reviewService = new ReviewService()
export default reviewService
