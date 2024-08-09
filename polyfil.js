function Array(array) {
    this.array = array;
}

Array.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            callback.call(thisArg, this.array[i], i, this.array);
        }
    }
    return this; // Return `this` for chaining
};

Array.prototype.map = function(callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.array.length; i++) {
        if (this.array.hasOwnProperty(i)) {
            result[i] = callback.call(thisArg, this.array[i], i, this.array);
        }
    }
    this.array = result;
    return this; // Return the instance for chaining
};

Array.prototype.filter = function(callback, thisArg) {
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
Array.prototype.getResult = function() {
    return this.array;
};
// Example usage
var numbers = new Array([1, 2, 3, 4, 5]);

numbers
    .forEach(function(num, index) {
        console.log("Original number:", num, "at index:", index);
    })
    .map(function(num) {
        return num * 2;
    })
    .filter(function(num) {
        return num > 5;
    })
    .forEach(function(num) {
        console.log("Processed number:", num);
    });

var finalResult = numbers.getResult();
console.log("Final result:", finalResult);
