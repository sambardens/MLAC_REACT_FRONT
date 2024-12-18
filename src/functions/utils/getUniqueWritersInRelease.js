const getUniqueWritersInRelease = deals => {
	const allUsers = deals.map(el => el.splitUsers).flat();
	const uniqueUsers = [];

	allUsers.forEach(user => {
		const isDuplicate = uniqueUsers.find(el => el?.email === user.email);

		if (!isDuplicate) {
			uniqueUsers.push(user);
		}
	});

	const res = uniqueUsers.map(el => {
		if (el.firstName && el.lastName) {
			return { ...el, name: `${el.firstName} ${el.lastName}` };
		}
		if (el.firstName && !el.lastName) {
			return { ...el, name: el.firstName };
		}
		return { ...el, name: el.email };
	});
	return res;
};

export default getUniqueWritersInRelease;
