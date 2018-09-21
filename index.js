(function (factory) {
  const dependencies = [];

  if (('function' === typeof define) && define.amd) {
    // RequireJS/AMD
    define(dependencies, factory);
  } else {
    // Detect exports ( window || module.exports || false )
    let exports          = false;
    exports              = exports || ('object' === typeof window) ? window : this;
    exports              = exports || ('object' === typeof module) ? module.exports : false;
    if ( !exports ) throw new Error("Could not initialize deniable events");
    exports.DeniableEmitter = factory(...dependencies.map(require));
  }

})(function () {
  const events = Symbol();

  function EventEmitter() {
    if (!(this instanceof EventEmitter)) return new EventEmitter();
    this[events] = {'*':[]};
  }

  EventEmitter.prototype.on = function (name, handler) {
    if ('function' !== typeof handler) return this;
    if (!this[events][name]) this[events][name] = [];
    this[events][name].push(handler);
    return this;
  };

  EventEmitter.prototype.off = function (name, handler) {
    if (!this[events][name]) return this;
    const index = this[events][name].indexOf(handler);
    if ( index < 0 ) return this;
    this[events][name].splice(index,1);
    return this;
  };

  EventEmitter.prototype.emit = function( name, ...args ) {
    const list   = (this[events][name]||[]).concat(this[events]['*']).slice();
    let callback = (err,res)=>{if(err)throw err;return res;};
    if ( 'function' === typeof args[args.length-1] ) callback = args.pop();

    // Return undefined when using callback, otherwise you might start a parallel universe
    (async function next (err, data) {
      if ( err ) return callback(err);
      let handler = list.shift();
      if ( 'function' !== typeof handler ) {
        return list.length ? next(undefined,data) : callback(undefined,data);
      }
      let response = handler(...args.slice(),next);
      if ( 'undefined' === response ) return;
      try {
        await response;
        await next(undefined,response);
      } catch(e) {
        await next(e);
      }
    })();
  };

  EventEmitter.prototype.once = function( name, handler ) {
    const emitter = this;
    emitter.on( name, function g(...args) {
      emitter.off(name,g);
      return handler(...args);
    });
    return this;
  };

  return EventEmitter;
});
