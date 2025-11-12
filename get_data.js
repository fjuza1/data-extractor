/**
 * Utility class for extracting and normalizing data from objects returned by services.
 *
 * Methods are prefixed with `_` because they are intended as internal helpers,
 * however they are documented to make their behavior explicit for contributors
 * and consumers writing examples/tests.
 *
 * @class GetData
 */
export default class GetData {
	/**
	 * Return the values of an object as an array. If input is `null` or
	 * `undefined` an empty array is returned.
	 *
	 * @param {Object|null|undefined} obj - The object to read values from
	 * @returns {Array<any>} Array of values or [] when input is null/undefined
	 * @private
	 */
	_getObjectValues(obj) {
		if (obj === undefined || obj === null) return [];
		return Object.values(obj);
	}

	/**
	 * Return the keys of an object as an array of strings.
	 *
	 * @param {Object} obj - The object to get keys from
	 * @returns {Array<string>} Array of keys (empty array if input is not an object)
	 * @private
	 */
	_getObjectKeys(obj) {
		return Object.keys(obj)
	}

	/**
	 * Check whether a value is a primitive (not an object) or null.
	 *
	 * @param {*} obj - Value to test
	 * @returns {boolean} True when primitive (string/number/boolean/symbol/undefined) or null
	 * @private
	 */
	_isPrimitive(obj) {
		return typeof obj !== 'object' || obj === null
	}

	/**
	 * Check whether the provided value is an array that does NOT contain objects.
	 * Returns `undefined` when input is not an array.
	 *
	 * @param {*=} array - The value to test
	 * @returns {boolean|undefined} True if array and every element is not an object; undefined otherwise
	 * @private
	 */
	_isNotArrayOfObjects(array) {
		if (Array.isArray(array)) return array.every(element => typeof element !== 'object')
	}

	/**
	 * From an object's values, collect elements from arrays that contain only
	 * primitive/non-object types and flatten them into one array.
	 *
	 * @param {Object|Array} data - Object or array whose values are inspected
	 * @returns {Array<any>} Flattened array of primitive elements found in array-valued properties
	 * @private
	 */
	_getSingleDataTypesFromArrays(data) {
		return this._getObjectValues(data)
			.flatMap(element => {
				if (!element) return
				return this._isNotArrayOfObjects(element) ? [...element] : []
			})
	}

	/**
	 * Extract only primitive properties from an object into a new object.
	 * Returns an array with a single object to match downstream callers that expect
	 * an array of objects.
	 *
	 * @param {Object} obj - Source object
	 * @returns {Array<Object>} Single-element array with object of primitive props (empty object when no primitives found)
	 * @private
	 */
	_extractPrimitiveToObject(obj) {
		let primitiveProps = {};
		this._getObjectKeys(obj)
			.forEach(propKey => {
				const value = obj[propKey];
				this._isPrimitive(value) ? primitiveProps[propKey] = value : null
			})
		return [primitiveProps]
	}

	/**
	 * Return a flat array of nested objects found in the values of the provided
	 * object. Non-object values are ignored.
	 *
	 * @param {Object|Array} obj - Source object/array to scan for nested objects
	 * @returns {Array<Object>} Array of nested object values (may be empty)
	 * @private
	 */
	_getNestedObjects(obj) {
		return this._getObjectValues(obj).map(v => v instanceof Object ? this._getObjectValues(v) : [v])
			.reduce((acc, next) => acc.concat(...next), [])
			.reduce((acc, cur) => typeof cur === 'object' ? [...acc, cur] : acc, []);
	}

	/**
	 * Collect simple (non-nested) objects from either an object or array.
	 * The method attempts to filter out complex/nested objects and arrays.
	 *
	 * @param {Object|Array} data - The data to inspect
	 * @returns {Array<Object>} Array of simple objects (objects that do not contain nested objects)
	 * @private
	 */
	_getSimpleObjects(data) {
		if (!Array.isArray(data)) {
			return this._getObjectValues(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' &&
					!Array.isArray(cur) || cur === null &&
					this._getObjectValues(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		} else {
			return this._getObjectValues(data)
				.reduce((acc, cur, i, arr) => cur &&
					typeof cur === 'object' || Array.isArray(arr) || cur === null &&
					!Array.isArray(cur) && this._getObjectValues(cur).every(value => typeof value !== 'object') ? [...acc, cur] : acc, [])
		}
	}

	/**
	 * Combine primitive, nested and simple objects into a consolidated array used
	 * by higher-level processing routines.
	 *
	 * @param {Object|Array} data - Input data to analyze
	 * @param {Object} [options] - Optional parameters
	 * @param {number} [options.numOfItems] - If set, limit the number of nested items included
	 * @returns {Array<Object|Array>} Consolidated array of objects / primitive-arrays
	 * @private
	 */
	_getValuesAndKeysArray(data, options = {}) {
		const {numOfItems} = options
		const primitiveObjects = this._extractPrimitiveToObject(data);
		let nestedObjects = this._getNestedObjects(data)
		numOfItems ? nestedObjects = this._getNestedObjects(data).slice(0, numOfItems) : this._getNestedObjects(data)
		const simpleObjects = this._getSimpleObjects(data)
		const complexWithArrays = this._getObjectValues(data)
			.reduce((acc, cur) => cur && !Array.isArray(cur) && this._getObjectValues(cur).some(value => Array.isArray(value)) ? [...acc, cur] : acc, [])
		let primitiveArrays = this._getSingleDataTypesFromArrays(data)
		let result;
		result = [...primitiveObjects, ...nestedObjects, ...simpleObjects]
		if (primitiveArrays.length > 0) result = [...result, primitiveArrays]
		return result.reduce((acc, cur) => cur && !Object.keys(cur).length < 1 ? [...acc, cur] : acc, []);
	}
}