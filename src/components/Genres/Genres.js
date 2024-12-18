import { Box, Flex } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import getSubGenres from 'src/functions/serverRequests/genre/getSubGenres';
import compareGenres from 'src/functions/utils/genres/compareGenres';
import getNormalyzedGenresList from 'src/functions/utils/genres/getNormalyzedGenresList';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

const Genres = ({
	genresData,
	setGenresData,
	isBapGenres = true,
	setIsNewGenres,
	currentGenres,
}) => {
	const { mainGenres: mainGenresList } = useSelector(state => state.genres);
	const [subGenresList, setSubGenresList] = useState([]);
	const { mainGenre, secondaryGenre, subGenres } = genresData;

	const handleSelectGenres = (value, name) => {
		if (name === 'subGenres') {
			setGenresData(prev => ({ ...prev, [name]: value }));
			if (setIsNewGenres) {
				const res = compareGenres(currentGenres, { ...genresData, [name]: value });
				setIsNewGenres(res);
			}
		} else {
			const selectedGenre = mainGenresList.find(mainGenre => mainGenre.id === +value?.id);
			setGenresData(prev => {
				return { ...prev, [name]: selectedGenre || null };
			});
			if (setIsNewGenres) {
				const res = compareGenres(currentGenres, { ...genresData, [name]: selectedGenre || null });
				setIsNewGenres(res);
			}
		}
	};

	useEffect(() => {
		const getSubGenresFromServer = async () => {
			const firstId = mainGenre ? mainGenre.id : null;
			const secondId = secondaryGenre ? secondaryGenre.id : null;
			const subGenresFromServer = await getSubGenres(firstId, secondId);
			const normalyzedGenres = getNormalyzedGenresList(subGenresFromServer);
			setSubGenresList(normalyzedGenres);
		};
		if (mainGenre?.id) {
			getSubGenresFromServer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mainGenre?.id, secondaryGenre?.id]);

	useEffect(() => {
		setGenresData(prev => {
			return {
				...prev,
				subGenres: prev.subGenres.filter(
					el => el?.mainGenreId === mainGenre?.id || el?.mainGenreId === secondaryGenre?.id,
				),
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subGenresList?.length]);

	return (
		<Flex flexDir='column' gap='16px' mt='16px'>
			<CustomSelect
				name='mainGenre'
				label='Genre'
				onChange={genre => {
					handleSelectGenres(genre, 'mainGenre');
				}}
				value={mainGenre?.value || ''}
				options={
					secondaryGenre?.id ? mainGenresList.filter(el => el.id !== secondaryGenre?.id) : mainGenresList
				}
				dropdownIconColor='secondary'
			/>

			{mainGenre?.value ? (
				<CustomSelect
					name='secondaryGenres'
					label='Secondary genre (optional)'
					onChange={genre => {
						handleSelectGenres(genre, 'secondaryGenre');
					}}
					value={secondaryGenre?.value || ''}
					options={mainGenre?.id ? mainGenresList.filter(el => el.id !== mainGenre?.id) : mainGenresList}
					isTop={isBapGenres}
					menuListTopHeight='- 12'
					isClearable={true}
					dropdownIconColor='secondary'
				/>
			) : (
				<>{isBapGenres && <Box h='88px' />}</>
			)}
			{subGenresList.length > 0 ? (
				<CustomSelect
					name='subGenres'
					label='Subgenres (optional)'
					onChange={genres => {
						handleSelectGenres(genres, 'subGenres');
					}}
					selectedOptions={subGenres}
					isMulti={true}
					options={subGenresList}
					hControl='fit-content'
					isTop={isBapGenres}
					menuListTopHeight='- 12'
					isClearIndicator={true}
					dropdownIconColor='secondary'
				/>
			) : (
				<>{isBapGenres && <Box h='88px' />}</>
			)}
		</Flex>
	);
};

export default Genres;
