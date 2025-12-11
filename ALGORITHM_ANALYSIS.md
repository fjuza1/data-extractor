# Algorithm Analysis

This document summarizes the asymptotic time and space complexity of the helper methods defined in the repository. The analysis assumes `n` to be the number of enumerable properties on an input object and `m` the number of elements in an input array (when relevant).

## `get_data.js`

### `_getObjectValues`
* **Time:** `O(n)` – iterates over all enumerable properties to build the values array.
* **Space:** `O(n)` – allocates a new array of the values.

### `_getObjectKeys`
* **Time:** `O(n)` – enumerates all object keys.
* **Space:** `O(n)` – returns a new array containing the keys.

### `_isPrimitive`
* **Time:** `O(1)` – constant type checks.
* **Space:** `O(1)`.

### `_isNotArrayOfObjects`
* **Time:** `O(m)` – `Array.prototype.every` checks each element at most once.
* **Space:** `O(1)` – no additional collections created.

### `_getSingleDataTypesFromArrays`
* **Time:** `O(n + k)` where `n` is the number of object properties inspected and `k` is the total number of primitive array elements collected. Each property is visited once and the primitive array elements are copied once into the flattened result.
* **Space:** `O(k)` – output array holding the collected primitive elements.

### `_extractPrimitiveToObject`
* **Time:** `O(n)` – scans each property once to test and copy primitive values.
* **Space:** `O(p)` – creates an object containing only the `p` primitive properties (wrapped in a single-element array).

### `_getNestedObjects`
* **Time:** `O(n + t)` where `t` is the total number of nested object values encountered. Values are read once, flattened, and filtered for objects.
* **Space:** `O(t)` – accumulates references to nested object values in the returned array.

### `_getSimpleObjects`
* **Time:** `O(n)` – each property (or array element) is inspected once with constant-time predicates.
* **Space:** `O(s)` – stores the `s` simple objects that match the filters.

### `_getValuesAndKeysArray`
* **Time:** `O(n + t + k)` dominated by the helper calls: primitive extraction (`O(n)`), nested object discovery (`O(t)`), primitive arrays (`O(k)`), and simple object filtering (`O(n)`).
* **Space:** `O(n + t + k)` – combines outputs from the helper routines into the consolidated array.

## `consolidate-data.js`

### `_numberDuplicates`
* **Time:** `O(m^2)` in the worst case because `Array.prototype.includes` performs a linear scan inside the reducer for each element, leading to a quadratic duplicate check.
* **Space:** `O(m)` – builds a new array of unique/suffixed items.

### `_getDisallowed`
* **Time:** `O(n)` – filters and copies matching keys once.
* **Space:** `O(d)` – creates an object with `d` disallowed properties.

### `_removeDisallowed`
* **Time:** `O(n)` – iterates through keys and deletes matches once.
* **Space:** `O(1)` – mutates in place without additional collections.

### `_extractKeyValuePairs`
* **Time:** `O(a)` where `a` is the number of enumerable properties on the inspected value (best-case `O(1)` when the value is primitive). Early returns prevent deeper recursion.
* **Space:** `O(1)` – pushes into provided accumulators.

### `_consolidateData`
* **Time:** `O(n + t + k)` – dominated by `_getValuesAndKeysArray`; additional object/entry loops are linear in the size of the consolidated array.
* **Space:** `O(n + t + k)` – holds intermediate arrays of keys/values proportional to collected items.

### `_getObjectByValue`
* **Time:** Worst-case `O(n)` for shallow objects; can grow to `O(n * h)` for nested structures with height `h` because each level explores all keys until the searched value is found or the traversal ends.
* **Space:** `O(h)` – recursion depth proportional to nesting height.

### `_isSingleObjectType`
* **Time:** `O(n)` – maps over each value once.
* **Space:** `O(n)` – allocates an array of match results aligned with the input values.

### `_buildKeyNamesFromElement`
* **Time:** `O(a)` – iterates over the enumerable properties of the provided element once.
* **Space:** `O(a)` – pushes `a` generated key fragments into the accumulator array.

### `_renameKeysInComplexObject`
* **Time:** `O(n + t)` – consolidates values (`_consolidateData`), searches for each consolidated value via `_getObjectByValue` (which is linear in object size for each lookup), and walks discovered objects to build names. In the worst case with many nested lookups, complexity trends toward `O(n * t)`.
* **Space:** `O(n + t)` – stores arrays of consolidated values and generated key names.

### `_extractValuesFromArray`
* **Time:** `O(n + t)` – performs primitive extraction/removal (`O(n)`), renaming (`O(n + t)`), consolidation (`O(n + t)`), and merges arrays linearly to build the final mapping.
* **Space:** `O(n + t)` – maintains intermediate arrays of renamed keys, consolidated keys/values, and the resulting object.

### `_storeKeyValuesToEnv`
* **Time:** `O(n + t)` – gathers empty keys (`O(n + t)` via `_getValuesAndKeysArray`), numbers duplicates (`O(m^2)` where `m` is the count of empty keys), extracts values (`O(n + t)`), and iterates linearly over results. Duplicate numbering dominates when many empty keys exist.
* **Space:** `O(n + t)` – holds arrays of empty keys and extracted key/value pairs.

