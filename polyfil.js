// Polyfill for Object.values
if (!Object.values) {
    Object.values = function(obj) {
        if (obj === null || obj === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        return Object.keys(obj).map(function(key) {
            return obj[key];
        });
    };
}

// Polyfill for Object.entries
if (!Object.entries) {
    Object.entries = function(obj) {
        if (obj === null || obj === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        return Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
    };
}

// Polyfill for Array.flatMap
if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(callback, thisArg) {
        return this.reduce(function(acc, x, i, arr) {
            return acc.concat(callback.call(thisArg, x, i, arr));
        }, []);
    };
}

// Polyfill for Array.prototype.flat
if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
        var flatten = function(arr, depth) {
            if (depth < 1) {
                return arr.slice();
            }
            return arr.reduce(function(acc, val) {
                return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
            }, []);
        };
        return flatten(this, depth === undefined ? 1 : depth);
    };
}

// Polyfill for Object.hasOwnProperty
if (!Object.hasOwnProperty) {
    Object.hasOwnProperty = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
}
// Polyfill for Array.prototype.reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        
        var o = Object(this);
        var len = o.length >>> 0;
        var k = 0;
        var value;

        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in o)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = o[k++];
        }

        while (k < len) {
            if (k in o) {
                value = callback(value, o[k], k, o);
            }
            k++;
        }

        return value;
    };
}

// Polyfill for Array.prototype.map
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        if (this === null) {
            throw new TypeError('Array.prototype.map called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var T, A, k;

        var O = Object(this);
        var len = O.length >>> 0;

        if (thisArg) {
            T = thisArg;
        }

        A = new Array(len);
        k = 0;

        while (k < len) {
            var kValue, mappedValue;

            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }

        return A;
    };
}

// Polyfill for Array.prototype.flatMap
if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function(callback, thisArg) {
        return this.map(callback, thisArg).reduce(function(acc, val) {
            return acc.concat(val);
        }, []);
    };
}

// Polyfill for Array.prototype.flat
if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
        var flatten = function(arr, depth) {
            if (depth < 1) {
                return arr.slice();
            }
            return arr.reduce(function(acc, val) {
                return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
            }, []);
        };
        return flatten(this, depth === undefined ? 1 : depth);
    };
}
// Polyfill for Array.prototype.filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback, thisArg) {
        if (this === null) {
            throw new TypeError('Array.prototype.filter called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var O = Object(this);
        var len = O.length >>> 0;
        var res = [];
        var T = thisArg;

        for (var i = 0; i < len; i++) {
            if (i in O) {
                var val = O[i];
                if (callback.call(T, val, i, O)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

// Polyfill for Array.prototype.map
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        if (this === null) {
            throw new TypeError('Array.prototype.map called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var O = Object(this);
        var len = O.length >>> 0;
        var A = new Array(len);
        var T = thisArg;

        for (var i = 0; i < len; i++) {
            if (i in O) {
                A[i] = callback.call(T, O[i], i, O);
            }
        }

        return A;
    };
}

// Polyfill for Array.prototype.forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        if (this === null) {
            throw new TypeError('Array.prototype.forEach called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var O = Object(this);
        var len = O.length >>> 0;
        var T = thisArg;

        for (var i = 0; i < len; i++) {
            if (i in O) {
                callback.call(T, O[i], i, O);
            }
        }
    };
}
// Polyfill for String.prototype.includes
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (search instanceof RegExp) {
            throw TypeError('First argument to String.prototype.includes must not be a RegExp');
        }
        if (start === undefined) {
            start = 0;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Polyfill for String.prototype.startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

// Polyfill for String.prototype.endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

// Polyfill for String.prototype.repeat
if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring a string is not too long
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
            str += str;
            count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
    };
}

// Polyfill for String.prototype.trim
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
