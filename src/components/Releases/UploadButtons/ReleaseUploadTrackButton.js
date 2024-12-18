import { Icon, useToast } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import { transliterate as tr } from 'transliteration';

import CustomButton from '@/components/Buttons/CustomButton';

import UploadIcon from '@/assets/icons/base/upload-small.svg';

function ReleaseUploadTrackButton({
	setTrackFormData,
	setTracksOnLoading,
	remainingTracks = 0,
	lastPosition,
}) {
	const { selectedBap, selectedRelease } = useSelector(state => state.user);
	const toast = useToast();
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};

	const handleFileSelect = e => {
		const { files } = e.target;
		if (files && files.length > 0) {
			if (remainingTracks && files.length > remainingTracks) {
				getToast(
					'error',
					'Error',
					`You want to upload ${files.length} track(s), there are only ${remainingTracks} track(s) left to upload for this release`,
				);
				return;
			}
			// Проходимся по списку выбранных файлов
			Array.from(files).forEach((file, index) => {
				// Проверка на допустимые форматы
				if (!['audio/mp3', 'audio/wav', 'audio/wave', 'audio/flac', 'audio/mpeg'].includes(file.type)) {
					getToast(
						'error',
						`Track ${file.name}.`,
						'Wrong file format. We only accept Mp3, Wav or FLAC files.',
					);
					return;
				}
				const formData = new FormData();
				let normalizeFileName = tr(file.name);
				const fileNameArr = normalizeFileName.split('.');
				if (fileNameArr.length > 1) {
					fileNameArr.pop();
					normalizeFileName = fileNameArr.join(' ');
				}
				formData.append('name', normalizeFileName);
				!selectedRelease.releaseSpotifyId &&
					formData.append('position', parseInt(lastPosition + index));
				formData.append('track', file);
				formData.append('bapSpotifyId', selectedBap?.spotifyId || '');

				setTrackFormData(prev => [...prev, { formData, trackName: normalizeFileName }]);
				setTracksOnLoading(prev => [...prev, { trackName: normalizeFileName, progress: 0 }]);
			});
		}
	};

	const isSingle =
		selectedRelease.isReleaseByOriginalAudio && selectedRelease.checkedTracks.length === 0;
	const handleButtonClick = () => {
		const forbidUpload =
			selectedRelease.isReleaseByOriginalAudio &&
			selectedRelease.checkedTracks.length === 1 &&
			selectedRelease.checkedTracks[0].error;
		if (forbidUpload) {
			getToast('error', 'Error', 'At first you need to change track/version');
			return;
		}

		const isSellLanding = selectedRelease.landingPages?.find(el => el.webpagesTypeId === 2);
		const isShop =
			selectedBap?.shops?.length === 1 &&
			selectedBap?.shops[0]?.releaseIds?.find(id => id === selectedRelease.id);

		if (isSellLanding || isShop) {
			getToast(
				'error',
				'Error',
				"You can't upload tracks if you already have a landing page or shop with this release.",
			);
			return;
		}
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'audio/mpeg,audio/wav,audio/flac';

		fileInput.multiple = !isSingle;

		fileInput.onfocus = setTrackFormData([]);
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	return (
		<CustomButton styles={'light-red'} w='184px' minW='184px' onClickHandler={handleButtonClick}>
			<Icon as={UploadIcon} mr='8px' w='24px' h='24px' color='accent' />
			Upload track
		</CustomButton>
	);
}

export default ReleaseUploadTrackButton;
