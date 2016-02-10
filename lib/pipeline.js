'use strict';

// MODULES //

var followers = require( 'github-followers' );
var details = require( 'github-user-details' );
var analyze = require( './analyze.js' );


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
		ratelimit = info;
		if ( error ) {
			return done( error );
		}
		// Move to next step in pipeline:
		analysis( results.data );
	} // end FUNCTION onDetails()

	/**
	* FUNCTION: analysis( data )
	*	Runs analysis.
	*
	* @private
	* @param {Object} data - data to analyze
	* @returns {Void}
	*/
	function analysis( data ) {
		data = analyze( opts, data );

		// Move to next step in pipeline:
		done( null, data );
	} // end FUNCTION analysis()

	/**
	* FUNCTION: done( error, results )
	*	Ends the analysis pipeline.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} results - analysis results
	* @returns {Void}
	*/
	function done( error, results ) {
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