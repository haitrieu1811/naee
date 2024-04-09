export const GENERAL_MESSAGES = {
  VALIDATION_ERROR: 'Validation error.'
} as const

export const USER_MESSAGES = {
  REGISTER_SUCCESS: 'Registered successfully.',
  EMAIL_IS_REQUIRED: 'Email is required.',
  EMAIL_IS_INVALID: 'Email is invalid.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required.',
  RESEND_EMAIL_VERIFY_USER_SUCCESS: 'Resend the user verification email successfully.',
  EMAIL_DOES_NOT_EXIST: `Email doesn't exist on the system.`,
  PASSWORD_LENGTH_IS_INVALID: 'Password must be between 8 and 32 characters long.',
  PASSWORD_IS_NOT_STRONG_ENOUGH:
    'Password must include numbers, uppercase and lowercase letters, and at least one special character.',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required.',
  CONFIRM_PASSWORD_DOES_NOT_MATCH: `Confirm password doesn't match.`,
  PASSWORD_OR_EMAIL_IS_INCORRECT: 'Email or password is incorrect.',
  LOGIN_SUCCESS: 'Logged in successfully.',
  EMAIL_VERIFICATION_SUCCESS: 'Email verification successful.',
  VERIFY_EMAIL_TOKEN_IS_REQUIRED: 'Verify email token is required.',
  VERIFY_EMAIL_TOKEN_DOES_NOT_EXIST: `Verify email token doesn't exist.`,
  VERIFIED_USER: 'User has been verified before.',
  LOGOUT_SUCCESS: 'Logout successfully.',
  REFRESH_TOKEN_IS_REQUIRED: `Refresh token is required.`,
  REFRESH_TOKEN_DOES_NOT_EXIST: `Refresh token doesn't exist.`,
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully.',
  USER_IS_INACTIVE: 'User is inactive.'
} as const
