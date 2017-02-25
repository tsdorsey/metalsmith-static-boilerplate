'use strict';

function initialize() {
  const $scope = $('.section.sample');
  if ($scope.length === 0) {
    return;
  }

  console.log('sample section js');
}

module.exports = { initialize };
