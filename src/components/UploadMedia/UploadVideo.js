import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import UploadIcon from '@/assets/icons/base/upload.svg';

const UploadVideo = ({
	setVideoSrc,
	setVideoFile,
	w = '301px',
	h = '130px',
	title = 'Upload existing artwork',
}) => {
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

		if (files && files[0]) {
			if (files.length === 0) return;

			const video = files[0];

			setVideoFile(video);

			if (!['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(video.type)) {
				getToast('error', 'Wrong file format', 'We only accept mp4, mov or avi files.');
				return;
			}

			const videoSrc = URL.createObjectURL(video);
			setVideoSrc(videoSrc);
			console.log(videoSrc, 'videoSrc');
		}
	};

	const handleButtonClick = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'video/mp4,video/quicktime,video/x-msvideo';
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	return (
		<Flex
			as='button'
			w={w}
			h={h}
			py='16px'
			bg='bg.secondary'
			align='center'
			justify='center'
			borderRadius='10px'
			cursor='pointer'
			onClick={handleButtonClick}
		>
			<Flex justify='center' align='center' flexDir='column'>
				<Icon as={UploadIcon} color='secondary' boxSize='40px' />
				<Text mt='16px' fontSize='14px' fontWeight='400' color='secondary' maxW='139px'>
					{title}
				</Text>
			</Flex>
		</Flex>
	);
};

export default UploadVideo;
