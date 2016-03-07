'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var merge = require( 'utils-merge2' );
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var pipeline = require( './pipeline.js' );


// FACTORY //

/**
* FUNCTION: factory( options, clbk )
*	Returns a function for ranking a user's followers.
*
* @param {Object} options - function options
* @param {String} [options.token] - Github access token
* @param {String} [options.username] - Github username
* @param {String} [options.useragent] - user agent string
* @param {String} [options.method="followers"] - rank method
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for ranking a user's followers
*/
function factory( options, clbk ) {
	var opts;
	var err;
	opts = merge( {}, defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	if (
		opts.token === void 0 &&
		opts.username === void 0
	) {
		throw new Error( 'invalid input argument. Must provide a username or, to rank an authenticated user\'s followers, an access token.' );
	}
	/**
	* FUNCTION: rank()
	*	Ranks a user's followers.
	*
	* @returns {Void}
	*/
	return function rank() {
		pipeline( opts, done );
		/**
		* FUNCTION: done( error, data, info )
		*	Callback invoked after running rank analysis.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object[]} data - query data
		* @param {Object} info - response info
		* @returns {Void}
		*/
		function done( error, data, info ) {
			error = error || null;
			data = data || null;
			info = info || null;
			clbk( error, data, info );
		} // end FUNCTION done()
	}; // end FUNCTION rank()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
