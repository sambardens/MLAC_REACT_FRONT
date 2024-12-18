function compareObjects(newData, oldData) {
	const ObjectDataKeys = Object.keys(newData);
	for (let i = 0; i < ObjectDataKeys.length; i++) {
		const key = ObjectDataKeys[i];
		if (newData[key] !== oldData[key]) {
			return true;
		}
	}
	return false;
}

export default compareObjects;
