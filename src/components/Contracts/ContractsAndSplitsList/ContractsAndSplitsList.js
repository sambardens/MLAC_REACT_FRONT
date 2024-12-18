import { useRouter } from 'next/router';

import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import getUniqueWritersForSelector from 'src/functions/utils/getUniqueWritersForSelector';
import sortByDate from 'src/functions/utils/sort/sortByDate';

import CustomButton from '@/components/Buttons/CustomButton';
import ContractAndSplitCard from '@/components/Contracts/ContractAndSplitCard/ContractAndSplitCard';
import ContractModal from '@/components/Contracts/ContractModal/ContractModal';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import SearchIcon from '@/assets/icons/base/search.svg';

const sortOptions = [
	{ id: '111', value: 'Date', label: 'Date', name: 'sortType' },
	{ id: '222', value: 'Status', label: 'Status', name: 'sortType' },
	{ id: '333', value: 'Tracks', label: 'Tracks', name: 'sortType' },
	{ id: '444', value: 'Release', label: 'Release', name: 'sortType' },
	{ id: '555', value: 'Artist', label: 'Artist', name: 'sortType' },
];

const dealTypes = [
	{ id: '1111', value: 'All', label: 'All', name: 'dealType' },
	{ id: '2222', value: 'Contract', label: 'Contract', name: 'dealType' },
	{ id: '3333', value: 'Split', label: 'Split', name: 'dealType' },
];

