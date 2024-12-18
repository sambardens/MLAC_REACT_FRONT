import Image from 'next/image';

import { Box, Flex, Heading, Icon, IconButton, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getFormattedDate from 'src/functions/utils/getFormattedDate';
import { setReleaseScreen } from 'store/slice';

import ContainerLoader from '@/components/Loaders/ContainerLoader';
import UserAvatar from '@/components/User/UserAvatar';

import EditIcon from '@/assets/icons/base/edit.svg';
import MoreIcon from '@/assets/icons/base/more.svg';

import AudioPlayer from '../AudioPlayer/AudioPlayer';

const ReleaseReview = () => {
	const { selectedRelease, selectedBap } = useSelector(state => state.user);
	const [dropMenu, setDropMenu] = useState(false);
	const dispatch = useDispatch();
	const tracks = selectedRelease?.checkedTracks?.filter(el => !el.error);

	return (
		<Flex p='24px' bg='bg.main' borderRadius='10px' h='100%' flexDir='column' w='100%'>
			{tracks && selectedRelease?.writers ? (
				<>
					<Flex justify='space-between' pos='relative' w='100%' mb='32px'>
						<Box>
							<Heading as='h2' fontWeight='600' fontSize='32px' color='black' mb='8px'>
								{selectedRelease?.name}
							</Heading>
							<Flex>
								<Text fontWeight='400' fontSize='14px' mr='8px' color='secondary'>
									{selectedRelease?.type}
								</Text>
								<Text fontWeight='400' fontSize='14px' mr='8px' color='secondary'>
									{getFormattedDate(selectedRelease?.releaseDate)}
								</Text>
							</Flex>
						</Box>

						{(selectedBap?.isCreator || selectedBap?.isFullAdmin) && (
							// <>
							//   <IconButton
							//     icon={<MoreIcon />}
							//     w='24px'
							//     height='40px'
							//     onClick={() => {
							//       setDropMenu(!dropMenu);
							//     }}
							//     color={dropMenu ? 'accent' : 'secondary'}
							//     _hover={{ color: 'accent' }}
							//     transition='0.3s linear'
							//   />

							//   {dropMenu && (
							<Flex
								py='8px'
								px='12px'
								as='button'
								cursor='pointer'
								onClick={() => {
									dispatch(setReleaseScreen('main'));
								}}
								color='secondary'
								_hover={{ color: 'accent' }}
								transition='0.3s linear'
							>
								<Icon as={EditIcon} mr='8px' boxSize='24px' />
								<Text fontWeight='500' fontSize='16px'>
									Edit
								</Text>
							</Flex>
							//   )}
							// </>
						)}
					</Flex>
					<Flex>
						<Box maxW='475px' flexDir='column'>
							<Box
								borderRadius='10px'
								overflow='hidden'
								w='100%'
								mb='24px'
								bgColor='stroke'
								display='block'
								minH='200px'
								pos='relative'
							>
								{selectedRelease?.logo ? (
									<Image
										priority={true}
										alt='Release logo'
										src={selectedRelease?.logo}
										width={475}
										height={475}
										object-fit='cover'
										quality={100}
									/>
								) : (
									<Text
										pos='absolute'
										top='50%'
										right='50%'
										transform={'translate(50%, -50%)'}
										fontWeight='500'
										fontSize='32px'
										color='secondary'
									>
										No logo
									</Text>
								)}
							</Box>
							{tracks?.length > 0 ? (
								<Flex as='ul' gap='8px' flexDir='column'>
									{tracks?.map(track => (
										<Box as='li' p='16px' bg='bg.light' borderRadius='10px' w='100%' key={track?.id}>
											<Text fontWeight='400' fontSize='16px' color='black' mb='8px'>
												{track.name}
											</Text>
											<AudioPlayer trackLink={track.trackFull} />
										</Box>
									))}
								</Flex>
							) : (
								<Text color='black' fontSize='18px' fontWeight='600'>
									There are no tracks in this release
								</Text>
							)}
						</Box>
						<Box w='50%' ml='24px' minW='250px'>
							<Heading as='h4' fontWeight='500' fontSize='16px' color='black' lineHeight='1.5' mb='8px'>
								Co-writers
							</Heading>
							{selectedRelease?.writers?.length === 0 && (
								<Text color='black' fontSize='18px' fontWeight='500'>
									There are no co-writers in this release or information is not specified
								</Text>
							)}
							{selectedRelease?.writers?.length > 0 && (
								<Flex p='12px' gap='8px' as='ul' flexDir='column'>
									{selectedRelease?.writers.map(writer => (
										<Flex w='100%' align='center' justify='space-between' key={writer.name}>
											<Flex align='center'>
												<UserAvatar user={writer} size='80px' fontSize='18px' />
												<Text ml='16px' fontSize='14px' fontWeight='400'>
													{writer.name}
												</Text>
											</Flex>
										</Flex>
									))}
								</Flex>
							)}
						</Box>
					</Flex>
				</>
			) : (
				<ContainerLoader />
			)}
		</Flex>
	);
};

export default ReleaseReview;
