const options = [
	{
		id: 1,
		label: 'No Credit',
		value: 'No Credit',
	},
	{
		id: 2,
		label: 'Composer',
		value: 'Composer',
	},
	{
		id: 3,
		label: 'Lyricist',
		value: 'Lyricist',
	},
	{
		id: 4,
		label: 'Producer',
		value: 'Producer',
	},
	{
		id: 5,
		label: 'Remixer',
		value: 'Remixer',
	},
];

const getCreditsInfo = async ({ splitId, splitUsers, splitTracks }, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/credits/${splitId}`, {
			signal: controller.signal,
		});
		if (data?.success) {
			const creditsFromDatabase = data.credits;
			const writers = splitUsers.map(writer => {
				let creditNames = creditsFromDatabase
					.filter(el => writer.email === el.email)
					.flatMap(el => el.creditNames);
				if (creditNames.length === 0) return writer;
				if (creditNames.length > 1) {
					creditNames = creditNames.filter(creditName => creditName !== 'No Credit');
				}
				const normalizedCredits = options.filter(option => creditNames.includes(option.value));
				return { ...writer, credits: [...normalizedCredits] };
			});

			// if (creditsFromDatabase.length > 0) {
			const upgradedTracks = splitTracks.map(track => {
				const trackId = track.id;

				const trackUsers = track.splitUsers;
				if (!trackUsers) return track;
				const updatedUsers = trackUsers.map(user => {
					const foundCredit = creditsFromDatabase.find(
						credit => credit.trackId === trackId && credit.userId === user.userId,
					);
					if (foundCredit) {
						const normalizedCredits = options.filter(option =>
							foundCredit.creditNames.includes(option.value),
						);
						const updatedUser = { ...user, credits: [...normalizedCredits] };
						return updatedUser;
					} else {
						return user;
					}
				});
				return { ...track, splitUsers: updatedUsers };
			});

			return { splitUsers: writers, splitTracks: upgradedTracks };
		}
	} catch (error) {
		console.log('getCreditsInfo error: ', error);
	}
};

export default getCreditsInfo;
