"use strict";

function name() {
  const body = document.getElementsByTagName('body')[0];
  return body.dataset.pageName;
}

module.exports = {name};
