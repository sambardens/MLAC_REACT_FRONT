const getSignatureImage = async ({ signatureUrl }, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const res = await axiosPrivate.get(`/api/contracts/${signatureUrl}`, {
			signal: controller.signal,
			responseType: 'arraybuffer',
		});

		const data = Buffer.from(res.data, 'binary');
		const contentType = res.headers['content-type'];
		const blob = new Blob([data], { type: contentType });
		return URL.createObjectURL(blob);
	} catch (error) {
		console.log('getSignatureImage error: ', error);
	}
};

export default getSignatureImage;
