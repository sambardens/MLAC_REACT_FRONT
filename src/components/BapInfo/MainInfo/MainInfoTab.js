import { Box, Flex, Image, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import ContainerLoader from '@/components/Loaders/ContainerLoader';

import countries from '@/assets/countries.json';

import {
	poppins_400_16_24,
	poppins_500_18_27,
	poppins_600_18_27,
	poppins_600_32_48,
} from '@/styles/fontStyles';

export const MainInfoTab = () => {
	const { selectedBap, isLoading } = useSelector(state => state.user);
	const [genres, setGenres] = useState({
		mainGenre: '',
		secondaryGenre: '',
		subGenres: '',
		// subGenresMain: '',
		// subGenresSecondary: '',
	});

	const [boxHeight, setBoxHeight] = useState(0);
	const boxRef = useRef(null);

	useEffect(() => {
		const mainGenre = selectedBap?.genres?.mainGenre;
		const secondaryGenre = selectedBap?.genres?.secondaryGenre;
		const subGenres = selectedBap?.genres?.subGenres;
		// const getSubGenresList = mainGenreId => {
		// 	const subGenres = selectedBap?.genres?.subGenres;
		// 	if (subGenres?.length === 0 || !mainGenreId) return '';
		// 	const filteredSubGenres = subGenres.filter(el => el.mainGenreId === mainGenreId);
		// 	if (filteredSubGenres.length > 0) {
		// 		return filteredSubGenres.map(el => el.name).join(', ');
		// 	}
		// 	return '';
		// };
		const newGenres = {
			mainGenre: mainGenre?.name || '',
			secondaryGenre: secondaryGenre?.name || '',
			subGenres: subGenres?.length > 0 ? subGenres.map(el => el.name).join(', ') : '',
			// subGenresMain: getSubGenresList(mainGenre?.id),
			// subGenresSecondary: getSubGenresList(secondaryGenre?.id),
		};

		setGenres(newGenres);
	}, [selectedBap?.genres, selectedBap.bapId]);

	const { mainGenre, secondaryGenre, subGenres } = genres;

	useEffect(() => {
		const boxElement = boxRef.current;
		if (boxElement) {
			setBoxHeight(boxElement.clientWidth);
		}
	}, [selectedBap?.src]);

	const country = selectedBap?.country
		? countries.list.find(el => el.value === selectedBap.country)
		: '';

	return (
		<>
			{isLoading || !selectedBap?.bapId ? (
				<ContainerLoader />
			) : (
				<Flex gap='24px' justify='space-between'>
					<Box w='calc(55% - 12px)'>
						<Text as={'h2'} color='textColor.black' sx={poppins_600_32_48}>
							{selectedBap?.bapName}
						</Text>

						{selectedBap?.bapDescription?.trim() ? (
							<Text color='textColor.black' sx={poppins_400_16_24} mt='8px'>
								{selectedBap.bapDescription}
							</Text>
						) : (
							<Text color='textColor.gray' sx={poppins_400_16_24} mt='8px'>
								There are no description.
							</Text>
						)}

						{/* <Text as='h3' color='textColor.black' sx={poppins_600_18_27} mt={'32px'}>
							Artist biography
						</Text>

						{selectedBap?.bapArtistBio?.trim() ? (
							<Text color='textColor.black' sx={poppins_400_16_24} mt='8px'>
								{selectedBap?.bapArtistBio}
							</Text>
						) : (
							<Text color='textColor.gray' sx={poppins_400_16_24} mt='8px'>
								There are no artist biography.
							</Text>
						)} */}

						<Text as='h3' color='textColor.black' sx={poppins_600_18_27} mt={'32px'}>
							Country of the artist
						</Text>
						{selectedBap?.country ? (
							<Text color='textColor.black' sx={poppins_400_16_24} mt='8px'>
								{country.label}
							</Text>
						) : (
							<Text color='textColor.gray' sx={poppins_400_16_24} mt='8px'>
								The country is not specified.
							</Text>
						)}
					</Box>
					<Box minW='150px' maxW='calc(45% - 12px)' w='500px' ref={boxRef}>
						<Image
							src={selectedBap?.src}
							alt='B.A.P. logo'
							w='100%'
							maxH='500px'
							style={{ objectFit: 'cover' }}
							borderRadius={'10px'}
						/>

						<Box mt='16px'>
							{mainGenre ? (
								<>
									<Flex align='center' justify='space-between' mt='16px'>
										<Text color='black' sx={poppins_500_18_27}>
											Main Genre
										</Text>
										<Text color='accent' sx={poppins_500_18_27} ml='16px'>
											{mainGenre}
										</Text>
									</Flex>
									{secondaryGenre && (
										<Flex align='center' justify='space-between' mt='16px'>
											<Text color='black' sx={poppins_500_18_27}>
												Secondary Genre
											</Text>
											<Text color='accent' sx={poppins_500_18_27} ml='16px'>
												{secondaryGenre}
											</Text>
										</Flex>
									)}
									{subGenres && (
										<Flex justify='space-between' mt='16px'>
											<Text color='black' sx={poppins_400_16_24}>
												Subgenres
											</Text>
											<Text color='accent' sx={poppins_400_16_24} ml='16px' align='end'>
												{subGenres}
											</Text>
										</Flex>
									)}
								</>
							) : (
								<Text color='secondary' sx={poppins_400_16_24}>
									Genres have not been selected.
								</Text>
							)}
						</Box>
					</Box>
				</Flex>
			)}
		</>
	);
};
