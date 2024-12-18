import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import UploadVideo from '@/components/UploadMedia/UploadVideo';
import Cross from '@/components/VisualElements/Cross';

const UploadVideoContainerShop = ({
	title,
	text,
	mt,
	setVideoSrc,
	setVideoFile,
	handleCrossClick,
	isCross,
}) => {
	return (
		<Box mt={mt}>
			<Flex justify='space-between' align='center' mb='16px'>
				<Box mr='12px'>
					<Heading as='h2' mb='4px' fontSize='18px' fontWeight='500' lineHeight='1.5'>
						{title}
					</Heading>
					<Text fontSize='14px' fontWeight='400' color='secondary'>
						{text}
					</Text>
				</Box>
				{isCross && <Cross onCrossClick={handleCrossClick} />}
			</Flex>
			<UploadVideo
				setVideoSrc={setVideoSrc}
				setVideoFile={setVideoFile}
				title={`Upload existing ${title?.toLowerCase()}`}
				w='50%'
			/>
		</Box>
	);
};

export default UploadVideoContainerShop;
