function compareArrays(arr1, arr2) {
	const firstArr = arr1 || [];
	const secondArr = arr2 || [];
	if (firstArr.length !== secondArr.length) {
		return false;
	}
	for (var i = 0; i < firstArr.length; i++) {
		if (firstArr[i] !== secondArr[i]) {
			return false;
		}
	}
	return true;
}
export default compareArrays;
