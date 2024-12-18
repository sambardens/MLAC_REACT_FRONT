import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { maxAllowedSizeError, maxWidthAndHeightError } from 'src/functions/utils/validateImg';

import UploadIcon from '@/assets/icons/base/upload.svg';

const UploadImage = ({
	setImageSrc,
	setImageFile,
	w = '301px',
	h = '130px',
	title = 'Upload existing image',
	checkSize = false,
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

	const handleFileSelect = async e => {
		const { files } = e.target;

		if (files && files[0]) {
			if (files.length === 0) return;

			const logo = files[0];

			if (!['image/jpeg', 'image/jpg', 'image/png'].includes(logo.type)) {
				getToast('error', 'Wrong file format', 'We only accept Jpg, Jpeg or Png files.');
				return;
			}

			if (checkSize && (await maxWidthAndHeightError(logo))) {
				getToast(
					'error',
					'Image size error.',
					'Your artwork image must be square. The size must be between 1400px and 4000px.',
				);
				return;
			}

			if (checkSize && (await maxAllowedSizeError(logo))) {
				getToast('error', 'Image size error.', 'File size should be between 100KB and 10 MB');

				return;
			}

			setImageFile(logo);
			const imageSrc = URL.createObjectURL(logo);
			setImageSrc(imageSrc);
		}
	};

	const handleButtonClick = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/jpeg,image/jpg,image/png';
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

export default UploadImage;
