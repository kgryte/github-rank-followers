'use strict';

// MODULES //

var tape = require( 'tape' );
var transform = require( './../lib/transform.js' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof transform, 'function', 'main export is a function' );
	t.end();
});

tape( 'function transforms an object into a value array', function test( t ) {
	var expected;
	var actual;
	var d;

	// WARNING: we rely on JS engines honoring object insertion order...
	d = {};
	d.beep = {'a':1};
	d.boop = {'a':2};
	d.bap = {'a':3};

	expected = [{'a':1},{'a':2},{'a':3}];
	actual = transform( d );

	t.deepEqual( actual, expected, 'transforms an object into a value array' );
	t.end();
});
