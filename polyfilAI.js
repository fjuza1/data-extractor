function ChainableArray(array) {
    this.array = array;
}

ChainableArray.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            callback.call(thisArg, this.array[i], i, this.array);
        }
    }
    return this; // Return `this` for chaining
};

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

ChainableArray.prototype.getResult = function() {
    return this.array;
};

// Create an instance of ChainableArray
var numbers = new ChainableArray([1, 2, 3, 4, 5]);

var nieco = numbers
    .map(function(num, index) {
        return num; // Just return the number
    })
    .getResult(); // Call getResult() to get the final array
console.log("🚀 ~ nieco:", nieco)
