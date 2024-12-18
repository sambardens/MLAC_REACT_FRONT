import checkIsInclude from './checkIsInclude';

function filterUsers(users, query) {
	if (!query) {
		return users;
	}

	const filteredUsers = users.filter(u => {
		if (
			checkIsInclude(u.firstName, query) ||
			checkIsInclude(u.lastName, query) ||
			checkIsInclude(u.email, query) ||
			checkIsInclude(u.updatedAt, query)
		) {
			return true;
		}

		return false;
	});

	return filteredUsers;
}

export default filterUsers;
