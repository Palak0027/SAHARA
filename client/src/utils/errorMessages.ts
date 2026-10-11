/**
 * Central Error Message Translator
 * Converts raw backend, MongoDB, and network errors into clean, user-friendly messages.
 */

interface ErrorPattern {
  patterns: RegExp[];
  message: string;
}

const ERROR_MAP: ErrorPattern[] = [
  // Duplicate / Unique Constraint (MongoDB E11000)
  {
    patterns: [
      /duplicate key/i,
      /E11000/i,
      /already exists/i,
      /unique constraint/i,
    ],
    message: 'This record or email already exists. Please use a different value.',
  },

  // Not Found
  {
    patterns: [/not found/i, /resource not found/i, /404/],
    message: 'The requested resource could not be found.',
  },

  // Validation / Missing Fields
  {
    patterns: [
      /validation failed/i,
      /path `.*` is required/i,
      /is required/i,
      /cast to .* failed/i,
    ],
    message: 'Please fill in all required fields with valid information.',
  },

  // Authentication & Permission
  {
    patterns: [
      /unauthorized/i,
      /forbidden/i,
      /permission denied/i,
      /access denied/i,
      /invalid credentials/i,
      /401/,
      /403/,
    ],
    message: 'Authentication failed or you do not have permission for this action.',
  },

  // Expired Session
  {
    patterns: [/token expired/i, /jwt expired/i, /session expired/i],
    message: 'Your session has expired. Please log in again to continue.',
  },

  // Network / Connection
  {
    patterns: [
      /network error/i,
      /econnrefused/i,
      /enotfound/i,
      /timeout/i,
      /failed to fetch/i,
      /err_network/i,
    ],
    message: 'Unable to connect to server. Please check your internet connection or backend server status.',
  },

  // Server Internal Error
  {
    patterns: [/internal server error/i, /500/],
    message: 'An unexpected server error occurred. Please try again in a moment.',
  },
];

export function getFriendlyErrorMessage(
  rawMessage: string | undefined | null,
  fallback?: string
): string {
  if (!rawMessage) {
    return fallback || 'An unexpected error occurred. Please try again.';
  }

  // Preserve clear, human-readable specific backend validation messages
  if (
    rawMessage.startsWith('A user with this') ||
    rawMessage.startsWith('Please provide') ||
    rawMessage.startsWith('Full name') ||
    rawMessage.startsWith('Password must')
  ) {
    return rawMessage;
  }

  for (const entry of ERROR_MAP) {
    if (entry.patterns.some((pattern) => pattern.test(rawMessage))) {
      return entry.message;
    }
  }

  // If short and non-technical, return as-is
  if (
    rawMessage.length < 90 &&
    !/[{}[\]();]/.test(rawMessage) &&
    !/\b(mongo|mongoose|cast|e11000|stack|at\s)/i.test(rawMessage)
  ) {
    return rawMessage;
  }

  return fallback || 'Something went wrong. Please try again.';
}
