import { saveAs } from 'file-saver';
import JSZip from 'jszip';

async function createZipAndDownload({ tracks, name, artwork }) {
	if (tracks.length === 1) {
		const url = tracks[0]?.trackFull;
		const trackName = `${tracks[0]?.name}.mp3`;
		saveAs(url, trackName);
	}
	if (tracks.length > 1) {
		const zip = new JSZip();
		const promises = tracks.map(async track => {
			const trackName = `${track?.name}.mp3`;
			const url = track?.trackFull;
			const response = await fetch(url);
			const blob = await response.blob();
			zip.file(trackName, blob);
		});
		await Promise.all(promises);
		if (artwork) {
			const artworkBlob = await fetch(artwork).then(response => response.blob());
			zip.file(`${name}.jpg`, artworkBlob);
		}
		const zipBlob = await zip.generateAsync({ type: 'blob' });
		saveAs(zipBlob, `${name}.zip`);
	}
}

export default createZipAndDownload;
