export const GENERAL_MESSAGES = {
  VALIDATION_ERROR: 'Validation error.',
  PAGE_MUST_BE_A_INTEGER_AND_POSITIVE: 'Page must be a positive integer.',
  LIMIT_MUST_BE_A_INTEGER_AND_POSITIVE: 'Limit must be a positive integer.'
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
  USER_IS_INACTIVE: 'User is inactive.',
  FORGOT_PASSWORD_SUCCESS: 'We have sent you a password reset email, please check your email.',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Successfully verified the forgot password token.',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required.',
  FORGOT_PASSWORD_TOKEN_DOES_NOT_EXIST: `Forgot password token doesn't exist.`,
  RESET_PASSWORD_SUCCESS: 'Reset password successfully.',
  CHANGE_PASSWORD_SUCCESS: 'Password changed successfully.',
  OLD_PASSWORD_IS_REQUIRED: 'Old password is required.',
  OLD_PASSWORD_IS_INCORRECT: 'The old password is incorrect.',
  GET_ME_SUCCESS: 'Retrieve my account information successfully.',
  UDPATE_ME_SUCCESS: 'Updated my account information successfully.',
  PHONE_NUMBER_IS_INVALID: 'Invalid phone number.',
  PHONE_NUMBER_ALREADY_EXISTS: 'Phone number already exists.',
  AVATAR_IS_INVALID: 'Invalid avatar.',
  USER_IS_UNVERIFIED: 'Your account has not been verified.'
} as const

export const FILE_MESSAGES = {
  IMAGE_FILE_TYPE_INVALID: 'Invalid image file type.',
  IMAGE_FIELD_IS_REQUIRED: 'Image field is required.',
  UPLOAD_IMAGE_SUCCESS: 'Image uploaded successfully.'
}

export const ADDRESS_MESSAGES = {
  CREATE_ADDRESS_SUCCESS: 'Address created successfully.',
  FULLNAME_IS_REQUIRED: 'Fullname is required.',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required.',
  PHONE_NUMBER_IS_INVALID: 'Invalid phone number.',
  ADDRESS_TYPE_IS_REQUIRED: 'Address type is required.',
  ADDRESS_TYPE_IS_INVALID: 'Invalid address type.',
  PROVINCE_ID_IS_REQUIRED: 'Province id is required.',
  PROVINCE_ID_IS_INVALID: 'Invalid province id.',
  PROVINCE_NOT_FOUND: 'Province not found.',
  DISTRICT_ID_IS_REQUIRED: 'District id is required.',
  DISTRICT_ID_IS_INVALID: 'Invalid district id.',
  WARD_ID_IS_REQUIRED: 'Ward id is required.',
  WARD_ID_IS_INVALID: 'Invalid ward id.',
  SPECIFIC_ADDRESS_IS_REQUIRED: 'Spetific adddress is required.',
  STREET_ID_IS_INVALID: 'Invalid street id.',
  IS_DEFAULT_MUST_BE_A_BOOLEAN: 'Is default value must be a boolean.',
  UPDATE_ADDRESS_SUCCESS: 'Address updated successfully.',
  ADDRESS_ID_IS_REQUIRED: 'Address id is required.',
  ADDRESS_ID_IS_INVALID: 'Invalid address id.',
  ADDRESS_NOT_FOUND: 'Address not found.',
  PERMISSION_DENIED: 'Permission denied.',
  DELETE_ADDRESS_SUCCESS: 'Address deleted successfully.',
  GET_ALL_ADDRESSES_SUCCESS: 'Get all addresses successfully.',
  GET_ONE_ADDRESS_SUCCESS: 'Get address successfully.',
  GET_DISTRICTS_SUCCESS: 'Get the list of districts successfully.',
  GET_ALL_PROVINCES_SUCCESS: 'Get a list of all successful provinces.',
  GET_WARDS_SUCCESS: 'Get the list of wards successfully.'
}
