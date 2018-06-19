'use strict';

if (process.env.NODE_ENV === 'debug') {
  require('dotenv').config()
}

const controller = require('./api/controller');

const _createSuccessResponse = (data, requestId, status = 200) => {
  const body = {
    data,
    requestId
  };

  return _createResponseJSON(status, body);
};

const _createErrorResponse = (error, requestId) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  const body = {
    error: {
      code: `custom-${statusCode}`,
      message: error.message
    },
    requestId
  };
  return _createResponseJSON(statusCode, body);
};

const _createResponseJSON = (statusCode, body) => {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  };
};

module.exports.getAllByUserId = async (event, context) => {
  try {
    const notes = await controller.getAllByUserId(event);
    return _createSuccessResponse(notes, context.awsRequestId);
  } catch (err) {
    return _createErrorResponse(err, context.awsRequestId);
  }
};

module.exports.getByUserIdAndId = async (event, context) => {
  try {
    const note = await controller.getByUserIdAndId(event);
    return _createSuccessResponse(note, context.awsRequestId);
  } catch (err) {
    return _createErrorResponse(err, context.awsRequestId);
  }
};

module.exports.create = async (event, context) => {
  try {
    const noteCreated = await controller.create(event);
    return _createSuccessResponse(noteCreated, context.awsRequestId, 201)
  } catch (err) {
    return _createErrorResponse(err, context.awsRequestId);
  }
};

module.exports.update = async (event, context) => {
  try {
    const noteUpdated = await controller.update(event);
    return _createSuccessResponse(noteUpdated, context.awsRequestId);
  } catch (err) {
    return _createErrorResponse(err, context.awsRequestId);
  }
};

module.exports.remove = async (event, context) => {
  try {
    const noteUpdated = await controller.remove(event);
    return _createSuccessResponse(noteUpdated, context.awsRequestId);
  } catch (err) {
    return _createErrorResponse(err, context.awsRequestId);
  }
};