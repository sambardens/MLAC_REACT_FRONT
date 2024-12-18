function getPersmissions(members, currentUserId) {
	const userFromMembers = members?.find(member => member.userId === currentUserId);
	const isUserAdminInThisBap = userFromMembers?.isFullAdmin;
	const isUserCreaterOfThisBap = userFromMembers?.isCreator;

	return [isUserAdminInThisBap, isUserCreaterOfThisBap];
}

export default getPersmissions;
