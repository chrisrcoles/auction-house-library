'use strict';

const Joi = require('joi');
const Handlers = require('../api/auction');

var version = 'v1';
const SCHEMAS = require('../common/schemas.js');
const BASE_PATH = '/api/' + version + '/auctions';

var routes = [];

routes.push({
  method: 'POST',
  path: BASE_PATH +'/{auction_id}/items',
  config: {
    auth: 'simple' ,
    handler: Handlers.createItem,
    description: "Add item to auction",
    notes: "This endpoint creates an item that can be auctioned.",
    validate: {
      params: {
        auction_id: Joi.number().integer().required()
      },
      payload: {
        name: Joi.string().required(),
        type: Joi.string().required(),
        reserved_price: Joi.number().integer().required(),
        description: Joi.string().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Created', schema: Joi.object({
                                                         msg: "Success.",
                                                         data: SCHEMAS.Item
                                                       }).label('Response')
          },
          '200': {
            description: 'OK. Item already exists.', schema: Joi.object({
                                                         msg: "Item already exists.",
                                                         data: SCHEMAS.Item
                                                       }).label('Response')
          }
        }
      }
    },
    tags: ['api']
  }
            });

module.exports = routes;