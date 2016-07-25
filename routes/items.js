'use strict';

const Joi = require('joi');
const Handlers = require('../api/item');

var version = 'v1';
const SCHEMAS = require('../common/schemas.js');
const BASE_PATH = '/api/' + version + '/items';

var routes = [];

routes.push({
              method: 'POST',
              path: BASE_PATH + '/{item_id}/bids',
              config: {
                auth: 'simple',
                handler: Handlers.createBid,
                description: 'Create a bid for an item in an auction.',
                notes: 'This endpoint creates a bid on an item for an auction.',
                validate: {
                  params: {
                    item_id: Joi.number().integer().required()
                  },
                  payload: {
                    price: Joi.number().integer().required(),
                    bidder: Joi.number().integer().required()
                  }
                },
                plugins: {
                  'hapi-swagger': {
                    responses: {
                      '201': {
                        description: 'Created',
                        schema: Joi.object({
                                             msg: 'Success.',
                                             data: SCHEMAS.Bid
                                           }).label('Response')
                      },
                      '400': {
                        description: 'Bad Request',
                        schema: Joi.object({
                                             error: {
                                               msg: 'Item must be in auction for a bid to be placed',
                                               type: 'ITEM_BID_ERROR',
                                               statusCode: 400
                                             }
                                           })
                      }
                    },
                    security: {}
                  }
                },
                tags: ['api']
              }

            });

routes.push({
              method: 'GET',
              path: BASE_PATH,
              config: {
                auth: false,
                handler: Handlers.get,
                description: 'Get all items or a certain item with query parameters.',
                notes: 'This endpoint will return all items, or, ' +
                'if a query parameter is passed, will return the item that matches',
                validate: {},
                plugins: {
                  'hapi-swagger': {
                    responses: {
                      '201': {
                        description: 'Created. The entire item will only be included ' +
                        'in the response if the status is now sold, otherwise just the status ' +
                        'will be returned.',
                        schema: Joi.object({
                                             msg: 'Success.',
                                             data: SCHEMAS.Item
                                           }).label('Response')
                      },
                      '400':{
                        description: 'Not found',
                        schema: Joi.object({
                                             error: {
                                               msg: 'Inalid query.',
                                               type: 'ITEM_QUERY_ERROR',
                                               statusCode: 404
                                             }
                                           })
                      },
                      '404': {
                        description: 'Bad Request',
                        schema: Joi.object({
                                             error: {
                                               msg: 'Item not found.',
                                               type: 'ITEM_QUERY_ERROR',
                                               statusCode: 404
                                             }
                                           })
                      }
                    }
                  }
                },
                tags: ['api']
              }

            });

routes.push({
              method: 'PUT',
              path: BASE_PATH + '/{item_id}',
              config: {
                auth: 'simple',
                handler: Handlers.update,
                description: 'Updates an item\'s status.',
                notes: 'This endpoint will update an item\'s status',
                validate: {
                  params: {
                    item_id: Joi.number().integer().required()
                  },
                  payload: {
                    status: Joi.string().required()
                  }
                },
                plugins: {
                  'hapi-swagger': {
                    responses: {
                      '200': {
                        description: 'OK - Auction started or Auction closed. ' +
                        'Winning Bid will only be included in the response if the status ' +
                        'is now sold.',
                        schema: Joi.object({
                                             msg: 'Success.',
                                             data: {
                                               item: SCHEMAS.Item,
                                               winningBid: SCHEMAS.Bid
                                             },
                                           }).label('Response')
                      },
                      '404': {
                        description: 'Not found',
                        schema: Joi.object({
                                             error: {
                                               msg: 'No bids exist for this item. Check the item id.',
                                               type: 'ITEM_UPDATE_ERROR',
                                               statusCode: 404
                                             }
                                           })
                      }
                    },
                    security: {}
                  }
                },
                tags: ['api']
              }
            });

module.exports = routes;