async function getAllNotReviewedNotifications(axiosPrivate) {
	const controller = new AbortController();
	try {
		const res = await axiosPrivate.get('/api/notifications', {
			signal: controller.signal,
		});

		return res.data.notifications;
	} catch (e) {
		console.log('getAllNotReviewedNotifications error:', e);
	}
}

export default getAllNotReviewedNotifications;

// import io from 'socket.io-client';
// import getJwt from 'src/functions/utils/getJwt';

// const jwt = getJwt();
// const socket = io(process.env.NEXT_PUBLIC_URL, {
//   extraHeaders: {
//     Authorization: `Bearer ${jwt}`,
//   },
// });

// socket.on('connect', () => {
//   console.log('WebSocket connection established');
// });

// socket.on('new_notification', (notification) => {
//   console.log('New notification received:', notification);
// });

// export default socket;
