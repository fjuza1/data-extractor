
import GetData from './get_data.js'

/**
 * Data consolidation utilities that extend the extraction helpers in GetData.
 *
 * This class provides methods to normalize keys/values from nested service
 * responses, remove disallowed properties, rename complex keys and prepare
 * key/value pairs for environment storage. Methods are considered internal
 * helpers (prefixed with `_`) but are documented for maintainability.
 *
 * @extends GetData
 */
class ConsolidateData extends GetData {
	/**
	 * Ensure items in an array are unique by adding a numeric suffix to duplicates.
	 * If `obj` is not an array it is returned unchanged.
	 *
	 * @param {Array<any>|*} obj - Array of keys (or other value) to normalise
	 * @returns {Array<any>|*} Array with unique entries (suffixed) or original value
	 * @private
	 */
	_numberDuplicates(obj) {
		let i = 1;
		if (Array.isArray(obj)) {
			// Reduce the array to unique values by appending a numeric suffix
			// when a duplicate is encountered. We keep an `i` counter to
			// increment the suffix until the value becomes unique within `acc`.
			const uniqueWithSuffix = obj.reduce((acc, cur) => {
				const original = cur;
				// If `cur` already exists in accumulator, append/increment a numeric
				// suffix until it becomes unique.
				while (acc.includes(cur)) {
					i++;
					cur = `${original}${i}`;
				}
				// reset counter for next iteration
				i = 1;
				return [...acc, cur];
			}, [])
			// Ensure that items without any digit get a `1` suffix so callers can
			// rely on a consistent numbered naming convention (e.g. `name1`).
			.map(item => !(/\d/).test(item) ? `${item}1` : `${item}`);
			return uniqueWithSuffix;
		}
		return obj;
	}
	/**
	 * Extract and return properties from `data` whose keys are listed in `disallowedKeys`.
	 *
	 * @param {Object} data - Source object
	 * @param {Array<string>} disallowedKeys - Array of disallowed keys to extract
	 * @returns {Object} Object containing the extracted disallowed key/value pairs
	 * @private
	 */
	_getDisallowed(data, disallowedKeys) {
		const extracted = {};
		// Collect key/value pairs from `data` where the key is present in
		// `disallowedKeys`. This allows callers to keep a copy of those
		// properties before they are removed.
		Object.keys(data)
			.filter(key => disallowedKeys.includes(key))
			.forEach(key => extracted[key] = data[key])
		return extracted
	}

	/**
	 * Remove properties from `data` whose keys are listed in `disallowedKeys`.
	 * This mutates the provided object.
	 *
	 * @param {Object} data - Object to remove keys from (mutated)
	 * @param {Array<string>} disallowedKeys - Array of keys to remove
	 * @returns {void}
	 * @private
	 */
	_removeDisallowed(data, disallowedKeys) {
		// Mutate the provided object by deleting any keys that are listed in
		// `disallowedKeys`. This is done in-place because callers expect the
		// original object to be cleaned of those properties.
		Object.keys(data)
			.filter(key => disallowedKeys.includes(key))
			.forEach(key => delete data[key]);
	}

