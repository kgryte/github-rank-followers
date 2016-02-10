'use strict';

var rank = require( './../lib' );

var opts = {
	'username': 'kgryte',
	'useragent': 'beep-boop-bop',
	'method': 'ffratio'
};

rank( opts, clbk );

function clbk( error, results, info ) {
	if ( info ) {
		console.error( info );
	}
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( results );
}