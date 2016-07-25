'use strict';

module.exports.findConsecutiveRuns = function (array) {
  var runs = [];
  array.forEach((element, idx) => {
    let el = array[idx];
    let nextEl = array[idx + 1];
    let followingEl = array[idx + 2];

    if (el + 1 === nextEl && nextEl + 1 === followingEl) {
      runs.push(idx)
    }

    if (el - 1 === nextEl && nextEl - 1 === followingEl) {
      runs.push(idx)
    }
  });

  return !runs.length ? null : runs;
};
