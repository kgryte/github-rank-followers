'use strict';

// MODULES //

var getKeys = require( 'object-keys' ).shim();


// TRANSFORM //

/**
* FUNCTION: transform( data )
*	Transforms raw follower data into a value array.
*
* @param {Object} data - follower data
* @returns {Array} transformed data
*/
function transform( data ) {
	var keys;
	var out;
	var i;
	keys = getKeys( data );
	out = new Array( keys.length );
	for ( i = 0; i < keys.length; i++ ) {
		out[ i ] = data[ keys[i] ];
	}
	return out;
} // end FUNCTION transform()


// EXPORTS //

module.exports = transform;