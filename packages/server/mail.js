'use strict';

let cluster = require('cluster');

if (cluster) {
  console.log(cluster);
}