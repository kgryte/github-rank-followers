'use strict';

// MODULES //

var followers = require( 'github-followers' );
var details = require( 'github-user-details' );
var analyze = require( 'github-rank-users' );
var transform = require( './transform.js' );


// PIPELINE //

/**
* FUNCTION: pipeline( opts, clbk )
*	Analysis pipeline.
*
* @param {Object} options - function options
* @param {Function} clbk - callback to invoke after running analysis
* @returns {Void}
*/
function pipeline( opts, clbk ) {
	var ratelimit;
	followers( opts, onFollowers );
	/**
	* FUNCTION: onFollowers( error, data, info )
	*	Callback invoked after receiving a user's followers.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object[]} data - follower data
	* @param {Object} info - rate limit info
	* @returns {Void}
	*/
	function onFollowers( error, data, info ) {
		var usernames;
		var options;
		var i;

		ratelimit = info;
		if ( error ) {
			return done( error );
		}
		usernames = new Array( data.length );
		for ( i = 0; i < data.length; i++ ) {
			usernames[ i ] = data[ i ].login;
		}
		options = {
			'useragent': opts.useragent,
			'usernames': usernames
		};
		if ( opts.token ) {
			options.token = opts.token;
		}
		// Move to next step in pipeline:
		details( options, onDetails );
	} // end FUNCTION onFollowers()

	/**
	* FUNCTION: onDetails( error, results, info )
	*	Callback invoked upon receiving user details.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} results - user details
	* @param {Object} info - rate limit info
	* @returns {Void}
	*/
	function onDetails( error, results, info ) {
		var options;
		var data;

		ratelimit = info;
		if ( error ) {
			return done( error );
		}
		options = {
			'method': opts.method,
			'useragent': opts.useragent
		};
		if ( opts.token ) {
			options.token = opts.token;
		}
		data = transform( results.data );

		// Move to next step in pipeline:
		analyze( data, options, done );
	} // end FUNCTION onDetails()

	/**
	* FUNCTION: done( error, results, info )
	*	Ends the analysis pipeline.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} results - analysis results
	* @param {Object} info - rate limit info
	* @returns {Void}
	*/
	function done( error, results, info ) {
		if ( info ) {
			ratelimit = info;
		}
		if ( error ) {
			if ( ratelimit ) {
				return clbk( error, null, ratelimit );
			}
			return clbk( error );
		}
		clbk( null, results, ratelimit );
	} // end FUNCTION done()
} // end FUNCTION pipeline()


// EXPORTS //

module.exports = pipeline;