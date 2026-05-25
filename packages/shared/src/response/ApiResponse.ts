export const sendSuccess = <T>(data: T, message?: string) => {
  return {
    success: true,
    data,
    message,
  };
};

export const sendError = (code: string, message: string) => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
