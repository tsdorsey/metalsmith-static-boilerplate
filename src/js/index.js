"use strict";

var partials = require('./partials');
var pages = require('./pages');

$(window).ready(function () {
  partials.initialize();
  pages.initialize();
});
