#!/bin/sh

name=$1;
ccName=`echo $name | sed 's/-/ /g' | awk '{for(j=2;j<=NF;j++){ $j=toupper(substr($j,1,1)) substr($j,2) }}1' | sed 's/ //g'`;

if test "$name" = ""
then
  echo "name=$name";
  echo "ccName=$ccName";
  echo "You must provide a name";
  exit 1;
fi

# Create html file
echo "{{#> blocks/section id=\"$name\"}}

<h1>$name</h1>

{{/blocks/section}}" > "src_partials/sections/$name.html";

# Create js file
echo "function initialize() {
  var scope = \$('#$name-section');
  if(scope.length === 0) {
    return;
  }

  console.log('$name section js');
}

module.exports = {initialize};" > "src/js/partials/sections/$name.js";

# Create css file
echo "#$name-section {
  .container {
  }

  .content-box {
  }
}" > "src/css/partials/sections/_$name.scss";


# Add require line to index.js
echo "
// var $ccName = require('./sections/$name');
// $ccName.initialize();" >> "src/js/partials/index.js";


# Add import line to index.scss file
echo "
// @import 'partials/sections/$name';" >> "src/css/index.scss";
