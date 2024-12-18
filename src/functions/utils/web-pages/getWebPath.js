const getWebPath = (webType, webpagesTypeId) => {
    let path;
	if (webType === 'landing') {
		if (webpagesTypeId === 1) {
			path = 'edit-download-landing';
		} else if (webpagesTypeId === 2) {
			path = 'edit-sell-landing';
		} else if (webpagesTypeId === 3) {
			path = 'edit-streaming-landing';
		}
	} else {

    }
    return path
};

export default getWebPath;
