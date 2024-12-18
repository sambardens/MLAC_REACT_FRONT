function getUniqueWritersForSelector(deals) {
	if (deals) {
		const writers = deals.reduce((sum, deal) => {
			const dealUserArray = deal.writers.split(', ');
			const updatedSumArray = [...sum, ...dealUserArray];
			return updatedSumArray;
		}, []);

		const includedUser = [];
		const uniqueUsers = writers.filter(user => {
			const isAlreadyIncluded = includedUser.includes(user);
			includedUser.push(user);
			return !isAlreadyIncluded;
		});

		const preparedUsersForSelector = ['All', ...uniqueUsers].map(user => {
			return { label: user, value: user, name: 'userType' };
		});

		return preparedUsersForSelector;
	}
}

export default getUniqueWritersForSelector;
