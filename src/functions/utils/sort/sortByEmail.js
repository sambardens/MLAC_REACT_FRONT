function sortByEmail(data) {
	const sortedArray = [...data];
	sortedArray.sort((a, b) => a.email.localeCompare(b.email));
	return sortedArray;
}

export default sortByEmail;
