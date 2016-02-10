Rank Followers
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Rank a user's [followers][github-followers].


## Installation

``` bash
$ npm install github-rank-followers
```


## Usage

``` javascript
var rank = require( 'github-rank-followers' );
```

<a name="rank"></a>
#### rank( opts, clbk )

Ranks a user's [followers][github-followers].

``` javascript
var opts = {
	'username': 'kgryte'
};

rank( opts, clbk );

function clbk( error, data, info ) {
	// Check for rate limit information...
	if ( info ) {
		console.error( 'Limit: %d', info.limit );
		console.error( 'Remaining: %d', info.remaining );
		console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );
	}
	if ( error ) {
		throw new Error( error.message );
	}
	console.log( JSON.stringify( data ) );
	/*
		{
			"data": [
				{"login":"followerN",...},
				{"login":"followerM",...},
				...
			],
			"results": [
				78,
				67,
				62,
				...
			]
		}
	*/
}
```

The `function` accepts the following `options`:
*	__token__: Github [access token][github-token].
*	__username__: Github username.
*	__useragent__: [user agent][github-user-agent] `string`.
*	__method__: analysis method. Default: 'followers'.
	-	__followers__: rank based on `follower` count.
	-	__following__: rank based on `following` count.
	-	__repos__: rank based on number of public repositories.
	-	__gists__: rank based on number of public gists.
	-	__created__: rank based on when a user created a Github account.
	-	__ffratio__: rank based on the ratio of `follower`-to-`following`. 

To [authenticate][github-oauth2] with Github, set the [`token`][github-token] option.

``` javascript
var opts = {
	'token': 'tkjorjk34ek3nj4!'
};

rank( opts, clbk );
```

To get the analyize the [followers][github-followers] of a particular user, set the `username` option.

``` javascript
var opts = {
	'username': 'kgryte'
};

rank( opts, clbk );
```

To specify a [user agent][github-user-agent], set the `useragent` option.

``` javascript
var opts = {
	'useragent': 'hello-github!'
};

rank( opts, clbk );
```

To specify an analysis method, set the `method` option.

``` javascript
var opts = {
	'method': 'ffratio'
};

rank( opts, clbk );
```


#### rank.factory( options, clbk )

Creates a reusable `function`.

``` javascript
var opts = {
	'username': 'kgryte',
	'token': 'tkjorjk34ek3nj4!'
};

var run = rank.factory( opts, onFollowers );

run();
run();
run();
// ...
```

The factory method accepts the same `options` as [`rank()`](#rank).


## Notes

*	Either a `username` or a [`token`][github-token] or both __must__ be provided. If provided a [`token`][github-token], but not a `username`, the `function` analyzes the authenticated user's Github [followers][github-followers].
*	[Rate limit][github-rate-limit] information includes the following:
	-	__limit__: maximum number of requests a consumer is permitted to make per hour.
	-	__remaining__: number of remaining requests.
	-	__reset__: time at which the current [rate limit][github-rate-limit] window resets in [UTC seconds][unix-time].


---
## Examples

``` javascript
var rank = require( 'github-rank-followers' );

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
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g github-rank-followers
```


### Usage

``` bash
Usage: ghrankfollowers [options] 

Options:

  -h,  --help               Print this message.
  -V,  --version            Print the package version.
       --token token        Github access token.
       --username username  Github username.
  -ua, --useragent ua       User agent.
       --method method      Rank method. Default: followers.
```


### Notes

*	In addition to the [`token`][github-token] option, the [token][github-token] may also be specified by a [`GITHUB_TOKEN`][github-token] environment variable. The command-line option __always__ takes precedence.
*	Analysis results are written to `stdout`.
*	[Rate limit][github-rate-limit] information is written to `stderr`.


### Examples

Setting the access [token][github-token] using the command-line option:

``` bash
$ DEBUG=* ghrankfollowers --token <token> --username 'kgryte'
# => '{"data":[{...},{...},...],"results":[...]}'
```

Setting the access [token][github-token] using an environment variable:

``` bash
$ DEBUG=* GITHUB_TOKEN=<token> ghrankfollowers --username 'kgryte'
# => '{"data":[{...},{...},...],"results":[...]}'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghrankfollowers --token <token> --username 'kgryte'
# => '{"data":[{...},{...},...],"results":[...]}'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli --token <token> --username 'kgryte'
# => '{"data":[{...},{...},...],"results":[...]}'
```

---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/github-rank-followers.svg
[npm-url]: https://npmjs.org/package/github-rank-followers

[build-image]: http://img.shields.io/travis/kgryte/github-rank-followers/master.svg
[build-url]: https://travis-ci.org/kgryte/github-rank-followers

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/github-rank-followers/master.svg
[coverage-url]: https://codecov.io/github/kgryte/github-rank-followers?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-rank-followers.svg
[dependencies-url]: https://david-dm.org/kgryte/github-rank-followers

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-rank-followers.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-rank-followers

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-rank-followers.svg
[github-issues-url]: https://github.com/kgryte/github-rank-followers/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[github-followers]: https://github.com/kgryte/github-followers
[github-api]: https://developer.github.com/v3/
[github-token]: https://github.com/settings/tokens/new
[github-oauth2]: https://developer.github.com/v3/#oauth2-token-sent-in-a-header
[github-user-agent]: https://developer.github.com/v3/#user-agent-required
[github-rate-limit]: https://developer.github.com/v3/rate_limit/