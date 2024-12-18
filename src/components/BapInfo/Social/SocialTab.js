import Image from 'next/image';
import Link from 'next/link';

import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getIcon from 'src/functions/utils/getIcon';
import { linksSelectors } from 'store/links';

import { poppins_400_16_24, poppins_600_18_27 } from '@/styles/fontStyles';

export const SocialTab = () => {
	const socialLinks = useSelector(linksSelectors.getSocialLinks);

	return (
		<Flex flexDir={'column'} h={'100%'} overflow={'auto'} mt={'24px'} mr='24px' ml='16px'>
			<Text color={'textColor.black'} sx={poppins_600_18_27} mb='20px'>
				Social media
			</Text>
			<Flex gap='24px'>
				<UnorderedList
					m={'0'}
					gap={'16px'}
					display={'flex'}
					flexDir={'column'}
					listStyleType={'none'}
					w='100%'
				>
					{socialLinks?.length !== 0 &&
						socialLinks?.map(item => {
							const icon = getIcon(item.social);
							return (
								<ListItem key={item.id} listStyleType={'none'} w={'100%'}>
									<Link href={item?.social} target='_blank' rel='noopener noreferrer'>
										<Flex
											alignItems={'center'}
											_hover={{
												textDecoration: 'underline',
												textUnderlineOffset: '5px',
												color: 'textColor.red',
											}}
											w={'100%'}
											role='group'
										>
											<Box w='32px' h='32px'>
												<Image src={icon.colour} alt={`${icon.title} icon`} width={32} height={32} />
											</Box>

											{/* <Tooltip
												hasArrow
												label={item?.social?.length > 53 && item?.social}
												placement='auto'
												bg='bg.black'
												color='textColor.white'
												fontSize='16px'
												borderRadius={'5px'}
											> */}
											<Text
												// maxWidth={'500px'}
												overflow={'hidden'}
												textOverflow={'ellipsis'}
												whiteSpace='nowrap'
												color={'textColor.black'}
												sx={poppins_400_16_24}
												ml={'12px'}
												_groupHover={{ color: 'accent' }}
											>
												{item?.social}
											</Text>
											{/* </Tooltip> */}
										</Flex>
									</Link>
								</ListItem>
							);
						})}
					{socialLinks?.length === 0 && <Text>Social links not added</Text>}
				</UnorderedList>
			</Flex>
		</Flex>
	);
};
