/**
 * Response constants for the Admin.
 */
 const Auth = {
  'UNAUTHORIZED': 'Unauthorized',
  'FAILED_TO_LOGOUT': 'Failed to logout',
  'EMAIL_VERIFICATION_FAILED': 'Link is invalid or expired. Please try again.',
};

const Org_Auth = {
  'BAD_REQUEST': 'Bad request',
  'DUPLICATE_NAME':'Name must be unique',
  'INVALID_CREDENTIAL': 'Invalid credential',
  'INVALID_CONFIGURATION': 'Invalid configuration',
  'INVALID_AUTH_URL': 'Invalid authentication url',
  'INVALID_CLIENT': 'Client authentication failed. Make sure that the client ID and client secret are valid.',
};

const AdminRes = {
  'LINK_INVALID': 'Invalid Link',
  'USER_NOT_FOUND': 'User not found',
  'EMAIL_ALREADY_EXIST': 'Another user with the same email id exists.',
  'PASSWORD_SENT_ON_EMAIL': 'Password reset link sent to your email account',
  'PASS_SUCC_RESET': 'Password reset sucessfully.'
};

const Category = {
  'CAT_SUCC_FECHED' : 'Category records successfully fetched'
}

const Product = {
  'PRODUCT_SUCC_FECHED' : 'Products records successfully fetched'
}

const Language = {
  'LANGUAGE_SUCC_FECHED' : 'Languages records successfully fetched',
  'LANGUAGE_SUCC_UPDATE' : 'Languages successfully updated',
}

module.exports = {
  Auth,
  AdminRes,
  Org_Auth,
  Category,
  Product,
  Language
};