"use strict";

var {page} = require('../lib');

function initialize() {
  if (page.name() !== 'home') {
    return;
  }

  console.log('homepage js');
}

module.exports = {initialize};
