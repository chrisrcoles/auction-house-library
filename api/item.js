'use strict';

let utils = require('../common/utils');
let replyError = utils.replyError;
let replySuccess = utils.replySuccess;

/*
*
* #createBid is a Public API method that allows a participant
* to bid on an item. This method first checks to see if an item,
* by name, exists, if it does not, a 400 error will be sent
* to the client. However, if the item does exist and its
* status is `in auction`, we check to see if the incoming offer
* is a better bid, if so, a successful response is sent to the
* client, if not we inform them to place a higher bid
*
*  @param {Req} Hapi object
*  @param {Reply} Hapi object
*
*  Participant Privileges
*
* */
module.exports.createBid = function (req, reply) {
  let payload = req.payload;
  let params = req.params;

  const select = 'SELECT * FROM item WHERE id = $1;';
  const createQuery =
    'INSERT INTO bid(price, item_id, bidder) ' +
    'VALUES ($1, $2, (SELECT id FROM participant WHERE id = $3)) ' +
    'RETURNING id, price, item_id;';
  const bid = [
    payload.price,
    params.item_id,
    payload.bidder
  ];

  Database.query(select, [params.item_id], (err, res) => {
    if (res.rowCount === 0) {
      replyError(reply, 'No item with that id exists. Check the id before placing a bid.', 'ITEM_BID_ERROR')
    } else {
      let itemInAuction = (res.rows[0].status === 'in auction');
      if (itemInAuction) {
        const bids = 'SELECT * FROM bid WHERE item_id = $1;';
        Database.query(bids, [params.item_id], (err, res) => {
          // no bids exist
          if (!res) {
            Database.query(createQuery, bid, (err, results) => {
              let entity = results.rows[0];
                reply({msg: 'Successful', data: entity}, null).created(req.path + "/" + entity.id);
            })
          }
          // bids do exist
          else {
            const betterBid = res.rows.every((r, idx) => payload.price > r.price);
            if (betterBid) {
              Database.query(createQuery, bid, (err, results) => {
                if (err) throw err;
                let entity = results.rows[0];
                reply({msg: 'Successful', data: entity}, null).created(req.path + "/" + entity.id);
              })
            } else {
              replyError(reply, 'Failure. Place a higher bid.', 'ITEM_BID_ERROR')
            }
          }
        });
      } else {
        replyError(reply, 'Item must be in auction for a bid to be placed.', 'ITEM_BID_ERROR');
      }
    }
  });
};

/*
*
* #get is a Public API method that queries the latest action of an
* item. Currently, only the name query parameter is supported.
* Provided that the item exists, if the item is still in auction,
* the relating status is returned as a success to the client.
* However, if the item is sold, who it was sold to and the
* winning bid are returned to the client as a success.
*
*
* @param {Req} Hapi object
* @param {Reply} Hapi object
*
* Auctioneer/Participant Privileges
*
* */
module.exports.get = function (req, reply) {
  let queryParams = req.query;

  if (queryParams.name) {
    let name = queryParams.name.replace(/%/g, ' ');
    const query = 'SELECT * FROM item WHERE name = $1;';
    const values = [name];

    Database.query(query, values, (err, results) => {
      if (err) throw err;
      if (!results.rows.length && results.rowCount == 0) {
        replyError(reply, 'Item not found.', 'ITEM_QUERY_ERROR', 404);
      } else {
        if (results.rows[0].status === 'sold') {
          replySuccess(reply, results.rows[0], null, 'Success.');
        } else {
          replySuccess(reply, {status: results.rows[0].status}, null, 'Success.');
        }
      }
    });
  } else {
    replyError(reply, 'Invalid query', 'ITEM_QUERY_ERROR', 400);
  }
};


/*
*
* #update is a Public API method that is responsible for starting and
* calling an auction for an item. If the payload denotes the item's
* status to now be from `waiting for auction` to `in auction`,
* the server will update the appropriate item. If the payload denotes
* the item's status to now be `sold`, the server checks the database
* for the highest bid, updates the item to reflect its sold status,
* effectively closing the auction, as the highest bid is returned to
* the client. As this is a PUT method, these actions are effectively idempotent.
*
* @param {req} Hapi
* @param {reply} Hapi
*
* Auctioneer Privileges
*
* */
module.exports.update = function (req, reply) {
  let params = req.params;
  let payload = req.payload;

  // if the item is now in auction
  if (payload.status === 'in auction') {
    let update = 'UPDATE item SET status = $1 WHERE id = $2 ' +
      'RETURNING id, name, description, type, reserved_price, auction_id;';

    Database.query(update, [payload.status, params.item_id], (err, results) => {
      if (err) throw err;
      replySuccess(reply, results.rows[0], null, 'Success. Item in auction.');
    })
  }

  // if the item is now sold, check bids and find highest bid
  else if (payload.status === 'sold') {
    let select = 'SELECT * FROM bid WHERE item_id = $1';

    Database.query(select, [params.item_id], (err, results) => {
      if (err) throw err;
      if (!results.rows.length && results.rowCount === 0) {
        replyError(reply, 'No bids exist for this item. Check the item id.', 'ITEM_UPDATE_ERROR', 404)
      } else {
        const winningBid = results.rows.sort((a, b) => a.price < b.price).shift();
        let query = 'UPDATE item SET (status, owner_id, sold) = ($1, $2, $3) WHERE id = $4 ' +
                    'RETURNING id, name, type, reserved_price, status, sold, auction_id, owner_id;';

        Database.query(query, [
          payload.status,
          winningBid.bidder,
          new Date(),
          params.item_id
        ], (err, results) => {
          if (err) throw err;
          let item = results.rows[0];
          replySuccess(reply, {winningBid, item}, null, 'Success. Auction closed for item.');
        })
      }
    })
  }
};