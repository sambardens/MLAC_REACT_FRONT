import Link from 'next/link';

import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getLandingSocialIconAsComponent from 'src/functions/utils/web-pages/landing/getLandingSocialIconAsComponent';
import getLandingSocialLinkTitle from 'src/functions/utils/web-pages/landing/getLandingSocialLinkTitle';

const LandingLinksList = ({ titleDesign, additionalDesign }) => {
	const { landingInfo } = useSelector(state => state.landing);
	const { streamingLinks } = landingInfo;

	return (
		<>
			{streamingLinks?.length > 0 && (
				<Flex bg='bg.gray' borderRadius='10px' w='100%' justify='center' mb='88px'>
					<Flex as='ul' display='inline-block' flexDir='column' align='center'>
						{streamingLinks.map(el => {
							return (
								<Link key={el.id} target='_blank' href={el.link} width='100%' rel='noopener noreferrer'>
									<Flex
										p='12px'
										align='center'
										w='100%'
										color={titleDesign.hex}
										_hover={{ color: 'accent' }}
										transition='0.3s linear'
									>
										<IconButton icon={getLandingSocialIconAsComponent(el.link)} size='32px' />
										<Text
											ml='16px'
											fontFamily={additionalDesign.font}
											fontWeight={additionalDesign.weight}
											fontSize={additionalDesign.size}
											fontStyle={additionalDesign.italic ? 'italic' : 'initial'}
										>
											{getLandingSocialLinkTitle(el.link)}
										</Text>
									</Flex>
								</Link>
							);
						})}
					</Flex>
				</Flex>
			)}
		</>
	);
};
export default LandingLinksList;
