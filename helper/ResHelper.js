const ResHelper = (res, status, success, message, data) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

export default ResHelper;
