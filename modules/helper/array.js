function removeArrayItem(arr, value) {
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

function sortObject(dataObject) {
	return Object.fromEntries(
		Object.entries(dataObject).sort(([, a], [, b]) => a - b),
	);
}

function mergeObjects(obj1, obj2) {
	return Object.assign({}, obj1, obj2);
}

function isEmptyObject(obj) {
	return Object.keys(obj).length === 0;
}

function sumObjectByKey(obj, key) {
	// eslint-disable-next-line no-shadow
	return obj.reduce((total, obj) => obj[key] + total, 0);
}

function isDuplicate(arr) {
	return new Set(arr).size !== arr.length;
}

function isArrayValDuplicate(arr, valSearch) {
	return arr.filter(val => val == valSearch).length >= 1 ? true : false;
}

module.exports = { removeArrayItem, sortObject, mergeObjects, isEmptyObject, sumObjectByKey,
	isDuplicate, isArrayValDuplicate };