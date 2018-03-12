/**
 * Created by LiuZihao on 2017/5/26.
 */


var Cache = (function () {
  var LRU       = require('lru-cache')
      , options = { max: 100 }
      , cache   = LRU(options);
  var Cache     = function () {
    this.cache = cache;
  };

  Cache.prototype = {
    construct: Cache,
    set: function (url, data) {
      return this.cache.set(url, data);
    },
    get: function (url) {
      return this.cache.get(url);
    },
    del: function (key) {
      this.cache.del(key);
    },
    reset: function () {
      this.cache.reset();
    }
  };
  return Cache;

})();
export default Cache;