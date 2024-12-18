import { Flex, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import compareArrays from 'src/functions/utils/compareArrays';
import compareObjects from 'src/functions/utils/compareObjects';
import getNormalyzedEvearaGenres from 'src/functions/utils/genres/getNormalyzedEvearaGenres';
import getReleaseNewGenresEveara from 'src/functions/utils/genres/getReleaseNewGenresEveara';
import { handleEditRelease } from 'store/operations';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import evearaGenres from '@/assets/evearaGenres.json';
import DateIcon from '@/assets/icons/base/date.svg';

import { releaseTypes } from '../../AddNameMenu/releaseTypes';

const DistributeReleaseInfo = () => {
	const dispatch = useDispatch();
	const { selectedRelease } = useSelector(state => state.user);
	const { evearaGenreIds, mainGenre, secondaryGenre, subGenres } = selectedRelease;

	const toast = useToast();
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	const initialReleaseData = {
		distributeDate: selectedRelease?.distributeDate || '',
		label: selectedRelease?.label || '',
		type: selectedRelease?.type || '',
	};

	const [isEditLoading, setIsEditLoading] = useState(false);
	const [releaseData, setReleaseData] = useState({ ...initialReleaseData });
	const [oldReleaseData, setOldReleaseData] = useState({ ...initialReleaseData });
	const [releaseGenres, setReleaseGenres] = useState(getNormalyzedEvearaGenres(evearaGenreIds));
	const { type, distributeDate, label, upc } = releaseData;
	const isNewReleaseData = compareObjects(releaseData, oldReleaseData);
	const [minDate, setMinDate] = useState('');
	const [maxDate, setMaxDate] = useState('');

	function setMinMaxReleaseDates() {
		const today = new Date();
		const min = new Date(today);
		min.setDate(min.getDate() + 11); // Устанавливаем минимальную дату на 10 дней от сегодняшнего дня

		const max = new Date(min);
		max.setFullYear(max.getFullYear() + 1); // Устанавливаем максимальную дату на один год больше минимальной
		setMinDate(min.toISOString().split('T')[0]);
		setMaxDate(max.toISOString().split('T')[0]);
	}
	const handleChange = e => {
		const { name, value } = e.target;
		setReleaseData(prev => ({ ...prev, [name]: value }));
	};
	const handleSelectType = ({ value }) => {
		const newData = { ...releaseData, type: value };
		setReleaseData(newData);
		if (releaseData.type !== value) {
			dispatch(handleEditRelease({ releaseId: selectedRelease.id, releaseData: newData }));
			setOldReleaseData(newData);
			setIsEditLoading(false);
		}
	};

	const genres = evearaGenres.map(el => ({ id: el.genre_id, label: el.name, value: el.genre_id }));

	const handleSelectGenres = newGenres => {
		setReleaseGenres(newGenres);
		const genresData = newGenres.map(el => el.value);
		const isEqualGenres = compareArrays(genresData, evearaGenreIds);
		if (!isEqualGenres) {
			setIsEditLoading(true);
			const newData = { ...releaseData };
			newData.evearaGenreIds = '[' + genresData.join(', ') + ']';
			dispatch(handleEditRelease({ releaseId: selectedRelease.id, releaseData: newData }));
			setOldReleaseData(newData);
			setIsEditLoading(false);
		}
	};

	const handleSave = async e => {
		e.preventDefault();
		const { name, value } = e.target;
		if (name === 'distributeDate' && value) {
			const dateValue = new Date(value);
			const minDateValue = new Date(minDate);
			const maxDateValue = new Date(maxDate);
			if (dateValue < minDateValue) {
				getToast('error', 'Error', 'Start date of distribution is less than the minimum allowed');
				setReleaseData(prev => ({ ...prev, distributeDate: initialReleaseData.distributeDate }));
				return;
			} else if (dateValue > maxDateValue) {
				getToast('error', 'Error', 'Start date of distribution is greater than the maximum allowed.');
				setReleaseData(prev => ({ ...prev, distributeDate: initialReleaseData.distributeDate }));
				return;
			}
		}
		if (isNewReleaseData) {
			setIsEditLoading(true);
			await dispatch(handleEditRelease({ releaseId: selectedRelease.id, releaseData }));
			setOldReleaseData(releaseData);
			setIsEditLoading(false);
		}
	};

	useEffect(() => {
		if (!evearaGenreIds && mainGenre) {
			const newGenres = getReleaseNewGenresEveara({
				evearaGenreIdsArr: [],
				mainGenre,
				secondaryGenre,
				subGenres,
			});
			if (newGenres) {
				dispatch(
					handleEditRelease({
						releaseId: selectedRelease.id,
						releaseData: { evearaGenreIds: newGenres },
					}),
				);
			}
		}
	}, [dispatch, evearaGenreIds, mainGenre, secondaryGenre, selectedRelease.id, subGenres]);

	useEffect(() => {
		setMinMaxReleaseDates();
	}, []);

	return (
		<Flex as='form' maxW='500px' mb='16px' flexDir='column' gap='16px'>
			<CustomSelect
				name='evearaGenreIds'
				label='Release genres'
				onChange={handleSelectGenres}
				selectedOptions={releaseGenres}
				isMulti={true}
				options={genres}
				hControl='fit-content'
			/>
			<CustomInput
				label='Start date of distribution'
				// iconRight={DateIcon}
				placeholder='Choose the date'
				name='distributeDate'
				value={distributeDate}
				onChange={handleChange}
				onBlur={handleSave}
				type='date'
				min={minDate}
				max={maxDate}
			/>

			<CustomInput
				name='label'
				placeholder='Major Labl'
				value={label}
				onBlur={handleSave}
				onChange={handleChange}
				label='Custom label'
			/>
			<CustomSelect
				name='releaseTypes'
				options={releaseTypes}
				value={type}
				placeholder='Select release type'
				onChange={handleSelectType}
				label='Release type'
			/>
		</Flex>
	);
};

export default DistributeReleaseInfo;
