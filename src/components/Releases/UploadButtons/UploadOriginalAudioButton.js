import { useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getTracksAuddSpotifyLinks from 'src/functions/serverRequests/track/getTracksAuddSpotifyLinks';
import getReleaseTypeAndGenres from 'src/functions/utils/release/getReleaseTypeAndGenres';
import {
	createReleaseByOriginalAudio,
	handleEditRelease,
	saveReleaseLinks,
} from 'store/operations';
import { transliterate as tr } from 'transliteration';

import NextButton from '@/components/Buttons/NextButton/NextButton';

const UploadOriginalAudioButton = ({ handleNewRelease }) => {
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();
	const { selectedBap } = useSelector(state => state.user);
	const { mainGenres } = useSelector(state => state.genres);
	const dispatch = useDispatch();
	const getToast = (title, text, status) => {
		toast({
			position: 'top',
			title,
			description: text || '',
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	const handleFileSelect = async e => {
		setIsLoading(true);
		const { files } = e.target;
		if (files && files.length > 0) {
			const audioFile = files[0];
			if (!['audio/mp3', 'audio/wav', 'audio/flac', 'audio/mpeg'].includes(audioFile.type)) {
				getToast(
					`Track ${audioFile.name}`,
					'Wrong file format. We only accept Mp3, Wav or FLAC files.',
					'error',
				);
				setIsLoading(false);
				return;
			}
			const formData = new FormData();
			const normalizeFileName = tr(audioFile.name).replace(/\s/g, '');
			formData.append('track', audioFile);
			formData.append('name', normalizeFileName);
			formData.append('bapId', selectedBap.bapId);
			formData.append('bapSpotifyId', selectedBap.spotifyId || '');
			// formData.append('position', 1);
			const res = await dispatch(
				createReleaseByOriginalAudio({
					formData,
					bapName: selectedBap.bapName,
					bapSpotifyId: selectedBap.spotifyId,
				}),
			);
			if (res?.payload?.success) {
				const releaseId = res?.payload?.release?.id;
				const additionalInfo = res?.payload?.additionalInfo;
				const releaseSpotifyId = res?.payload?.release?.releaseSpotifyId;

				const isDuplicate = selectedBap?.releases?.find(el => el.releaseSpotifyId === releaseSpotifyId);
				if (isDuplicate) {
					getToast('Attention', 'You already have same release', 'info');
				}
				if (additionalInfo && releaseId) {
					const { genresRequestBody, genresData, type } = getReleaseTypeAndGenres({
						albumType: additionalInfo?.albumType,
						genreNames: additionalInfo?.genreNames,
						mainGenres,
					});

					dispatch(
						handleEditRelease({
							releaseId,
							releaseData: { ...genresRequestBody, type },
							genresData,
						}),
					);
				}

				const allTracksStreamingLinks = await getTracksAuddSpotifyLinks(releaseSpotifyId, axiosPrivate);
				dispatch(
					saveReleaseLinks({
						releaseSpotifyId,
						allTracksStreamingLinks,
					}),
				);
				handleNewRelease();
			} else {
				const text =
					res?.payload?.error === 'This track is copyright by another artist'
						? res?.payload?.error
						: `No info about track ${audioFile.name} at AUDD`;
				getToast(text, 'Try upload another track', 'error');
			}
		}
		setIsLoading(false);
	};

	const handleButtonClick = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'audio/mpeg,audio/wav,audio/flac';
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	return (
		<NextButton
			onClickHandler={handleButtonClick}
			isSubmiting={isLoading}
			styles={selectedBap?.spotifyId ? 'main' : 'disabled'}
		/>
	);
};

export default UploadOriginalAudioButton;
