# Angular Cookie Jar

[![Build Status](https://travis-ci.org/RobCherry/angular-cookie-jar.png)](https://travis-ci.org/RobCherry/angular-cookie-jar)

An easy to use AngularJS module for managing cookies.

## Installation

Include `angular-cookie-jar.min.js` after you have included the main AngularJS library:

```html
<script src="/path/to/angular.min.js"></script>
<script src="/path/to/angular-cookie-jar.min.js"></script>
```

## Basic Usage

### Including `ngCookieJar` in your application

```javascript
angular.module('yourApplication', ['ngCookieJar'])...
```

Angular Cookie Jar creates a `CookieJar` service that can be used for managing cookies.

### Creating Cookies

Create a session cookie:

```javascript
CookieJar.set('name', 'value');
```

Create a cookie that expires tomorrow:

```javascript
CookieJar.set('name', 'value', { expires: 1 });
```

Create a cookie that expires on a specific date (January 1st, 2000):

```javascript
CookieJar.set('name', 'value', { expires: new Date(2000, 00, 01) });
```

Create an infinite cookie:

```javascript
CookieJar.set('name', 'value', { expires: Infinity });
```

Create a secure session cookie valid across the entire site:

```javascript
CookieJar.set('name', 'value', { path: '/', secure: true });
```

### Reading Cookies

Read a single cookie:
```javascript
CookieJar.get('name'); // Returns value.
```

Read all cookies:

```javascript
CookieJar.get(); // Returns an object mapping keys to values.
```

### Deleting Cookies

Delete a single cookie:

```javascript
CookieJar.remove('name', { path: '/' }); // Returns true on success, false on failure.
```

_**In order to remove a cookie you must use the exact same path, domain, and secure options that were used to set the cookie.**_

## Configuration

Angular Cookie Jar provides an API for setting default cookie options:

```javascript
angular.module('yourApplication', ['ngCookieJar'])
  .config(['CookieJarProvider', function(CookieJarProvider) {
    CookieJarProvider.setDefaultOptions({ path: '/' });
  }]);
```

The following options can be passed to the `set` and `remove` functions:

### Expires

```javascript
{ expires: 7 }
```

Value can be a `Number` which will be interpreted as days from today, a `Date` object, or a UTC string.  `Infinity` is a valid value, but `NaN` is not valid.  If omitted, the cookie will become a session cookie.

### Path

```javascript
{ path: '/' }
```

The path where to cookie is valid.  By default the path of the cookie is the path of the page where the cookie was created.  If you want the cookie to be available across the entire site use `'/'`.

### Domain

```javascript
{ domain: 'example.com' }
```
The domain where the cookie is valid.  By default this is the domain where the cookie was created.

### Secure

```javascript
{ secure: true }
```

If `true`, the cookie will only be transmitted over a secure protocol (https).  By default this is `false`.

## Advanced Usage

### Raw API

By default cookie names and values are encoded and decoded using `encodeURIComponent` and `decodeURIComponent`.  You can use `getRaw()`, `setRaw()`, and `removeRaw()` to skip encoding and decoding of the cookie name and value.

### Converters

AngularJS provides a great interface for extending services.  The following example will add a `getJson()` and `setJson()` method to the API.

```javascript
angular.module('yourApplication', ['ngCookieJar'])
  .config(['$provide', function($provide) {
    $provide.decorator('CookieJar', ['$delegate', function CookieJarDecorator($delegate) {
      $delegate.getJson = function getJson(key) {
        return angular.fromJson($delegate.get(key));
      };
      $delegate.setJson = function setJson(key, value, options) {
        return $delegate.set(key, angular.toJson(value), options);
      };
      return $delegate;
    }]);
  }]);
```

## Author

[Rob Cherry](https://github.com/RobCherry)
