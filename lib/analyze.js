'use strict';

// MODULES //

var methods = require( './methods.json' );
var transform = require( './transform.js' );
var pluck = require( './pluck.js' );
var raw = require( './pluck.raw.js' );
var ratio = require( './pluck.ratio.js' );
var sort = require( './sort.js' );
var shuffle = require( './shuffle.js' );


// ANALYZE //

/**
* FUNCTION: analyze( opts, data )
*	Analyzes follower detail data.
*
* @param {Object} opts - analysis options
* @param {String} opts.method - analysis method
* @param {String} opts.order - sort order
* @param {Object} data - follower data
* @returns {Object} analysis results
*/
function analyze( opts, data ) {
	var params;
	var scores;
	var tmp;

	params = methods[ opts.method ];

	// Transform the data into an object array:
	data = transform( data );

	// Assemble two element tuples consisting of the value index and a score on which to sort...
	switch ( opts.method ) {
	case 'followers':
	case 'following':
	case 'created':
	case 'repos':
	case 'gists':
		tmp = raw( data, params.key );
		break;
	case 'ffratio':
		tmp = ratio( data, params.key1, params.key2 );
		break;
	}
	// For `created`, older users should be ranked higher...
	if ( opts.method === 'created' ) {
		if ( opts.order === 'desc' ) {
			opts.order = 'asc';
		} else {
			opts.order = 'desc';
		}
	}
	// Rank the data:
	tmp = sort( tmp, opts.order );

	// Shuffle the original data to match the sort order:
	data = shuffle( data, tmp );

	// Pluck the scores from the sort vector:
	scores = pluck( tmp, 1 );

	// Assemble the results data:
	data = {
		'data': data,
		'results': scores
	};
	return data;
} // end FUNCTION analyze()


// EXPORTS //

module.exports = analyze;