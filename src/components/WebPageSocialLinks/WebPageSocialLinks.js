import Image from 'next/image';
import Link from 'next/link';

import { Box, Flex } from '@chakra-ui/react';

import getIcon from 'src/functions/utils/getIcon';

const WebPageSocialLinks = ({ socialLinks, socialLinksType = 'colour', flexDir = 'column' }) => {
	return (
		<>
			{socialLinks?.length > 0 && (
				<Flex as='ul' flexDir={flexDir} align='center' p='16px' gap='12px' justify='center'>
					{socialLinks.map(el => {
						const icon = getIcon(el.link);
						const src = icon[socialLinksType];
						return (
							<Box as='li' key={el.id}>
								<Link target='_blank' href={el.link} style={{ height: '32px', width: '32px' }}>
									<Image src={src} alt={`${icon.title} icon`} width={32} height={32} />
								</Link>
							</Box>
						);
					})}
				</Flex>
			)}
		</>
	);
};

export default WebPageSocialLinks;
