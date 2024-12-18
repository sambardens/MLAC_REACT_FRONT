function getImageSrc(imageName, isNeedDefaultImage = true, white = false) {
	let src = null;

	if (imageName) {
		if (
			imageName.includes('https://i.scdn.co/') ||
			imageName.includes('https://export-download.canva') ||
			imageName.includes(`${process.env.NEXT_PUBLIC_URL}`) ||
			imageName.includes('https://lh3.googleusercontent.com') ||
			imageName.includes('https://platform-lookaside.fbsbx.com')
		) {
			src = imageName;
		} else {
			src = `${process.env.NEXT_PUBLIC_URL}/${imageName}`;
		}
	}

	if (!imageName) {
		if (isNeedDefaultImage) {
			// if (white) {
			// 	src = '/assets/images/logo-white.png';
			// } else {
			// 	src = '/assets/images/logo-primary.png';
			// }
			src = '/assets/images/logo-primary.png';
		}

		if (!isNeedDefaultImage) {
			src = '';
		}
	}

	return src;
}

export default getImageSrc;