const ContractsAndSplitsList = ({ setIsStartPage, setWithContract, deals }) => {
	const initialState = {
		sortType: sortOptions[0].value,
		dealType: dealTypes[0].value,
		userType: 'All',
		searchValue: '',
	};
	const { pathname } = useRouter();
	const { selectedBap } = useSelector(state => state.user);
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const [actualContractsAndSplits, setActualContractsAndSplits] = useState([]);
	const [actualUsers, setActualUsers] = useState([]);
	const [isContractModal, setIsContractModal] = useState(false);
	const [showExpiredDeals, setShowExpiredDeals] = useState(false);
	const [showDeclinedDeals, setShowDeclinedDeals] = useState(false);
	const [state, setState] = useState(initialState);
	const { sortType, dealType, userType, searchValue } = state;

	const getDeals = useCallback(() => {
		const declinedDeals = [];
		const expiredDeals = [];
		const notExpiredDeals = [];

		deals.forEach(deal => {
			if (deal.status === 3) {
				declinedDeals.push(deal);
			} else if (deal.status === 2 && deal.contractId) {
				expiredDeals.push(deal);
			} else if (deal.status === 0 || deal.status === 1) {
				notExpiredDeals.push(deal);
			}
		});

		return { declinedDeals, expiredDeals, notExpiredDeals };
	}, [deals]);
	const { declinedDeals, expiredDeals, notExpiredDeals } = getDeals();

	const currentDeals = showDeclinedDeals
		? declinedDeals
		: showExpiredDeals
		? expiredDeals
		: notExpiredDeals;

	const sortDeals = useCallback(
		(selectedSortType, actualContractsAndSplits) => {
			if (selectedSortType === 'Date') {
				const sortedDealsByType = sortByDate(actualContractsAndSplits);
				setActualContractsAndSplits([...sortedDealsByType]);
			} else if (selectedSortType === 'Status') {
				const sortedDealsByType = actualContractsAndSplits.sort((a, b) => b.status - a.status);
				setActualContractsAndSplits([...sortedDealsByType]);
			} else if (selectedSortType === 'Tracks') {
				const sortedDealsByType = actualContractsAndSplits.sort(
					(a, b) => b.splitTracks.length - a.splitTracks.length,
				);
				setActualContractsAndSplits([...sortedDealsByType]);
			} else if (selectedSortType === 'Release') {
				const sortedDealsByType = actualContractsAndSplits.sort(
					(a, b) => b.releaseName - a.releaseName,
				);
				setActualContractsAndSplits([...sortedDealsByType]);
			} else if (selectedSortType === 'Artist') {
				const sortedDealsByType = actualContractsAndSplits.sort((a, b) => b.bapName - a.bapName);
				setActualContractsAndSplits([...sortedDealsByType]);
			} else if (selectedSortType === 'Reverse') {
				const sortedDealsReversed = actualContractsAndSplits.reverse();
				setActualContractsAndSplits([...sortedDealsReversed]);
			}
		},
		[setActualContractsAndSplits],
	);
	const getActualDeals = () => {
		const normalyzedInput = searchValue.trim().toLocaleLowerCase();
		let newActualDeals;
		newActualDeals = normalyzedInput
			? currentDeals?.filter(deal => deal.releaseName.toLowerCase().includes(normalyzedInput))
			: currentDeals;

		newActualDeals =
			dealType !== 'All'
				? newActualDeals.filter(deal => deal.type === dealType.toLowerCase())
				: newActualDeals;

		newActualDeals =
			userType !== 'All'
				? newActualDeals.filter(deal => deal.writers.includes(userType))
				: newActualDeals;
		const usersFromDeals = getUniqueWritersForSelector(newActualDeals);
		setActualUsers(usersFromDeals);
		sortDeals(sortType, newActualDeals);
	};

	const getInitialDeals = () => {
		setState({ ...initialState });
	};

	const handleCheckExpiredDeals = () => {
		setShowExpiredDeals(!showExpiredDeals);
		setShowDeclinedDeals(false);
		setState(prev => ({ ...prev, userType: 'All' }));
	};

	const handleCheckCancelledDeals = () => {
		setShowExpiredDeals(false);
		setShowDeclinedDeals(!showDeclinedDeals);
		setState(prev => ({ ...prev, userType: 'All' }));
	};

	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		const newValue = type === 'checkbox' ? checked : value;
		setState(prevState => ({
			...prevState,
			[name]: newValue,
		}));
	};

	const handleSelect = e => {
		const { value, name } = e;
		if (name === 'sortType' && value === sortType) {
			sortDeals('Reverse', actualContractsAndSplits);
			return;
		}
		setState(prev => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		if (deals?.length > 0) {
			getActualDeals();
		} else {
			setActualContractsAndSplits([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		deals,
		showExpiredDeals,
		showDeclinedDeals,
		searchValue,
		dealType,
		userType,
		sortDeals,
		sortType,
	]);

	const getReleaseInWebPage = useCallback(() => {
		const res = [];
		if (selectedBap?.landingPages?.length > 0) {
			selectedBap?.landingPages.forEach(el => {
				const id = Number(el.releaseId);
				if (el.webpagesTypeId === 2 && !res.includes(id)) {
					res.push(id);
				}
			});
		}

		if (selectedBap?.shops?.length > 0) {
			selectedBap?.shops[0].releaseIds.forEach(el => {
				const id = Number(el);
				if (!res.includes(id)) {
					res.push(id);
				}
			});
		}
		if (selectedBap?.releases?.length > 0) {
			selectedBap?.releases.forEach(el => {
				if (el.evearaReleaseId && !res.includes(el.id)) {
					res.push(el.id);
				}
			});
		}
		return res;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId]);

	const releasesInUse = getReleaseInWebPage();

	return (
		<Box minH='100%'>
			<Flex justifyContent='space-between' mb='16px'>
				{deals?.length > 0 && (
					<CustomInput
						name='searchValue'
						icon={SearchIcon}
						maxW='350px'
						mr='10px'
						placeholder='Search by release name'
						value={searchValue}
						onChange={handleChange}
					/>
				)}
				{/* {selectedBap?.isCreator && (
					<PlusButton
						title='Add contract'
						onClickHandler={() => {
							setIsReleasesModal(true);
						}}
					/>
				)} */}
				<Flex gap='24px' align='center'>
					{expiredDeals?.length > 0 && (
						<Checkbox
							id='dealType'
							name='dealType'
							isChecked={showExpiredDeals}
							onChange={handleCheckExpiredDeals}
							colorScheme='checkbox'
							borderColor='secondary'
							size='md'
							minW='135px'
						>
							<Text lineHeight='1' fontSize='16px' fontWeight='400' color='secondary' ml='4px'>
								Show expired
							</Text>
						</Checkbox>
					)}
					{declinedDeals?.length > 0 && (
						<Checkbox
							id='dealType'
							name='dealType'
							isChecked={showDeclinedDeals}
							onChange={handleCheckCancelledDeals}
							colorScheme='checkbox'
							borderColor='secondary'
							size='md'
							minW='145px'
						>
							<Text lineHeight='1' fontSize='16px' fontWeight='400' color='secondary' ml='4px'>
								Show declined
							</Text>
						</Checkbox>
					)}
				</Flex>
			</Flex>

			{deals?.length > 0 && (
				<Flex justifyContent={'space-between'} alignItems={'center'}>
					<Flex>
						<Flex alignItems={'center'} w='fit-content'>
							<Text fontSize='16px' fontWeight='400' color='secondary'>
								Sort by:
							</Text>

							<CustomSelect
								name='sortType'
								onChange={handleSelect}
								value={sortType}
								ml='12px'
								bgColor={'none'}
								borderSelect={'none'}
								phColor={'secondary'}
								isInput={false}
								options={showExpiredDeals ? sortOptions.filter(el => el.value !== 'Status') : sortOptions}
								pxDropdownIcon={'12px'}
								w='130px'
								isSearchable={false}
								listMaxHeight='282px'
							/>
						</Flex>

						<Flex alignItems={'center'} ml='12px' w='fit-content'>
							<Text fontSize='16px' fontWeight='400' color='secondary'>
								Deal type:
							</Text>
							{showExpiredDeals || showDeclinedDeals ? (
								<Text fontSize='16px' fontWeight='400' color='black' w='135px' pl='12px'>
									Contract
								</Text>
							) : (
								<CustomSelect
									name='dealType'
									onChange={handleSelect}
									value={dealType}
									bgColor={'none'}
									borderSelect={'none'}
									phColor={'secondary'}
									isInput={false}
									options={dealTypes}
									pxDropdownIcon={'12px'}
									w='135px'
									isSearchable={false}
								/>
							)}
						</Flex>

						<Flex alignItems={'center'} ml='17px'>
							<Text fontSize='16px' fontWeight='400' color='secondary'>
								User:
							</Text>
							<CustomSelect
								onChange={handleSelect}
								name='userType'
								value={userType}
								ml='12px'
								bgColor={'none'}
								borderSelect={'none'}
								phColor={'secondary'}
								isInput={false}
								options={actualUsers}
								pxDropdownIcon={'12px'}
								w='135px'
								isSearchable={false}
							/>
						</Flex>
					</Flex>
					<CustomButton
						onClickHandler={getInitialDeals}
						mb='2px'
						py={'8px'}
						px={'8px'}
						w={'fit-content'}
						styles='transparent'
						h='40px'
						minW='102px'
					>
						<Text fontSize='16px' fontWeight='400' color='secondary'>
							Drop filters
						</Text>
					</CustomButton>
				</Flex>
			)}

			<Flex as='ul' flexDir={'column'} justifyContent={'center'} gap='12px' h='100%'>
				{actualContractsAndSplits?.length > 0 &&
					actualContractsAndSplits?.map((item, i) => (
						<ContractAndSplitCard
							key={`${item.createdAt}${i}`}
							deal={item}
							setWithContract={setWithContract}
							setIsStartPage={setIsStartPage}
							setIsContractModal={setIsContractModal}
							releasesInUse={releasesInUse}
						/>
					))}
				{deals?.length === 0 && (
					<Text
						position={'absolute'}
						top='50%'
						right='50%'
						transform={'translate(50%, -50%)'}
						color='black'
						fontSize='18px'
						fontWeight='600'
						textAlign='center'
					>
						You don&apos;t have any splits or contracts
						{isContractsAndSplitsPage ? ' in this B.A.P.' : '.'}
					</Text>
				)}

				{deals?.length > 0 && actualContractsAndSplits?.length === 0 && (
					<Text
						position={'absolute'}
						top='50%'
						right='50%'
						transform={'translate(50%, -50%)'}
						color='black'
						fontSize='18px'
						fontWeight='600'
						textAlign='center'
					>
						No contracts and splits found for selected filters
					</Text>
				)}
				{/* {isReleasesModal && <ReleasesModal closeModal={() => setIsReleasesModal(false)} />} */}
				{isContractModal && (
					<ContractModal
						setIsContractModal={setIsContractModal}
						setWithContract={setWithContract}
						setIsStartPage={setIsStartPage}
					/>
				)}
			</Flex>
		</Box>
	);
};
export default ContractsAndSplitsList;
