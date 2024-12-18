import { Box, Flex, Image, Link } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getIcon from 'src/functions/utils/getIcon';
import { eventGA } from 'src/functions/utils/googleAnalytics/ga';

const StreamingLandingSreenContent = ({ borderColor, streamingLinks, mb = 0 }) => {
	const { landingInfo } = useSelector(state => state.landing);
	const handleOpenStream = icon => {
		eventGA('streaming', {
			event_category: landingInfo.bapId,
			event_label: icon.title,
			transport_type: 'beacon',
		});
		if (
			landingInfo?.facebookPixel &&
			typeof window !== 'undefined' &&
			typeof window?.fbq === 'function'
		) {
			window.fbq('track', 'ViewContent');
		}
	};
	return (
		<>
			{streamingLinks?.length > 0 && (
				<Flex
					as='ul'
					flexDir='column'
					gap='4px'
					ml='0'
					align='center'
					mt='4px'
					w='100%'
					justify='center'
					mb={mb}
				>
					{streamingLinks.map(el => {
						const icon = getIcon(el.link);
						return (
							<Box
								key={el.id}
								as='li'
								bg='bg.gray'
								w='100%'
								borderRadius='10px'
								border='2px solid'
								borderColor='transparent'
								_hover={{ borderColor }}
								onClick={() => handleOpenStream(icon)}
								h='59px'
							>
								<Link
									target='_blank'
									href={el.link}
									height='100%'
									display='flex'
									alignItems='center'
									justify='center'
								>
									<Image
										src={icon.banner}
										alt={`${icon.title} icon`}
										fit='contain'
										height='35px'
										w='100%'
										// style={{ objectFit: 'contain' }}
									/>
								</Link>
							</Box>
						);
					})}
				</Flex>
			)}
		</>
	);
};

export default StreamingLandingSreenContent;
