function compareObjects(obj1, obj2) {
	for (let key in obj1) {
		if (obj1[key] !== obj2[key]) {
			return false;
		}
	}
	return true;
}

function compareArraysOfObjects(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return true;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (!compareObjects(arr1[i], arr2[i])) {
			return true;
		}
	}

	return false;
}

export default compareArraysOfObjects;
