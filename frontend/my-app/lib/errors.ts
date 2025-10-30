export const NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please ensure the backend API is running and accessible."

export function normalizeFetchError(error: unknown): Error {
  if (error instanceof TypeError) {
    return new Error(NETWORK_ERROR_MESSAGE)
  }

  if (error instanceof Error) {
    return error
  }

  return new Error(NETWORK_ERROR_MESSAGE)
}
