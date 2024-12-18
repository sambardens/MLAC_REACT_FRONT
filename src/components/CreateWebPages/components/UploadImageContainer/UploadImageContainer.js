import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import Canva from '@/components/Canva/Canva';
import UploadImage from '@/components/UploadMedia/UploadImage';
import Cross from '@/components/VisualElements/Cross';

const UploadImageContainer = ({
	title,
	text,
	setImageSrc,
	setImageFile,
	handleCanvaSrc,
	mt = '32px',
	faviconSrc,
	isFavicon = false,
	isCross,
	handleCrossClick,
	imgH = 1500,
	imgW = 1500,
}) => {
	return (
		<Box mt={mt}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box mb='16px' w='100%'>
					<Heading
						as='h2'
						mb={isFavicon ? '16px' : '4px'}
						fontSize='18px'
						fontWeight='500'
						lineHeight='1.5'
					>
						{title}
					</Heading>
					<Flex align={isFavicon ? 'center' : 'start'} justify='space-between' w='100%'>
						<Flex align='center'>
							{isFavicon && (
								<Box
									bg='bg.secondary'
									minW='64px'
									w='64px'
									h='64px'
									borderRadius='10px'
									overflow='hidden'
									mr='12px'
									bgImage={`url(${faviconSrc})`}
									bgPosition='center'
									bgSize={'100% 100%'}
								/>
							)}

							<Text fontSize='14px' fontWeight='400' color={'secondary'}>
								{text}
							</Text>
						</Flex>
						{isCross && <Cross onCrossClick={handleCrossClick} ml='12px' />}
					</Flex>
				</Box>
			</Flex>

			<Flex justify='space-between' align='center'>
				<Canva
					setImageSrc={handleCanvaSrc || setImageSrc}
					setImageFile={setImageFile}
					create={true}
					title={`Use Canva to design your ${title?.toLowerCase()}`}
					w='100%'
					imgH={imgH}
					imgW={imgW}
				/>
				<Flex justify='center' align='center' mx='16px'>
					<Text fontSize='14px' fontWeight='400' color='secondary'>
						or
					</Text>
				</Flex>
				<UploadImage
					setImageSrc={setImageSrc}
					setImageFile={setImageFile}
					title={`Upload existing ${title?.toLowerCase()}`}
					w='100%'
				/>
			</Flex>
		</Box>
	);
};

export default UploadImageContainer;
