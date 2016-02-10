'use strict';

// MODULES //

var factory = require( './factory.js' );


// RANK //

/**
* FUNCTION: rank( opts, clbk )
*	Ranks a user's followers.
*
* @param {Object} opts - function options
* @param {String} [opts.token] - Github access token
* @param {String} [opts.username] - Github username
* @param {String} [opts.useragent] - user agent string
* @param {String} [opts.method="followers"] - rank method
* @param {Function} clbk - callback to invoke upon ranking a user's followers
* @returns {Void}
*/
function rank( opts, clbk ) {
	factory( opts, clbk )();
} // end FUNCTION rank()


// EXPORTS //

module.exports = rank;
