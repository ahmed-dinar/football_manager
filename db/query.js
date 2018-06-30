"use strict";

/**
 * init query builder
 */
var knex = require('knex')({client: 'mysql'});

module.exports = knex;