'use strict';

require('dotenv').config({silent: true});

const supertest = require('supertest');
const should = require('should');

const Utils = require('./utils');

let RESOURCE_PATH = '/api/v1/auctions/';
const API_BASE_PATH = process.env.API_BASE_PATH;
const server = supertest.agent(API_BASE_PATH);

/*
* Assumes TEST_ITEM is new, now
*
* */

let AUCTION_ID = 1;

let TEST_ITEM = {
  name: 'new item',
  description: 'test-description-first',
  type: 'test-type-first',
  reserved_price: 500.00
};

describe('#createItem ', function () {
  this.timeout(1500);

  let auth = Utils.getAuth('auctioneer');

  it('should successfully create an item, with a unique name and reserved price', function (done) {
    server
      .post(RESOURCE_PATH + AUCTION_ID +'/items')
      .set(auth)
      .send({
             name: TEST_ITEM.name,
             type: TEST_ITEM.type,
             description: TEST_ITEM.description,
             reserved_price: TEST_ITEM.reserved_price
           })
      .expect(200)
      .end((err, res) => {
        res.body.msg.should.equal('Success');
        res.body.data.name.should.equal(TEST_ITEM.name);
        res.body.data.type.should.equal(TEST_ITEM.type);
        res.body.data.description.should.equal(TEST_ITEM.description);
        res.body.data.reserved_price.should.equal(TEST_ITEM.reserved_price);
        res.headers['location'].should.equal(RESOURCE_PATH + AUCTION_ID + '/items/' + res.body.data.id);
        done();
      })
  });


  it('should fail if the item has already been created', function (done) {
    server
      .post(RESOURCE_PATH + AUCTION_ID + '/items')
      .set(auth)
      .send({
              name: TEST_ITEM.name,
              type: TEST_ITEM.type,
              description: TEST_ITEM.description,
              reserved_price: TEST_ITEM.reserved_price
            })
      .expect(200)
      .end((err, res) => {
        res.body.msg.should.equal('Item already exists.');
        done();
      })
  });
});
