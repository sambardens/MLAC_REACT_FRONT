import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import allTimeFilter from 'src/functions/utils/analytics/dateFilters/allTimeFilter';
import thisMonthFilter from 'src/functions/utils/analytics/dateFilters/thisMonthFilter';
import thisWeekFilter from 'src/functions/utils/analytics/dateFilters/thisWeekFilter';
import thisYearFilter from 'src/functions/utils/analytics/dateFilters/thisYearFilter';
import todayFilter from 'src/functions/utils/analytics/dateFilters/todayFilter';
import getFilteredItemsByPeriod from 'src/functions/utils/analytics/filters/getFilteredItemsByPeriod';
import getFilteredItemsByRelease from 'src/functions/utils/analytics/filters/getFilteredItemsByRelease';
import getSelectedReleaseFilter from 'src/functions/utils/analytics/getSelectedReleaseFilter';
import {
	resetAnalyticsData,
	resetFilters,
	resetReleaseFilter,
	setDateFilter,
	setFilteredPurchases,
} from 'store/analytics/analytics-slice';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

import CalendarIcon from '@/assets/icons/base/calendar.svg';
import CloseIcon from '@/assets/icons/base/close.svg';
import DownIcon from '@/assets/icons/base/down.svg';
import ReleaseIcon from '@/assets/icons/navMenu/releases.svg';

import ReleasesMenu from './ReleasesMenu/ReleasesMenu';

const dateOptions = [
	{ id: '1', value: 'Today', label: 'Today' },
	{ id: '2', value: 'This week', label: 'This week' },
	{ id: '3', value: 'This month', label: 'This month' },
	{ id: '4', value: 'This year', label: 'This year' },
	{ id: '5', value: 'All time', label: 'All time' },
];

const Header = () => {
	const dispatch = useDispatch();
	const selectedBap = useSelector(state => state.user.selectedBap);
	const analytics = useSelector(state => state.analytics);
	const { filters, purchases, analyticsData } = analytics;
	const [dateType, setDateType] = useState(filters.dateFilter?.selectedDateType);

	const [isReleasesModal, setIsReleasesModal] = useState(false);
	const releasesMenuRef = useRef(null);

	const handleFilterByPeriod = selectedDateType => {
		setDateType(selectedDateType);

		if (selectedDateType === 'Today') {
			const preparedFilter = todayFilter(selectedDateType);
			dispatch(setDateFilter(preparedFilter));
		}

		if (selectedDateType === 'This week') {
			const preparedFilter = thisWeekFilter(selectedDateType);
			dispatch(setDateFilter(preparedFilter));
		}

		if (selectedDateType === 'This month') {
			const preparedFilter = thisMonthFilter(selectedDateType);
			dispatch(setDateFilter(preparedFilter));
		}

		if (selectedDateType === 'This year') {
			const preparedFilter = thisYearFilter(selectedDateType);
			dispatch(setDateFilter(preparedFilter));
		}

		if (selectedDateType === 'All time') {
			const preparedFilter = allTimeFilter(selectedDateType);
			dispatch(setDateFilter(preparedFilter));
		}
	};

	useEffect(() => {
		handleFilterByPeriod(filters.dateFilter?.selectedDateType);

		dispatch(resetReleaseFilter());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap.bapId]);

	useEffect(() => {
		if (filters.dateFilter && purchases.preparedPurchases?.length > 0) {
			const filteredPurchasesByPeriod = getFilteredItemsByPeriod(
				purchases.preparedPurchases,
				filters.dateFilter,
			);
			const filteredPurchasesByRelease = getFilteredItemsByRelease(
				filteredPurchasesByPeriod,
				filters.releaseFilter,
			);
			dispatch(setFilteredPurchases(filteredPurchasesByRelease));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters.dateFilter, filters.releaseFilter?.track, purchases.preparedPurchases]);
	// }, [dateType]);

	const handleOutsideClick = event => {
		if (
			releasesMenuRef.current &&
			!releasesMenuRef.current.contains(event.target) &&
			event.target.id !== 'openMenuButton'
		) {
			setIsReleasesModal(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	const handleClickIcon = e => {
		e.stopPropagation();
		dispatch(resetAnalyticsData());
		dispatch(resetFilters());
	};

	return (
		<Flex justifyContent='space-between' gap='16px'>
			<Box pos='relative' w='40%' maxW='300px'>
				{/* <Box pos='relative' w='100%' maxW='420px'> */}
				<Icon
					as={CalendarIcon}
					color='stroke'
					boxSize='24px'
					pos='absolute'
					top='50%'
					left='12px'
					transform='translateY(-50%)'
					zIndex={2}
				/>
				<CustomSelect
					onChange={e => handleFilterByPeriod(e.value)}
					value={dateType}
					options={dateOptions}
					plValueContainer='48px'
					isSearchable={false}
					w='100%'
					minW='200px'
				/>
			</Box>
			{/* 
			<Flex
				onClick={() => setIsReleasesModal(!isReleasesModal)}
				id='openMenuButton'
				className='openMenuButton'
				alignItems={'center'}
				justifyContent={'space-between'}
				// w='40%'
				// minW={'300px'}
				// maxW={'450px'}
				w={'450px'}
				h='56px'
				p='10px 12px'
				bgColor={'white'}
				borderRadius={'10px'}
				cursor={'pointer'}
				border='1px'
				borderColor='stroke'
				// overflow='hidden'
			>
				<Flex w={'100%'}>
					<Icon id='openMenuButton' as={ReleaseIcon} color={'stroke'} boxSize='24px' />
					<Tooltip
						label={
							getSelectedReleaseFilter(filters)?.length > 30 ? getSelectedReleaseFilter(filters) : ''
						}
						hasArrow
						bg='secondary'
						borderRadius='10px'
						fontWeight='500'
						fontSize='14px'
					>
						<Text id='openMenuButton' ml='12px' w='100%' maxW='290px' isTruncated>
							{getSelectedReleaseFilter(filters)}
						</Text>
					</Tooltip>
				</Flex>

				<Flex align={'center'} gap={'5px'}>
					{analyticsData && (
						<Icon
							id='openMenuButton'
							as={CloseIcon}
							color={'secondary'}
							boxSize='24px'
							onClick={e => handleClickIcon(e)}
							zIndex={50}
						/>
					)}
					<Icon
						id='openMenuButton'
						as={DownIcon}
						boxSize='24px'
						ml='10px'
						transform={isReleasesModal ? 'rotate(180deg)' : null}
						transition={'300ms'}
						color='secondary'
					/>
				</Flex>
			</Flex>

			{isReleasesModal && (
				<Box ref={releasesMenuRef} position={'absolute'} right='0' top='60px' zIndex={1}>
					<ReleasesMenu setIsReleasesModal={setIsReleasesModal} />
				</Box>
			)} */}

			{/* <Flex
        pos='relative' alignItems={'center'} w='100%'
        maxW='420px'>
        <CustomSelect
          onChange={(e) => handleFilterByPeriod(e.value)}
          value={dateType}
          options={dateOptions}
          isSearchable={false}
          w='100%'
          ml='10px'
        />
      </Flex> */}
		</Flex>
	);
};

export default Header;
