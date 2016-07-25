'use strict';

const Joi = require('joi');

const DefaultError = Joi.object({
                           error: {
                             msg: Joi.string().min(3).description('Error msg for frontend, human readable').default('An error has occurred.'),
                             type: Joi.string().min(3).description('The type of a log, error/log/etc').default('GENERIC_ERR'),
                             statusCode: Joi.number().description('The status code of the error').default(400)
                           }
                         }).label('ErrorMessage');

const Item = {
  id: Joi.number().description('Unique identifier of an item.'),
  name: Joi.string().description('The name of the item.'),
  description: Joi.string().description('The description of the item.'),
  type: Joi.string().description('The type, or category of the item.'),
  reserved_price: Joi.number().description('The reserved price of the item in auction.'),
  sold: Joi.date().timestamp('javascript'),
  status: Joi.string().description('The status of the item, either `waiting to be auctioned`, `in auction`, or `sold.`'),
  owner_id: Joi.number().description('Foreign key of participant. The owner id of the item.'),
  auction_id: Joi.number().description('Foreign key of auction. The auction id of the item.')
};

const Bid = {
  id: Joi.number().description('Unique identifier of a bid'),
  price: Joi.number().description('The USD dollar amount of the bid'),
  item_id: Joi.number().description('Foreign key of item. The item id of the bid.'),
  bidder: Joi.number().description('Foreign key of participant. The participant id of the bid')
};

module.exports = {
  Item: Item,
  Error: DefaultError,
  Bid: Bid
};