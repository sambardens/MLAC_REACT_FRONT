import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';

import CustomButton from '../../Buttons/CustomButton';

import { poppins_400_14_21, poppins_400_16_24, poppins_500_18_27 } from '@/styles/fontStyles';

const ArtistCard = ({
	artist,
	setSelectedArtist,
	closeArtistsList,
	searchArrLength,
	searchValue,
	mb,
	imgWidth = '80px',
	imgHeight = '80px',
	confirmSync = false,
	height = ' 96px',
}) => {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		if (artist.images[0]) {
			setImageUrl(artist.images[0].url);
		}
	}, [artist]);

	const addArtistHandler = async () => {
		setSelectedArtist(artist);
		closeArtistsList();
	};
	const tooltipText = 'This Spotify profile has already been claimed by a Major Labl user.';
	const tooltipLabel =
		'Please contact them for an invite. To dispute this claim please email hello@majorlabl.com';
	return (
		<Flex
			w='100%'
			mb={mb}
			h={height}
			p={confirmSync ? '0px' : '8px'}
			alignItems={'center'}
			justifyContent='space-between'
			bg={searchArrLength === 1 && searchValue ? 'bg.secondary' : 'transparent'}
			borderRadius={'10px'}
		>
			<Flex>
				{imageUrl ? (
					<Image
						src={`${imageUrl}`}
						alt='spotify icon'
						width={imgWidth}
						height={imgHeight}
						borderRadius={'4px'}
					/>
				) : (
					<Box width={imgWidth} height={imgHeight} borderRadius={'4px'} bg='bg.gray'></Box>
				)}

				<Flex flexDir={'column'} ml={confirmSync ? '16px' : '18px'} justifyContent='center'>
					<Tooltip
						hasArrow
						label={artist?.name?.length > 30 && artist.name}
						placement='top'
						bg='bg.black'
						color='textColor.white'
						fontSize='16px'
						borderRadius={'5px'}
					>
						<Text
							maxWidth={'300px'}
							overflow={'hidden'}
							textOverflow={'ellipsis'}
							whiteSpace='nowrap'
							mb='8px'
							sx={confirmSync ? poppins_500_18_27 : poppins_400_16_24}
							color={'textColor.black'}
						>
							{artist.name}
						</Text>
					</Tooltip>
					<Text
						color={'textColor.gray'}
						sx={poppins_400_14_21}
					>{`${artist.followers.total} Followers`}</Text>
				</Flex>
			</Flex>

			{!confirmSync && (
				<>
					{artist.isSynced ? (
						<Tooltip
							hasArrow
							label={tooltipLabel}
							placement='top'
							bg='bg.black'
							color='textColor.white'
							fontSize='16px'
							borderRadius={'5px'}
						>
							<Text
								maxWidth='215px'
								overflow={'hidden'}
								textOverflow={'ellipsis'}
								whiteSpace='normal'
								sx={confirmSync ? poppins_500_18_27 : poppins_400_16_24}
								color={'textColor.black'}
							>
								{tooltipText}
							</Text>
						</Tooltip>
					) : (
						<CustomButton onClickHandler={addArtistHandler} w={'150px'} h={'40px'}>
							Sync
						</CustomButton>
					)}
				</>
			)}
		</Flex>
	);
};

export default ArtistCard;
