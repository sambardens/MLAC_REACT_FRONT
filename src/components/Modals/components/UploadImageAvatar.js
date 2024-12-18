import { Box, Button, Flex, Icon, Image, Text, useToast } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { deleteUserAvatar } from 'store/operations';

// import { maxWidthAndHeightError } from 'src/functions/utils/validateImg';
import TrashIcon from '@/assets/icons/modal/trash.svg';
import CameraIcon from '@/assets/icons/profile_module/camera.svg';

const UploadImageAvatar = ({ imageSrc, setImageSrc, setImageFile, mt, firstVisit }) => {
	const toast = useToast();
	const dispatch = useDispatch();
	const handleFileSelect = async e => {
		const { files } = e.target;

		if (files && files[0]) {
			if (files.length === 0) return;

			const logo = files[0];
			setImageFile(logo);

			// if (await maxWidthAndHeightError(logo, 60, 60)) {
			// 	toast({
			// 		position: 'top',
			// 		title: 'Avatar is not a square.',
			// 		description: 'Avatar has been changed to square',
			// 		status: 'info',
			// 		duration: 8000,
			// 		isClosable: true,
			// 	});
			// }
			const selectedImageSrc = URL.createObjectURL(logo);
			setImageSrc(selectedImageSrc);
		}
	};

	const handleAddAvatar = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/jpeg,image/png,image/jpg';
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	const handleDeleteAvatar = () => {
		setImageFile(null);
		setImageSrc(null);
		if (firstVisit) {
			dispatch(deleteUserAvatar());
		}
	};

	const handleOnError = e => {
		if (e.target.src.includes('thumb_')) {
			const newImageSrc = e.target.src.replace('thumb_', '');
			setImageSrc(newImageSrc);
		} else {
			setImageSrc('');
		}
	};

	return (
		<Flex alignItems={'center'} mt={mt} pt='1px'>
			{imageSrc ? (
				<Flex alignItems={'center'} gap='16px'>
					<Box
						w={firstVisit ? '80px' : '120px'}
						h={firstVisit ? '80px' : '120px'}
						pos='relative'
						borderRadius='14px'
						overflow='hidden'
					>
						<Image
							src={imageSrc}
							alt='User avatar'
							objectFit='cover'
							w={firstVisit ? 80 : 120}
							h={firstVisit ? 80 : 120}
							maxH={firstVisit ? '80px' : '120px'}
							onError={e => {
								handleOnError(e);
							}}
						/>
					</Box>
					<Button
						onClick={handleAddAvatar}
						height={firstVisit ? '80px' : '120px'}
						width={firstVisit ? '80px' : '120px'}
						variant='ghost'
						borderRadius='10px'
						display='flex'
						flexDir='column'
						_hover={{ boxShadow: '1px 1px 3px 1px Gray' }}
						type='button'
						bgColor='bg.light'
					>
						<Icon as={CameraIcon} boxSize='24px' color='secondary' />
						{!firstVisit && (
							<Text fontSize='16px' fontWeight='400' mt='8px'>
								Change photo
							</Text>
						)}
					</Button>

					<Button
						onClick={handleDeleteAvatar}
						height={firstVisit ? '80px' : '120px'}
						width={firstVisit ? '80px' : '120px'}
						variant='ghost'
						borderRadius='10px'
						display='flex'
						flexDir='column'
						bgColor='bg.light'
						_hover={{ boxShadow: '1px 1px 3px 1px Gray' }}
						type='button'
					>
						<Icon as={TrashIcon} boxSize='24px' color='secondary' />
						{!firstVisit && (
							<Text fontSize='16px' fontWeight='400' mt='8px'>
								Delete photo
							</Text>
						)}
					</Button>
				</Flex>
			) : (
				<Button
					height={firstVisit ? '80px' : '120px'}
					variant='ghost'
					p='0'
					onClick={handleAddAvatar}
					type='button'
				>
					<Flex
						align='center'
						justify='center'
						bgColor='#F19CB6'
						w={firstVisit ? '80px' : '120px'}
						height={firstVisit ? '80px' : '120px'}
						borderRadius='14px'
					>
						<Icon as={CameraIcon} boxSize='24px' color='white' />
					</Flex>

					<Text ml='16px' fontSize={'16px'} fontWeight={'400'}>
						Add photo
					</Text>
				</Button>
			)}
		</Flex>
	);
};

export default UploadImageAvatar;