	/**
	 * Consolidate collected values/keys from nested structures into two parallel
	 * arrays: keys and values. Used by higher-level renaming and extraction logic.
	 *
	 * @param {Object|Array} result - Input data to scan
	 * @param {Object} [options] - Optional parameters passed to `_getValuesAndKeysArray`
	 * @returns {[Array<string>, Array<any>]} Tuple of [keysArray, valuesArray]
	 * @private
	 */
	/**
	 * Helper: extract key-value pairs from a single value recursively.
	 *
	 * @param {*} val - Value to inspect (object or primitive)
	 * @param {string} key - Parent key name used when `val` is primitive
	 * @param {Array<string>} keysArray - Accumulator for discovered keys
	 * @param {Array<any>} valuesArray - Accumulator for discovered values
	 * @private
	 */
	_extractKeyValuePairs(val, key, keysArray, valuesArray) {
		if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
			for (const nestedKey in val) {
				if (Object.prototype.hasOwnProperty.call(val, nestedKey)) {
					const element = val[nestedKey];
					keysArray.push(nestedKey);
					valuesArray.push(element);
					// If the nested element is itself an object we stop the recursion
					// here (return) to avoid deep traversal — the higher-level
					// consolidation logic expects only the first-level nested keys
					// to be captured for renaming/flattening.
					if (typeof element === 'object') return;
				}
			}
		} else if (typeof val !== 'object') {
			keysArray.push(key);
			valuesArray.push(val);
		}
	}

	_consolidateData(result, options = {}) {
		const collectedData = this._getValuesAndKeysArray(result, options)
		const keysArray = [];
		const valuesArray = []
		// Iterate over the consolidated pieces (primitive obj, nested objects,
		// simple objects and primitive arrays). For each object we extract
		// key/value pairs using `_extractKeyValuePairs` which will push
		// discovered keys and values into the parallel accumulators.
		collectedData.forEach(obj => {
			if (obj === undefined || obj === null) return
			Object.entries(obj).forEach(([key, val]) => {
				this._extractKeyValuePairs(val, key, keysArray, valuesArray);
			});
		});
		return [keysArray, valuesArray]
	}

	/**
	 * Recursively search `data` for the first occurrence of `searchedValue` and
	 * return the key/value structure that contains it.
	 *
	 * @param {Object} data - Object to search
	 * @param {*} searchedValue - Value to find ("searched value")
	 * @returns {Object|null} Object containing the found key/value or null if not found
	 * @private
	 */
	_getObjectByValue(data, searchedValue) {
		const keys = this._getObjectKeys(data);
		for (const key of keys) {
			const value = data[key];
			if (value === searchedValue) {
				return {
					[key]: value
				};
			}
			if (typeof value === 'object' && value !== null) {
				// Recurse into nested objects. If the searched value is found
				// inside a child object, we wrap the returned structure with
				// the current key to preserve the path to the found value.
				const vnoreneRes = this._getObjectByValue(value, searchedValue);
				if (vnoreneRes) {
					return {
						[key]: vnoreneRes
					}
				}
			}

		}
		return null;
	}

	/**
	 * Determine whether values in an object are primitive types (number, boolean, string).
	 *
	 * @param {Object} obj - Object whose values should be tested
	 * @returns {Array<RegExpMatchArray|null>} Array of match results per value
	 * @private
	 */
	_isSingleObjectType(obj) {
		// Map each value to the result of matching its typeof against
		// primitive type names. This is used by callers to detect whether a
		// simple object contains only primitive values.
		return this._getObjectValues(obj).map(element => (typeof element).match(/(number)|(boolean)|(string)/))
	}

	/**
	 * Produce a list of renamed keys for complex nested objects. This function
	 * inspects nested structures and creates unique, indexed key names like
	 * `parent_1`, `parent_2`, preserving a price/primitive key at the front when present.

	 * @param {Object} res - Input object to inspect and derive keys from
	 * @returns {Array<string>} Array of new key names
	 * @private
	 */
	/**
	 * Helper: build key names from nested object properties.
	 *
	 * @param {Object} element - Nested object to iterate
	 * @param {string} parentKey - Parent key name used as prefix
	 * @param {Array<string>} array - Accumulator array to push generated names into
	 * @private
	 */
	_buildKeyNamesFromElement(element, parentKey, array) {
		for (let ky in element) {
			if (Object.prototype.hasOwnProperty.call(element, ky)) {
				// If the nested key is numeric (e.g. array index) convert it to a
				// 1-based index for readability when used in generated key names.
				if (!isNaN(+ky)) {
					ky = +ky + 1;
				}
				// Push the generated composite name into the accumulator.
				array.push(`${parentKey}_${ky}`);
			}
		}
	}

	_renameKeysInComplexObject(res) {
		let array = [];
		// Build a list of renamed keys by examining consolidated values
		// and finding their parent objects inside `res`. We then collect
		// the child property names and prefix them with the parent key.
		const searchValues = this._consolidateData(res)[1];
		const foundObjects = searchValues.map(item => this._getObjectByValue(res, item));
		foundObjects.forEach(val => {
			for (const parentKey in val) {
				if (Object.prototype.hasOwnProperty.call(val, parentKey)) {
					const element = val[parentKey];
					// If the element is a primitive string it's used as-is and we
					// don't descend into it for generated names.
					if (typeof element === 'string') return;
					this._buildKeyNamesFromElement(element, parentKey, array);
				}
			}
		});
		// If the input contains primitive properties (for example a price)
		// prefer to place the primitive key at the front of the generated
		// list so the flattened output keeps that important field prominent.
		const price = Object.entries(this._extractPrimitiveToObject(res)[0])[0]
		if (price) array.unshift(price[0])
		return array
	}

	/**
	 * Extract key/value pairs from a complex nested array/object structure and
	 * return a flat result object mapping renamed keys to corresponding values.
	 *
	 * @param {Object|Array} data - Input data to extract from
	 * @param {Object} [options] - Optional parameters passed to consolidation routines
	 * @param {number} [options.numOfItems] - Limit number of nested items processed
	 * @returns {Object} Flattened key/value mapping
	 * @private
	 */
	_extractValuesFromArray(data, options = {}) {
		// Preserve a copy of primitive (disallowed) keys so they can be
		// re-attached to the final result after renaming/flattening.
		const disallowed = this._getDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(data)[0]))
		// Remove the previously extracted disallowed keys from `data` so
		// they don't interfere with the renaming/consolidation logic.
		this._removeDisallowed(data, Object.getOwnPropertyNames(this._extractPrimitiveToObject(disallowed)[0]))
		const renamedKeys = this._renameKeysInComplexObject(data)
		// Cache the consolidated data to avoid repeated work
		const consolidatedData = this._consolidateData(data, options)
		const consolidatedKeys = consolidatedData[0]
		const consolidatedValues = consolidatedData[1]
		// Merge renamed parent-based keys with consolidated child keys to
		// produce a one-to-one mapping between generated names and values.
		const mergeKeyPairs = (renamedKeys, consolidatedKeys) => {
			const flatRenamedKeys = renamedKeys.flat();
			const flatConsolidatedKeys = consolidatedKeys.flat();
			const mergedKeys = flatRenamedKeys.map((item, i) => {
				let keyString = `${item}_${flatConsolidatedKeys[i]}`
				// Remove duplicate segments while preserving order
				keyString = Array.from(new Set(Object.values(keyString.split('_'))))
				return keyString.join('_')
			})
			return mergedKeys
		}
		const mergedKeysList = mergeKeyPairs(renamedKeys, consolidatedKeys)
		// Convert merged keys into the final key strings expected by callers.
		const finalKeys = mergedKeysList.map(item => {
			return item
				.split('_')
				.map((part, index) => (index > 0 && !isNaN(part) ? part : index === 0 ? part : `_${part}`))
				.join('');
		});
		const result = {};
		// Assign values to their corresponding final key names preserving
		// the index-based association between the `finalKeys` and
		// `consolidatedValues` arrays.
		finalKeys.forEach((key, index) => {
			result[key] = consolidatedValues[index];
		});
		// Re-attach previously removed disallowed primitive keys to the
		// final result so important top-level properties are preserved.
		Object.keys(disallowed).forEach((key) => result[key] = disallowed[key]);
		return result
	}

	/**
	 * Prepare and (optionally) store key/value pairs into an environment store.
	 * Current implementation logs null keys and the provided key/value pairs
	 * to the console; integration points (e.g. pm.environment.set) are commented out.
	 *
	 * @param {Object} data - Source object to analyze for empty keys
	 * @param {Object} [options] - Optional parameters (currently passed to extraction functions)
	 * @private
	 */
	_storeKeyValuesToEnv(data, options = {}) {
		// Determine keys that have null values so they can be explicitly
		// set to null in an environment store if required.
		let emptyKeys = this._getValuesAndKeysArray(data, options)
			.flatMap((obj) => Object.keys(obj).reduce((acc, o) => obj[o] === null ? [...acc, o] : acc, []))
		// Ensure duplicates in the list of empty keys are numbered for unique names
		emptyKeys = this._numberDuplicates(emptyKeys)
		// Log each empty key (and leave commented hooks for Postman)
		if (emptyKeys) {
			emptyKeys.forEach(element => {
				console.log(element, null);
				//pm.environment.set(element,null);
			});
		}
		// Extract flattened values and print them (or set in environment if
		// integration is enabled). We skip falsy values and empty keys to avoid
		// polluting the environment with unintended entries.
		const extractedValues = this._extractValuesFromArray(data, options)
		Object.entries(extractedValues).forEach(([key, value]) => {
			if(!value) return
			if(!key) return
			//pm.environment.set(key,value);
			console.log(key, value);
		})
	}
}
export default new ConsolidateData()