export const downloadTrack = (url, nameTrack) => {
	const link = document.createElement('a');
	link.href = url;
	link.download = nameTrack;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
