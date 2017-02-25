'use strict';

function initialize() {
  const $scope = $('.section.footer');
  if ($scope.length === 0) {
    return;
  }

  console.log('footer section js');
}

module.exports = { initialize };
