// oldest
// function getNeededValues(user) {
//   console.log(user)
//   const allValues = Object.values(user);
//   const neededValues = allValues.slice(1, allValues.length - 1);
//   return neededValues;
// }
function getNeededValues(user) {
	const { firstName, lastName, email } = user;
	const neededValues = `${firstName} ${lastName}, ${email}`;
	return neededValues;
}

function getCSVContent(filteredUsers) {
	const selectedUsers = filteredUsers.filter(u => !!u.isSelected);

	if (!selectedUsers.length) {
		return false;
	}

	const csvContent = `data:text/csv;charset=utf-8,${selectedUsers
		.map(user => getNeededValues(user))
		.join('\n')}`;

	return csvContent;
}

export default getCSVContent;
