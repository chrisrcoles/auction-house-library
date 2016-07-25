'use strict';

/*
*  Test Assumptions:
*  (1) Assumes the TEST_ITEM has just been created and no bids have been placed
*  -OR-
*  (2) Item is not new, but is still in auction and BID_PRICE is higher than any
*  previous bid placed
*/

require('dotenv').config({silent: true});

const supertest = require('supertest');
const should = require('should');
const Utils = require('./utils');

const API_BASE_PATH = process.env.API_BASE_PATH;

let RESOURCE_PATH = '/api/v1/items';

const server = supertest.agent(API_BASE_PATH);

// these are initially set based off of the seed data inserted from `schema.sql`
let TEST_ITEM_ID = 2;
let TEST_PARTICIPANT_ID = 1;
let BID_PRICE = 10000.00;
let UPDATE_TEST_ITEM_ID = 2;

describe('#createBid ', function () {
  this.timeout(1500);
  let auth = Utils.getAuth('participant');

  it('should not create a bid for an item that does not exist or match the item id', function (done) {
    server
      .post(RESOURCE_PATH + '/' + 1000 + '/bids')
      .set(auth)
      .send({
              price: BID_PRICE,
              bidder: TEST_PARTICIPANT_ID
            })
      .expect(400)
      .end((err, res) => {
        res.body.error.msg.should.equal('No item with that id exists. Check the id before placing a bid.')
        res.body.error.type.should.equal('ITEM_BID_ERROR');
        done()
      })
  });

  // item must be in auction
  it('should successfully create a bid for an item in an auction', function (done) {
    server
      .post(RESOURCE_PATH + '/' + TEST_ITEM_ID + '/bids')
      .set(auth)
      .send({
              price: BID_PRICE,
              bidder: TEST_PARTICIPANT_ID
            })
      .expect(201)
      .end((err, res) => {
        res.body.msg.should.equal('Successful');
        res.body.data.price.should.equal(BID_PRICE);
        res.body.data.item_id.should.equal(TEST_ITEM_ID);
        res.headers['location'].should.equal(RESOURCE_PATH + '/' + TEST_ITEM_ID + '/bids/' + res.body.data.id);
        done();
      })
  });

  // must be the same item used above
  it('should only allow a user to place a higher bid than the one previously placed', function (done) {
    server
      .post(RESOURCE_PATH + '/' + TEST_ITEM_ID + '/bids')
      .set(auth)
      .send({
              price: BID_PRICE - 50,
              bidder: TEST_PARTICIPANT_ID
            })
      .expect(400)
      .end((err, res) => {
        res.body.error.msg.should.equal('Failure. Place a higher bid.');
        res.body.error.type.should.equal('ITEM_BID_ERROR');
        done()
      })
  });
});

/*
*
* Assumes the queried items have the tested statuses and that the fake item
* does not exist
*
* */

describe('#get', function () {
  this.timeout(1500);

  it('should return the status if the item is in auction', function (done) {
    server
      .get(RESOURCE_PATH + '?name=apple%iphone')
      .expect(200)
      .end((err, res) => {
        res.body.data.status.should.equal('in auction');
        res.body.msg.should.equal('Success.');
        done()
      })
  });

  it('should return the winning bid and item data if the item is now sold', function (done) {
    server
      .get(RESOURCE_PATH + '?name=invisible%man')
      .expect(200)
      .end((err, res) => {
        res.body.data.status.should.equal('sold');
        res.body.msg.should.equal('Success.');
        res.body.data.auction_id.should.be.a.Number();
        res.body.data.owner_id.should.be.a.Number();
        done()
      })
  });

  it('should return a failure if the item is not found', function (done) {
    server
      .get(RESOURCE_PATH + '?name=fake%item')
      .expect(404)
      .end((err, res) => {
        res.body.error.msg.should.equal('Item not found.')
        res.body.error.type.should.equal('ITEM_QUERY_ERROR');
        done()
      });
  });
});

describe('#update', function () {
  this.timeout(1500);

  let auth = Utils.getAuth('auctioneer');

  it('should update the status to be in auction', function (done) {

    server
      .put(RESOURCE_PATH + '/' + UPDATE_TEST_ITEM_ID)
      .set(auth)
      .send({
              status: 'in auction'
            })
      .expect(200)
      .end((err, res) => {
        res.body.data.id.should.be.a.Number();
        res.body.data.auction_id.should.be.a.Number();
        res.body.msg.should.equal('Success. Item in auction.');
        done()
      })
  });

  it('should update the status to be sold', function (done) {
    server
      .put(RESOURCE_PATH + '/' + UPDATE_TEST_ITEM_ID)
      .set(auth)
      .send({
              status: 'sold'
            })
      .expect(200)
      .end((err, res) => {
        let winningBid = res.body.data.winningBid;
        let item = res.body.data.item;

        winningBid.id.should.be.a.Number();
        winningBid.price.should.be.a.Number();
        winningBid.item_id.should.be.a.Number();
        winningBid.bidder.should.be.a.Number();

        item.id.should.be.a.Number();
        item.auction_id.should.be.a.Number();
        item.owner_id.should.be.a.Number();

        res.body.msg.should.equal('Success. Auction closed for item.');
        done()
      })
  });

  // assumes item is there that hasn't been bid on
  it('should update require a bid to be placed on an item before calling the auction', function (done) {
    server
      .put(RESOURCE_PATH + '/' + 8)
      .set(auth)
      .send({
              status: 'sold'
            })
      .expect(404)
      .end((err, res) => {
        res.body.error.msg.should.equal('No bids exist for this item. Check the item id.')
        res.body.error.type.should.equal('ITEM_UPDATE_ERROR');
        done()
      })
  });



});
