'use strict';

let utils = require('../common/utils');
let replySuccess = utils.replySuccess;
let replyError = utils.replyError;

/*
*
* #createItem is a Public API method that allows an auctioneer
* to add an item that can be auctioned. This public method first
* checks to see if an item with the same name and auction id
* exists, if not an item will be created from the payload and
* route parameters.
*
* @param {Req}    Hapi obj
* @param {Reply}  Hapi function
*
* Auctioneer Privileges
* */
module.exports.createItem = function (req, reply) {
  let payload = req.payload;
  let params = req.params;
  let name = payload.name.toLowerCase();
  const status = 'waiting to be auctioned';

  const select = 'SELECT * FROM item WHERE name = $1 AND auction_id = $2';

  const insert =
    'INSERT INTO item(name, description, type, reserved_price, status, auction_id) ' +
    'VALUES ($1, $2, $3, $4, $5, (SELECT id FROM auction WHERE id = $6))' +
    'RETURNING id, name, description, type, reserved_price, status, sold, auction_id, owner_id;';

  const values = [
    name,
    payload.description.toLowerCase(),
    payload.type.toLowerCase(),
    payload.reserved_price,
    status,
    params.auction_id
  ];

  Database.query(select, [name, params.auction_id], (err, results) => {
    if (results.rowCount === 0) {
      Database.query(insert, values, (err, results) => {
        if (err) throw err;
        let entity = results.rows[0];
        reply({msg: 'Success', data: entity}).created(req.path + "/" + entity.id)
      })
    } else {
      replySuccess(reply, results.rows[0], 200, 'Item already exists.')
    }
  })
};

