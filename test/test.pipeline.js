'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var noop = require( '@kgryte/noop' );
var copy = require( 'utils-copy' );
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
	'data': require( './fixtures/raw.json' ),
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
		'github-user-details': noop,
		'github-rank-users': noop
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
		'github-user-details': noop,
		'github-rank-users': noop
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
		'github-user-details': getDetails,
		'github-rank-users': noop
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

tape( 'if an error is encountered while fetching a user details (e.g., rate limit throttling), the function returns the error to the callback', function test( t ) {
	var pipeline;
	var results;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails,
		'github-rank-users': noop
	});

	results = copy( details );
	results.meta.success = 1;
	results.meta.failure = 1;

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
			clbk( null, results, info );
		}
	}

	function done( error ) {
		t.equal( error.status, 429, 'equal status' );
		t.equal( typeof error.message, 'string', 'returns an error message' );
		t.end();
	}
});

tape( 'if an error is encountered while fetching a user details, the function returns the error to the callback (rate limit info)', function test( t ) {
	var expected;
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails,
		'github-rank-users': noop
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

tape( 'if an error is encountered while analyzing user details, the function returns the error to the callback', function test( t ) {
	var pipeline;
	var opts;

	pipeline = proxyquire( './../lib/pipeline.js', {
		'github-followers': getFollowers,
		'github-user-details': getDetails,
		'github-rank-users': rank
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
			clbk( null, details, info );
		}
	}

	function rank( data, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk({
				'status': 502,
				'message': 'beep'
			});
		}
	}

	function done( error ) {
		t.equal( error.status, 502, 'equal status' );
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
		'github-user-details': getDetails,
		'github-rank-users': rank
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
			clbk( null, details, {} );
		}
	}

	function rank( data, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err = {
				'status': 502,
				'message': 'beep'
			};
			clbk( err, null, info );
		}
	}

	function done( error, data, info ) {
		t.equal( error.status, 502, 'equal status' );
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
		'github-user-details': getDetails,
		'github-rank-users': rank
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

	function rank( data, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, results );
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
		'github-user-details': getDetails,
		'github-rank-users': rank
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

	function rank( data, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, results );
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
		'github-user-details': getDetails,
		'github-rank-users': rank
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
			clbk( null, details, {} );
		}
	}

	function rank( data, opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( null, results, info );
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