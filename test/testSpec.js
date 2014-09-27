'use strict';

describe('CookieJar', function() {

  var CookieJarProvider, CookieJar;

  beforeEach(function() {
    angular.module('config-helper', [])
      .config(['CookieJarProvider', function(_CookieJarProvider_) {
        CookieJarProvider = _CookieJarProvider_;
        CookieJarProvider.setDefaultOptions({});
      }]);

    angular.mock.module('ngCookieJar', 'config-helper');

    angular.mock.inject(function(_$window_, _$document_, _CookieJar_) {
      CookieJar = _CookieJar_;
    });
  });

  beforeEach(function() {
    if (document.cookie) {
      var cookies = document.cookie.split('; ');
      for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        document.cookie = parts.shift() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    expect(document.cookie).toBe('');
  });

  it('should be defined', function() {
    expect(CookieJarProvider).toBeDefined();
    expect(CookieJar).toBeDefined();
  });

  describe('default options', function() {
    it('should be normalized', function() {
      CookieJarProvider.setDefaultOptions({ PATH: '/', dOmAiN: 'example.com', Secure: true });
      expect(CookieJarProvider.getDefaultOptions()).toEqual({ path: '/', domain: 'example.com', secure: true });
    });

    it('should not alter options', function() {
      var options = { PATH: '/' };
      CookieJarProvider.setDefaultOptions(options);
      expect(CookieJarProvider.getDefaultOptions()).not.toBe(options);
      expect(options).toEqual({ PATH: '/' });
      expect(CookieJarProvider.getDefaultOptions()).toEqual({ path: '/' });
    });
  });

  describe('get()', function() {
    describe('should handle', function() {
      it('simple values', function() {
        document.cookie = 'c=v';
        expect(CookieJar.get('c')).toBe('v');
      });

      it('empty values', function() {
        document.cookie = 'c=';
        expect(CookieJar.get('c')).toBe('');
      });

      it('undefined values', function() {
        expect(CookieJar.get('c')).toBeUndefined();
      });

      it('URL encoded values', function() {
        document.cookie = 'c=%22%5C';
        expect(CookieJar.get('c')).toBe('"\\');
      });

      it('quoted values', function() {
        document.cookie = 'c="\\"\\\\"';
        expect(CookieJar.get('c')).toBe('"\\');
      });

      it('pluses in values', function() {
        document.cookie = 'c=v+v';
        expect(CookieJar.get('c')).toBe('v v');
      });

      it('equals in values', function() {
        document.cookie = 'c=v=v';
        expect(CookieJar.get('c')).toBe('v=v');
      });

      it('URL encoded keys', function() {
        document.cookie = 'c%22=v';
        expect(CookieJar.get('c"')).toBe('v');
      });
    });

    describe('should return all cookies', function() {
      it('when there are cookies', function() {
        document.cookie = 'c1=v1';
        document.cookie = 'c2=v2';
        expect(CookieJar.get()).toEqual({ c1: 'v1', c2: 'v2' });
      });

      it('when there are no cookies', function() {
        expect(CookieJar.get()).toEqual({});
      });
    });

    it('should return undefined for cookies that can not be decoded', function() {
      document.cookie = 'c=%';
      expect(CookieJar.get('c')).toBeUndefined();
    });

    it('should omit a cookie that can not be decoded when returning all cookies', function() {
      document.cookie = 'c1=v1';
      document.cookie = 'c2=%';
      expect(CookieJar.get()).toEqual({ c1: 'v1' });
    });
  });

  describe('getRaw() should handle', function() {
    describe('should handle', function() {
      it('simple values', function() {
        document.cookie = 'c=v';
        expect(CookieJar.getRaw('c')).toBe('v');
      });

      it('empty values', function() {
        document.cookie = 'c=';
        expect(CookieJar.getRaw('c')).toBe('');
      });

      it('undefined values', function() {
        expect(CookieJar.getRaw('c')).toBeUndefined();
      });

      it('URL encoded values', function() {
        document.cookie = 'c=%22%5C';
        expect(CookieJar.getRaw('c')).toBe('%22%5C');
      });

      it('quoted values', function() {
        document.cookie = 'c="\\"\\\\"';
        expect(CookieJar.getRaw('c')).toBe('"\\"\\\\"');
      });

      it('pluses in values', function() {
        document.cookie = 'c=v+v';
        expect(CookieJar.getRaw('c')).toBe('v+v');
      });

      it('equals in values', function() {
        document.cookie = 'c=v=v';
        expect(CookieJar.getRaw('c')).toBe('v=v');
      });

      it('URL encoded keys', function() {
        document.cookie = 'c%22=v';
        expect(CookieJar.getRaw('c%22')).toBe('v');
      });
    });

    describe('should return all cookies', function() {
      it('when there are cookies', function() {
        document.cookie = 'c1=v1';
        document.cookie = 'c2=v2';
        expect(CookieJar.getRaw()).toEqual({ c1: 'v1', c2: 'v2' });
      });

      it('when there are no cookies', function() {
        expect(CookieJar.getRaw()).toEqual({});
      });
    });

    it('should return cookies that can not be decoded', function() {
      document.cookie = 'c=%';
      expect(CookieJar.getRaw('c')).toBe('%');
    });

    it('should include a cookie that can not be decoded when returning all cookies', function() {
      document.cookie = 'c1=v1';
      document.cookie = 'c2=%';
      expect(CookieJar.getRaw()).toEqual({ c1: 'v1', c2: '%' });
    });
  });

  describe('set()', function() {
    describe('should handle', function() {
      it('simple values', function() {
        expect(CookieJar.set('c', 'v')).toBe('c=v');
        expect(document.cookie).toBe('c=v');
      });

      it('empty values', function() {
        expect(CookieJar.set('c', '')).toBe('c=');
        expect(document.cookie).toBe('c=');
      });

      it('special values', function() {
        expect(CookieJar.set('c', '"\\')).toBe('c=%22%5C');
        expect(document.cookie).toBe('c=%22%5C');
      });

      it('special keys', function() {
        expect(CookieJar.set('c"', 'v')).toBe('c%22=v');
        expect(document.cookie).toBe('c%22=v');
      });
    });

    it('should not alter options', function() {
      var options = { Path: '/' };
      expect(CookieJar.set('c', 'v', options)).toBe('c=v;path=/');
      expect(options).toEqual({ Path: '/' });
    });

    describe('should not accept expires option', function() {
      it('as NaN', function() {
        expect(CookieJar.set('c', 'v', { expires: NaN })).toBe('c=v');
      });

      it('as Object', function() {
        expect(CookieJar.set('c', 'v', { expires: {} })).toBe('c=v');
      });
    });

    describe('should accept expires option', function() {
      it('as Infinity', function() {
        expect(CookieJar.set('c', 'v', { expires: Infinity })).toBe('c=v;expires=Tue, 19 Jan 2038 03:14:07 GMT');
      });

      it('as days from now', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.set('c', 'v', { expires: 1 })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });

      it('as string', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.set('c', 'v', { expires: tomorrow.toUTCString() })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });

      it('as date', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.set('c', 'v', { expires: tomorrow })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });
    });

    it('should accept secure option', function() {
      var options = { secure: true };
      expect(CookieJar.set('c', 'v', options)).toBe('c=v;secure');
    });
  });

  describe('setRaw()', function() {
    describe('should handle', function() {
      it('simple values', function() {
        expect(CookieJar.setRaw('c', 'v')).toBe('c=v');
        expect(document.cookie).toBe('c=v');
      });

      it('empty values', function() {
        expect(CookieJar.setRaw('c', '')).toBe('c=');
        expect(document.cookie).toBe('c=');
      });

      it('URL encoded values', function() {
        expect(CookieJar.setRaw('c', '%22%5C')).toBe('c=%22%5C');
        expect(document.cookie).toBe('c=%22%5C');
      });

      it('quoted values', function() {
        expect(CookieJar.setRaw('c', '"\\"\\\\"')).toBe('c="\\"\\\\"');
        expect(document.cookie).toBe('c="\\"\\\\"');
      });

      it('URL encoded keys', function() {
        expect(CookieJar.setRaw('c%22', 'v')).toBe('c%22=v');
        expect(document.cookie).toBe('c%22=v');
      });
    });

    it('should not alter options', function() {
      var options = { Path: '/' };
      expect(CookieJar.setRaw('c', 'v', options)).toBe('c=v;path=/');
      expect(options).toEqual({ Path: '/' });
    });

    describe('should not accept expires option', function() {
      it('as NaN', function() {
        expect(CookieJar.setRaw('c', 'v', { expires: NaN })).toBe('c=v');
      });

      it('as Object', function() {
        expect(CookieJar.setRaw('c', 'v', { expires: {} })).toBe('c=v');
      });
    });

    describe('should accept expires option', function() {
      it('as Infinity', function() {
        expect(CookieJar.setRaw('c', 'v', { expires: Infinity })).toBe('c=v;expires=Tue, 19 Jan 2038 03:14:07 GMT');
      });

      it('as days from now', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.setRaw('c', 'v', { expires: 1 })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });

      it('as string', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.setRaw('c', 'v', { expires: tomorrow.toUTCString() })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });

      it('as date', function() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(CookieJar.setRaw('c', 'v', { expires: tomorrow })).toBe('c=v;expires=' + tomorrow.toUTCString());
      });
    });

    it('should accept secure option', function() {
      var options = { secure: true };
      expect(CookieJar.setRaw('c', 'v', options)).toBe('c=v;secure');
    });
  });

  describe('remove()', function() {
    it('should return true on success', function() {
      document.cookie = 'c=v';
      expect(CookieJar.remove('c')).toBe(true);
    });

    describe('should return false on', function() {
      it('failure', function() {
        expect(CookieJar.remove('c')).toBe(false);
      });

      it('invalid key (undefined)', function() {
        expect(CookieJar.remove()).toBe(false);
      });

      it('invalid key (null)', function() {
        expect(CookieJar.remove(null)).toBe(false);
      });

      it('invalid key (empty string)', function() {
        expect(CookieJar.remove('')).toBe(false);
      });
    });

    it('should not alter options', function() {
      document.cookie = 'c=v;path=/';
      var options = { path: '/' };
      expect(CookieJar.remove('c', options)).toBe(true);
      expect(options).toEqual({ path: '/' });
    });

    it('should handle special keys', function() {
      document.cookie = 'c%22=v';
      expect(CookieJar.remove('c"')).toBe(true);
    });
  });

  describe('removeRaw()', function() {
    it('should return true on success', function() {
      document.cookie = 'c=v';
      expect(CookieJar.removeRaw('c')).toBe(true);
    });

    describe('should return false on', function() {
      it('failure', function() {
        expect(CookieJar.removeRaw('c')).toBe(false);
      });

      it('invalid key (undefined)', function() {
        expect(CookieJar.removeRaw()).toBe(false);
      });

      it('invalid key (null)', function() {
        expect(CookieJar.removeRaw(null)).toBe(false);
      });

      it('invalid key (empty string)', function() {
        expect(CookieJar.removeRaw('')).toBe(false);
      });
    });

    it('should not alter options', function() {
      document.cookie = 'c=v;path=/';
      var options = { Path: '/' };
      expect(CookieJar.removeRaw('c', options)).toBe(true);
      expect(options).toEqual({ Path: '/' });
    });

    it('should handle special keys', function() {
      document.cookie = 'c%22=v';
      expect(CookieJar.removeRaw('c%22')).toBe(true);
    });
  });
});

describe('JSON decorator', function() {
  var DecoratedCookieJar;

  beforeEach(function() {
    angular.module('config-helper', [])
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

    angular.mock.module('ngCookieJar', 'config-helper');

    angular.mock.inject(function(_$window_, _$document_, _CookieJar_) {
      DecoratedCookieJar = _CookieJar_;
    });
  });

  it('should serialize JSON', function() {
    expect(DecoratedCookieJar.setJson('c', { key: 'value' })).toBe('c=%7B%22key%22%3A%22value%22%7D');
  });

  it('should deserialize JSON', function() {
    document.cookie = 'c=%7B%22key%22%3A%22value%22%7D';
    expect(DecoratedCookieJar.getJson('c')).toEqual({ key: 'value' });
  });
});