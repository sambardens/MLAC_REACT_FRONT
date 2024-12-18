async function getPendingNotifications(bapId, axiosPrivate) {
	const controller = new AbortController();
	try {
		const res = await axiosPrivate.get(`/api/notifications/pending/${bapId}`, {
			signal: controller.signal,
		});

		return res.data.users;
	} catch (e) {
		console.log('getPendingNotificationsBap error:', e);
	}
}

export default getPendingNotifications;
