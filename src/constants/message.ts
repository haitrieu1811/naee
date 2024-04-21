export const GENERAL_MESSAGES = {
  VALIDATION_ERROR: 'Validation error.',
  PAGE_MUST_BE_A_INTEGER_AND_POSITIVE: 'Page must be a positive integer.',
  LIMIT_MUST_BE_A_INTEGER_AND_POSITIVE: 'Limit must be a positive integer.',
  PHOTOS_MUST_BE_AN_ARRAY: 'Photos must be an array.',
  PHOTOS_MUST_BE_AN_ARRAY_OBJECTID: 'Photos must be an array of objectIds.'
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
  USER_IS_UNVERIFIED: 'Your account has not been verified.',
  PERMISSION_DENIED: 'Permission denied.'
} as const

export const FILE_MESSAGES = {
  IMAGE_FILE_TYPE_INVALID: 'Invalid image file type.',
  IMAGE_FIELD_IS_REQUIRED: 'Image field is required.',
  UPLOAD_IMAGE_SUCCESS: 'Image uploaded successfully.'
} as const

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
  GET_WARDS_SUCCESS: 'Get the list of wards successfully.',
  GET_STREETS_SUCCESS: 'Get the list of streets successfully.'
} as const

export const PRODUCT_MESSAGES = {
  CREATE_PRODUCT_CATEGORY_SUCCESS: 'Create a successful product catalog.',
  UPDATE_PRODUCT_CATEGORY_SUCCESS: 'Updated product catalog successfully.',
  DELETE_PRODUCT_CATEGORY_SUCCESS: 'Product category deleted successfully.',
  PRODUCT_CATEGORY_NAME_IS_REQUIRED: 'Product category name is required.',
  PRODUCT_CATEGORY_ID_IS_REQUIRED: 'Product category id is required.',
  PRODUCT_CATEGORY_ID_IS_INVALID: 'Invalid product category id.',
  PRODUCT_CATEGORY_NOT_FOUND: 'Product category not found.',
  GET_ALL_CATEGORIES_SUCCESS: 'Get the list of all categories successfully.',
  CREATE_BRAND_SUCCESS: 'Create a successful brand.',
  UPDATE_BRAND_SUCCESS: 'Brand update successful.',
  DELETE_BRAND_SUCCESS: 'Delete update successful.',
  GET_ALL_BRANDS_SUCCESS: 'Get a list of all successful brands.',
  BRAND_ID_IS_REQUIRED: 'Brand id is required.',
  BRAND_ID_IS_INVALID: 'Invalid brand id.',
  BRAND_NOT_FOUND: 'Brand not found.',
  BRAND_NAME_IS_REQUIRED: 'Brand name is required.',
  BRAND_NATION_IS_REQUIRED: 'Brand nation is required.',
  CREATE_PRODUCT_SUCCESS: 'Create a successful product.',
  PRODUCT_THUMBNAIL_IS_REQUIRED: 'Product thumbnail is required.',
  PRODUCT_DESCRIPTION_IS_REQUIRED: 'Product description is required.',
  PRODUCT_THUMBNAIL_IS_INVALID: 'Invalid product thumbnail.',
  PRODUCT_NAME_IS_REQUIRED: 'Product name is required.',
  PRODUCT_AVAILABEL_COUNT_IS_REQUIRED: 'Product available count is required.',
  PRODUCT_AVAILABEL_COUNT_MUST_BE_AN_INT: 'Product available count must be an integer.',
  PRODUCT_AVAILABEL_COUNT_MUST_BE_GREATER_THAN_ZERO: 'Product available count must be greater than zero.',
  PRODUCT_PRICE_IS_REQUIRED: 'Product price is required.',
  PRODUCT_PRICE_MUST_BE_AN_INT: 'Product price must be an integer.',
  PRODUCT_PRICE_MUST_BE_GREATER_THAN_ZERO: 'Product price must be greater than zero.',
  PRODUCT_DISCOUNT_TYPE_IS_INVALID: 'Invalid product discount type.',
  PRODUCT_DISCOUNT_VALUE_MUST_BE_AN_INT: 'Product discount value must be an integer.',
  PRODUCT_DISCOUNT_VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_ZERO:
    'Product discount value must be greater than or equal zero.',
  UPDATE_PRODUCT_SUCCESS: 'Product update successful.',
  PRODUCT_ID_IS_REQUIRED: 'Product id is required.',
  PRODUCT_ID_IS_INVALID: 'Invalid product id.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  DELETE_PRODUCT_SUCCESS: 'Product deletion successful.',
  GET_PRODUCTS_SUCCESS: 'Get the product list successfully.',
  PRODUCT_DISCOUNT_VALUE_CAN_NOT_BE_GREATER_THAN_ORIGINAL_PRICE:
    'Product discount value can not be greater than original price.',
  PRODUCT_DISCOUNT_VALUE_CAN_NOT_BE_GREATER_THAN_100: 'Product discount value can not be greater than 100.'
} as const

