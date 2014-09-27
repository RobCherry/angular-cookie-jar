/**
 * Angular Cookie Jar - An easy to use AngularJS module for managing cookies.
 * @version 1.0.0-beta.2 - 2014-09-27
 * @link https://github.com/RobCherry/angular-cookie-jar
 * @author Rob Cherry
 * @copyright 2014
 * @license MIT License, http://www.opensource.org/licenses/MIT
 *
 * Loosely based on jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie)
 * Copyright 2006, 2014 Klaus Hartl
 */
(function() {
  'use strict';
  angular.module('ngCookieJar', []).provider('CookieJar', [function CookieJarProvider() {
    var UNDEFINED = (function(undefined) { return undefined; })(),
        EXPIRES = 'expires',
        PATH = 'path',
        DOMAIN = 'domain',
        SECURE = 'secure',
        COOKIE_ATTRIBUTES = [ EXPIRES, PATH, DOMAIN, SECURE ],
        PLUS_REGEX = /\+/g,
        ESCAPED_DOUBLE_QUOTE_REGEX = /\\"/g,
        ESCAPED_BACKSLASH_REGEX = /\\\\/g,
        BLANK = '',
        SPACE = ' ',
        EQUALS = '=',
        SEMICOLON = ';',
        SEMICOLON_SPACE = SEMICOLON + SPACE,
        DOUBLE_QUOTE = '"',
        BACKSLASH = '\\',
        EPOCH_STRING = new Date(0).toUTCString(),
        END_OF_WORLD_STRING = new Date(0x7fffffff * 1e3).toUTCString(),
        SECONDS_PER_DAY = 864e5;

    var defaultOptions = {};

    // Return a copy of the object converting all keys to lowercase.
    function _lowercaseKeys(object) {
      var copy = {};
      angular.forEach(object, function(value, key) {
        copy[angular.lowercase(key)] = value;
      });
      return copy;
    }

    this.setDefaultOptions = function setDefaultOptions(options) {
      defaultOptions = _lowercaseKeys(options);
    };

    this.getDefaultOptions = function getDefaultOptions() {
      return angular.copy(defaultOptions);
    };

    this.$get = ['$document', function CookieJarFactory($document) {
      var document = $document[0];

      function _get(key, readNameFn, readValueFn) {
        readNameFn = readNameFn || angular.identity;
        readValueFn = readValueFn || angular.identity;
        var cookies = (document.cookie || BLANK).split(SEMICOLON_SPACE),
            result = key ? UNDEFINED : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
          var parts = cookies[i].split(EQUALS),
              name = readNameFn(parts.shift()),
              value = readValueFn(parts.join(EQUALS));

          if (key) {
            if (key === name) {
              result = value;
              break;
            }
          } else {
            // Only store valid cookies.
            if (name.length > 0 && value !== UNDEFINED) {
              result[name] = value;
            }
          }
        }
        return result;
      }

      function _set(key, value, options, writeNameFn, writeValueFn) {
        options = angular.extend({}, defaultOptions, _lowercaseKeys(options));
        writeNameFn = writeNameFn || angular.identity;
        writeValueFn = writeValueFn || angular.identity;
        if (angular.isNumber(options[EXPIRES]) && !isNaN(options[EXPIRES])) {
          var days = options[EXPIRES];
          if (days === Infinity) {
            options[EXPIRES] = END_OF_WORLD_STRING;
          } else {
            options[EXPIRES] = new Date();
            options[EXPIRES].setTime(+options[EXPIRES] + days * SECONDS_PER_DAY);
          }
        }
        if (angular.isDate(options[EXPIRES])) {
          options[EXPIRES] = options[EXPIRES].toUTCString();
        }

        var cookie = writeNameFn(key) + EQUALS + writeValueFn(String(value));
        for (var i = 0, l = COOKIE_ATTRIBUTES.length; i < l; i++) {
          var attribute = COOKIE_ATTRIBUTES[i],
              attribute_value = options[attribute];
          if (attribute_value) {
            if (angular.isString(attribute_value)) {
              cookie += SEMICOLON + attribute + EQUALS + attribute_value;
            } else if (attribute_value === true) {
              cookie += SEMICOLON + attribute;
            }
          }
        }
        return (document.cookie = cookie);
      }

      function _remove(key, options, getFn, setFn) {
        if (!key || getFn(key) === UNDEFINED) {
          return false;
        }
        options = angular.extend({}, defaultOptions, _lowercaseKeys(options));
        options[EXPIRES] = EPOCH_STRING;
        setFn(key, BLANK, options);
        return !getFn(key);
      }

      function parseValue(value) {
        try {
          if (value.indexOf(DOUBLE_QUOTE) === 0 && value.lastIndexOf(DOUBLE_QUOTE) === (value.length - 1) && value.length > 1) {
            // This is a quoted cookie according to RFC2068.  We need to unescape double quotes and backslashes.
            value = value.slice(1, -1).replace(ESCAPED_DOUBLE_QUOTE_REGEX, DOUBLE_QUOTE).replace(ESCAPED_BACKSLASH_REGEX, BACKSLASH);
          }
          // Replace server-side written pluses with spaces.
          // If we can't decode the cookie, ignore it, it is unusable.
          value = decodeURIComponent(value.replace(PLUS_REGEX, SPACE));
        } catch (ex) {
          value = UNDEFINED;
        }
        return value;
      }

      function get(key) {
        return _get(key, decodeURIComponent, parseValue);
      }

      function getRaw(key) {
        return _get(key);
      }

      function set(key, value, options) {
        return _set(key, value, options, encodeURIComponent, encodeURIComponent);
      }

      function setRaw(key, value, options) {
        return _set(key, value, options);
      }

      function remove(key, options) {
        return _remove(key, options, get, set);
      }

      function removeRaw(key, options) {
        return _remove(key, options, getRaw, setRaw);
      }

      return {
        get: get,
        getRaw: getRaw,
        set: set,
        setRaw: setRaw,
        remove: remove,
        removeRaw: removeRaw
      }
    }];
  }]);
})();