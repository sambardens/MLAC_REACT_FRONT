function getPreparedMembersOfBap(members) {
	const preparedMembers = members?.map(member => {
		const isFullAdmin = Boolean(member.isFullAdmin);
		const isCreator = Boolean(member.isCreator);
		return {
			...member,
			isFullAdmin,
			isCreator,
		};
	});

	return preparedMembers;
}

export default getPreparedMembersOfBap;
