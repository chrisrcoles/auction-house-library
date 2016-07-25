'use strict';

let should = require('should');
let assert = require('assert');

let findConsecutiveRuns = require('../algorithms/findConsecutiveRuns').findConsecutiveRuns;

describe('#findConsecutiveRuns()', function () {
  it('should return the runs of 3 consecutive numbers (ascending or descending)', function () {
    let array = [1, 2, 3, 5, 10, 9, 8, 9, 10, 11, 7];
    assert.deepEqual(findConsecutiveRuns(array), [0, 4, 6, 7], 'Did not find all ascending and descending runs.')
  });

  it('should return null if no such runs exist.', function () {
    let array = [0, 2, 4, 6, 10, 7, 9, 11, 13, 15, 2];
    assert.deepEqual(findConsecutiveRuns(array), null, 'No consecutive runs found. Null value is expected.')
  })
});
