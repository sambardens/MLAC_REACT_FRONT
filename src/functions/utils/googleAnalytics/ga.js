export const pageviewGA = url => {
	if (window !== undefined) {
		window.gtag('config', process.env.NEXT_PUBLIC_MEASUREMENT_ID, {
			page_path: url,
		});
	}
};

export const eventGA = (action, params) => {
	if (window !== undefined) {
		window.gtag('event', action, params);
	}
};
