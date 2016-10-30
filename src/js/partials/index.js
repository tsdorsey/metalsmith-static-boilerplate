"use strict";

var footer = require('./sections/footer');
var sample = require('./sections/sample');

function initialize() {
  footer.initialize();
  sample.initialize();
}

module.exports = {initialize};
