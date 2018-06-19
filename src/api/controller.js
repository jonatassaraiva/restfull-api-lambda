'use strict';

const NotesModel = require('./model');
const bodyParser = require('../helpers/body.parser');

const _getByUserIdAndId = (userId, id) => {
  return NotesModel.get({ userId, id })
    .then(result => {
      if (result) {
        return result;
      }

      const error = new Error(`Not found resource id: ${id}`);
      error.statusCode = 404;
      return Promise.reject(error);
    });
};

const getAllByUserId = (req) => {
  const userId = req.headers['x-user-id'];
  const lastId = req.queryStringParameters ? req.queryStringParameters['lastId'] : null;

  const query = NotesModel.query({ userId });
  if (lastId) {
    query.startAt({ id: { S: lastId }, userId: { S: userId } });
  }
  query.limit(10);

  return query.exec();
};

const getByUserIdAndId = (req) => {
  const userId = req.headers['x-user-id'];
  const id = req.pathParameters.id;

  return _getByUserIdAndId(userId, id);
};

const create = (req) => {
  const userId = req.headers['x-user-id'];

  const bodyJSON = bodyParser.parse(req);
  const { title, content } = bodyJSON;
  return NotesModel.create({ userId, title, content});
};

const update = (req) => {
  const userId = req.headers['x-user-id'];
  const id = req.pathParameters.id;

  const bodyJSON = bodyParser.parse(req);
  const { title, content } = bodyJSON;
  return _getByUserIdAndId(userId, id)
    .then(() => {
      return NotesModel.update({ userId, id }, { title, content });
    });
};

const remove = (req) => {
  const userId = req.headers['x-user-id'];
  const id = req.pathParameters.id;

  return NotesModel.delete({ userId, id });
};

module.exports = {
  getAllByUserId,
  getByUserIdAndId,
  create,
  update,
  remove
};