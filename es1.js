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
