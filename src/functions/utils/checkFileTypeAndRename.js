export const checkFileTypeAndRename = ({ name, type }) => {
	let fileName = name;
	const fileNameArr = fileName.split('.');
	if (fileNameArr.length > 1) {
		fileNameArr.pop();
		fileName = fileNameArr.join(' ');
	}
	if (type === 'audio/mpeg') {
		fileName = name + '.mp3';
	} else if (type === 'audio/wav' || type === 'audio/wave') {
		fileName = name + '.wav';
	} else if (type === "'audio/flac") {
		fileName = name + '.flac';
	}

	return fileName;
};
