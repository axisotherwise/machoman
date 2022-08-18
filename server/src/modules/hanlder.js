export default (boolean, message, ...result) => {
  return {
    success: boolean,
    message,
    result: {
      result,
    },
  };
};