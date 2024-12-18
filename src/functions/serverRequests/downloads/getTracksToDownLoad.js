import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { checkFileTypeAndRename } from 'src/functions/utils/checkFileTypeAndRename';
import { eventGA } from 'src/functions/utils/googleAnalytics/ga';
import { instance } from 'store/operations';

export const getFullAudioTrack = async (track, isFree) => {
	try {
		const { data } = await instance.post(
			`/api/tracks/free/download?trackId=${track.id}`,
			{ isFree },
			{
				responseType: 'blob',
			},
		);
		if (data) {
			return { file: data, name: track.name, success: true };
		} else {
			return { success: false };
		}
	} catch (error) {
		console.log('downLoadTrack error: ', error);
	}
};

export const downloadOneTrack = async ({ trackData, isFree = false, bapId = 0 }) => {
	const track = await getFullAudioTrack(trackData, isFree);
	if (track?.success && track?.file && track?.name) {
		eventGA('download', {
			event_category: bapId,
			event_label: track?.name,
			value: 1, // Отправляем количество треков
		});
		const fileName = checkFileTypeAndRename({ name: track.name, type: track.file?.type });
		const blob = new Blob([track.file], { type: track.file?.type || 'audio/mpeg' });
		const url = window.URL.createObjectURL(blob);

		console.log('fileName: ', fileName);
		saveAs(url, fileName);
		return { success: true };
	}
};

export const downloadListOfTracks = async ({
	tracks,
	folderName = 'tracks',
	artwork,
	artworkName,
	isFree = false,
	bapId = 0,
}) => {
	const zip = new JSZip();

	const downloadedTracks = await Promise.all(
		tracks.map(async track => await getFullAudioTrack(track, isFree)),
	);
	const successDownloadTracks = downloadedTracks.filter(el => el?.success);
	if (successDownloadTracks.length >= 1) {
		eventGA('download', {
			event_category: bapId,
			event_label: 'Full release',
			value: successDownloadTracks.length,
		});

		successDownloadTracks.forEach(track => {
			if (track?.success && track?.file && track?.name) {
				const blob = new Blob([track.file], { type: track.file?.type || 'audio/mpeg' });
				const fileName = checkFileTypeAndRename({ name: track.name, type: track.file?.type });
				zip.file(fileName, blob);
			}
		});
		if (artwork) {
			const artworkBlob = await fetch(artwork).then(response => response.blob());
			zip.file(`${artworkName}.jpg`, artworkBlob);
		}

		const zipBlob = await zip.generateAsync({ type: 'blob' });
		saveAs(zipBlob, `${folderName}.zip`);
		return { success: true };
	}
	return { success: false };
};
