import { Box, Flex, Image, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { downloadsSelectors } from 'store/downloads';
import { setCurrentArtist, setCurrentRelease } from 'store/downloads/downloads-slice';

import ArtistAndBandSkeleton from './skeletons/ArtistAndBandSkeleton';
import { poppins_600_18_27, poppins_600_32_48 } from '@/styles/fontStyles';

export const ArtistAndBands = () => {
	const dispatch = useDispatch();
	const orderArtists = useSelector(downloadsSelectors.getOrderArtists);
	const currentArtist = useSelector(downloadsSelectors.getCurrentArtist);
	const isLoadingData = useSelector(downloadsSelectors.getIsLoading);

	const handleOnError = e => {
		e.target.src = '/assets/images/mockImg/rectangle_3.jpg';
	};

	return (
		<Box as={'section'} p='24px' h='100%'>
			<Text sx={poppins_600_32_48} color={'textColor.black'}>
				Artists & Band
			</Text>

			{isLoadingData && <ArtistAndBandSkeleton />}

			<UnorderedList
				display={'flex'}
				flexDir={'column'}
				w={'100%'}
				m={'0px'}
				mt={'32px'}
				h='calc(100% - 100px)'
				overflowY={'hidden'}
				_hover={{ overflowY: 'overlay' }}
			>
				{orderArtists?.map(itemArtist => {
					return (
						<ListItem
							key={itemArtist?.artistId}
							listStyleType={'none'}
							w={'100%'}
							onClick={() => {
								dispatch(
									setCurrentArtist(currentArtist?.artistId === itemArtist?.artistId ? null : itemArtist),
								);
								dispatch(setCurrentRelease(null));
							}}
							p={'8px'}
							borderRadius={'10px'}
							bgColor={itemArtist?.artistId === currentArtist?.artistId ? 'bg.pink' : 'transparent'}
							cursor={'pointer'}
						>
							<Flex alignItems={'center'} w={'100%'}>
								<Image
									src={itemArtist?.artistAvatar}
									alt={'img'}
									width={'80px'}
									h={'80px'}
									borderRadius={'10px'}
									objectFit={'cover'}
									onError={e => handleOnError(e)}
								/>
								<Tooltip
									hasArrow
									label={itemArtist?.artistName?.length > 27 && itemArtist?.artistName}
									placement='auto'
									bg='bg.black'
									color='textColor.white'
									fontSize='16px'
									borderRadius={'5px'}
								>
									<Text
										sx={poppins_600_18_27}
										color={
											itemArtist?.artistId === currentArtist?.artistId ? 'textColor.red' : 'textColor.black'
										}
										ml={'24px'}
										overflow={'hidden'}
										textOverflow={'ellipsis'}
										width={'270px'}
										whiteSpace='nowrap'
									>
										{itemArtist?.artistName}
									</Text>
								</Tooltip>
							</Flex>
						</ListItem>
					);
				})}
			</UnorderedList>
		</Box>
	);
};
