function sortByLastName(data) {
	const sortedArray = [...data];
	sortedArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
	return sortedArray;
}

export default sortByLastName;