export const CART_MESSAGES = {
  ADD_TO_CART_SUCCESS: 'Added product to cart successfully.',
  QUANTITY_IS_REQUIRED: 'Quantity is required.',
  QUANTITY_MUST_BE_AN_INT: 'Quantity must be an integer.',
  QUANTITY_MUST_BE_GREATER_THAN_ZERO: 'Quantity must be greater than zero.',
  UPDATE_QUANTITY_SUCCESS: 'Updated quantity successfully.',
  CART_ITEM_ID_IS_REQUIRED: 'Cart item id is required.',
  CART_ITEM_ID_IS_INVALID: 'Invalid cart item id.',
  CART_ITEM_NOT_FOUND: 'Cart item not found.',
  DELETE_CART_ITEM_SUCCESS: 'Deleted cart item successfully.',
  DELETE_ALL_CART_SUCCESS: 'Successfully deleted all products in the cart.',
  GET_CART_ITEMS_SUCCESS: 'Get cart items successfully.',
  ORDER_SUCCESS: 'Order success.',
  TOTAL_AMOUNT_REDUCED_IS_REQUIRED: 'Total amount reduced is required.',
  TOTAL_AMOUNT_REDUCED_MUST_BE_AN_INT: 'Total amount reduced must be an integer.',
  TOTAL_AMOUNT_REDUCED_MUST_BE_GREATER_THAN_OR_EQUAL_ZERO: 'Total amount reduced must be greater than or equal zero.',
  TOTAL_AMOUNT_REDUCED_MUST_BE_LESS_THAN_TOTAL_AMOUNT: 'Total amount reduced must be less than total amount.',
  CART_IS_EMPTY: 'Cart is empty.'
} as const

export const VOUCHER_MESSAGES = {
  VOUCHER_ID_IS_INVALID: 'Invalid voucher id.'
} as const

export const ORDER_MESSAGES = {
  GET_MY_ORDERS_SUCCESS: 'Get my orders successfully.',
  GET_ALL_ORDERS_SUCCESS: 'Get all orders successfully.',
  CANCEL_ORDER_SUCCESS: 'Cancel order successfully.',
  ORDER_ID_IS_REQUIRED: 'Order id is required.',
  ORDER_ID_IS_INVALID: 'Invalid order id.',
  ORDER_NOT_FOUND: 'Order not found.',
  CAN_NOT_CANCEL_ORDER: 'Order cannot be canceled.',
  UPDATE_ORDER_STATUS_SUCCESS: 'Update order status successfully.',
  ORDER_STATUS_IS_REQUIRED: 'Order status is required.',
  ORDER_STATUS_IS_INVALID: 'Invalid order status.',
  DELETE_ORDER_SUCCESS: 'Order deleted successfully.'
} as const

export const REVIEW_MESSAGES = {
  STAR_POINT_IS_REQUIRED: 'Star point is required.',
  STAR_POINT_IS_INVALID: 'Invalid star point.',
  CREATE_REVIEW_SUCCESS: 'Create a successful review.',
  REVIEWED_BEFORE: 'You have reviewed this product before.',
  UPDATE_REVIEW_SUCCESS: 'Updated review successfully.',
  REVIEW_ID_IS_REQUIRED: 'Review id is required.',
  REVIEW_ID_IS_INVALID: 'Invalid review id.',
  REVIEW_NOT_FOUND: 'Review not found.',
  CONTENT_IS_REQUIRED: 'Review content is required.'
} as const
