// Custom Array wrapper for chaining methods
function ChainableArray(array) {
    this.array = array;
}

// forEach method
ChainableArray.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            callback.call(thisArg, this.array[i], i, this.array);
        }
    }
    return this; // Return the instance for chaining
};

// map method
ChainableArray.prototype.map = function(callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            result[i] = callback.call(thisArg, this.array[i], i, this.array);
        }
    }
    this.array = result;
    return this; // Return the instance for chaining
};

// filter method
ChainableArray.prototype.filter = function(callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            if (callback.call(thisArg, this.array[i], i, this.array)) {
                result.push(this.array[i]);
            }
        }
    }
    this.array = result;
    return this; // Return the instance for chaining
};

// reduce method
ChainableArray.prototype.reduce = function(callback, initialValue) {
    var accumulator = (initialValue !== undefined) ? initialValue : this.array[0];
    var startIndex = (initialValue !== undefined) ? 0 : 1;

    for (var i = startIndex; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            accumulator = callback(accumulator, this.array[i], i, this.array);
        }
    }
    this.array = [accumulator]; // Wrap result in an array for further chaining
    return this; // Return the instance for chaining
};

// some method
ChainableArray.prototype.some = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            if (callback.call(thisArg, this.array[i], i, this.array)) {
                this.array = [true];
                return this; // Return the instance with `true` as result
            }
        }
    }
    this.array = [false];
    return this; // Return the instance with `false` as result
};

// every method
ChainableArray.prototype.every = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            if (!callback.call(thisArg, this.array[i], i, this.array)) {
                this.array = [false];
                return this; // Return the instance with `false` as result
            }
        }
    }
    this.array = [true];
    return this; // Return the instance with `true` as result
};

// find method
ChainableArray.prototype.find = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            if (callback.call(thisArg, this.array[i], i, this.array)) {
                this.array = [this.array[i]];
                return this; // Return the instance with found element as array
            }
        }
    }
    this.array = []; // Return empty array if not found
    return this; // Return the instance for chaining
};

// Method to get the final array result
ChainableArray.prototype.getResult = function() {
    return this.array;
};
ChainableArray.isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
};
var numbers = new ChainableArray([1, 2, 3, 4, 5]);

var result = numbers
    .map(function(num) {
        return num * 2; // Double each number
    })
    .filter(function(num) {
        return num > 5; // Keep numbers greater than 5
    })
    .reduce(function(acc, num) {
        return acc + num; // Sum the numbers
    })
    .getResult(); // Get the final result

log.warn(result.join(", ")); // Output the result as a string
