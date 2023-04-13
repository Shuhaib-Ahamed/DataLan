export const success = (res, code, data) => {
  return res.status(code).send({
    succeeded: true,
    data
  });
};

export const failed = (res, code, message) => {
  return res.status(code).send({
    succeeded: false,
    message
  });
};

export const validation = (errors) => {
  return {
    message: 'Validation errors',
    error: true,
    code: 422,
    errors
  };
};
