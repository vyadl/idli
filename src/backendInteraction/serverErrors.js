const ERROR_MESSAGES = {
  signIn: 'Invalid username and/or password.',
  wrongCode: 'Validation code is invalid.',
  expiredCode: 'Validation code is expired. Please resend it.',
  wrongCurrentPassword: 'Current password is incorrect, please double-check it.',
};

const ERROR_CODES_AND_MESSAGES_ACCORDANCE = {
  CREDENTIALS_ERROR: ERROR_MESSAGES.signIn,
  NOT_FOUND_USER_ERROR: ERROR_MESSAGES.signIn,
  DELETED_USER_ERROR: ERROR_MESSAGES.signIn,

  SIGNUP_WRONG_CODE_ERROR: ERROR_MESSAGES.wrongCode,
  SIGNUP_EXPIRED_CODE_ERROR: ERROR_MESSAGES.expiredCode,

  RESET_PASSWORD_WRONG_CODE_ERROR: ERROR_MESSAGES.wrongCode,
  RESET_PASSWORD_EXPIRED_CODE_ERROR: ERROR_MESSAGES.expiredCode,

  WRONG_CURRENT_PASSWORD_ERROR: ERROR_MESSAGES.wrongCurrentPassword,
};

export function getErrorMessage(errorData) {
  const message = errorData?.message;
  const code = errorData?.code;

  return ERROR_CODES_AND_MESSAGES_ACCORDANCE[code]
    || message
    || 'Something went wrong';
}

export const REFRESH_TRIGGER_ERROR_CODE = 'ACCESS_TOKEN_INVALID_ERROR';
export const LOGOUT_TRIGGER_ERROR_CODES = new Set([
  'ACCESS_TOKEN_ABSENT_ERROR',
  'REFRESH_TOKEN_WRONG_ERROR',
  'REFRESH_TOKEN_EXPIRED_ERROR',
]);
