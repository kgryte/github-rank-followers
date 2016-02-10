'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var noop = require( '@kgryte/noop' );
var pipeline = require( './../lib/pipeline.js' );


// FIXTURES //

var getOpts = require( './fixtures/opts.js' );
var info = require( './fixtures/info.json' );
var followers = require( './fixtures/data.json' );
var details = {
	'meta': {
		'total': 2,
		'success': 2,
		'failure': 0
	},
	'data': followers,
	'failures': {}
};
var results = require( './fixtures/results.json' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof pipeline, 'function', 'main export is a function' );
	t.end();
});

tape( 'if an error is encountered while fetching a user\'s followers, the function returns the error to the callback', function test( t ) {
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': get,
		'github-user-details': noop
	});

	opts = getOpts();
	pipeline( opts, done );

	function get( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 404,
				'message': 'beep'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );
		t.end();
	}
});

tape( 'if an error is encountered while fetching a user\'s followers, the function returns the error to the callback (rate limit info)', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': get,
		'github-user-details': noop
	});

	expected = info;

	opts = getOpts();
	pipeline( opts, done );

	function get( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err = {
				'status': 404,
				'message': 'beep'
			};
			clbk( err, null, info );
		}
	}

	function done( error, data, info  ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );

		t.equal( data, null, 'data is null' );

		t.deepEqual( info, expected, 'returns rate limit info' );
		t.end();
	}
});

tape( 'if an error is encountered while fetching a user details, the function returns the error to the callback', function test( t ) {
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails
	});

	opts = getOpts();
	pipeline( opts, done );

	function getFollowers( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, followers, info );
		}
	}

	function getDetails( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 404,
				'message': 'beep'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );
		t.end();
	}
});

tape( 'if an error is encountered while fetching a user details, the function returns the error to the callback (rate limit info)', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails
	});

	expected = info;

	opts = getOpts();
	pipeline( opts, done );

	function getFollowers( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, followers, {} );
		}
	}

	function getDetails( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err = {
				'status': 404,
				'message': 'beep'
			};
			clbk( err, null, info );
		}
	}

	function done( error, data, info ) {
		t.equal( error.status, 404, 'equal status' );
		t.equal( error.message, 'beep', 'equal message' );

		t.equal( data, null, 'data is null' );

		t.deepEqual( info, expected, 'returns rate limit info' );

		t.end();
	}
});

tape( 'the function returns analysis results to a provided callback', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails
	});

	expected = results;

	opts = getOpts();
	pipeline( opts, done );

	function getFollowers( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, followers, info );
		}
	}

	function getDetails( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, details, info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		}
		assert.deepEqual( data, expected );
		t.ok( true, 'returns analysis results' );

		t.end();
	}
});

tape( 'the function returns analysis results to a provided callback (no token)', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails
	});

	expected = results;

	opts = getOpts();
	delete opts.token;

	pipeline( opts, done );

	function getFollowers( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, followers, info );
		}
	}

	function getDetails( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, details, info );
		}
	}

	function done( error, data ) {
		if ( error ) {
			t.ok( false, error.message );
		}
		assert.deepEqual( data, expected );
		t.ok( true, 'returns analysis results' );
		
		t.end();
	}
});

tape( 'the function returns rate limit info to a provided callback', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails
	});

	expected = info;

	opts = getOpts();
	pipeline( opts, done );

	function getFollowers( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, followers, {} );
		}
	}

	function getDetails( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, details, info );
		}
	}

	function done( error, data, info ) {
		if ( error ) {
			t.ok( false, error.message );
		}
		t.deepEqual( info, expected, 'returns rate limit info' );
		
		t.end();
	}
});