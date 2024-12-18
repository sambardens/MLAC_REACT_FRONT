import { Box, Checkbox, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { getOutletsDetailsEveara } from 'store/eveara/eveara-operations';
import { editTracksPriceOrPosition, handleEditRelease } from 'store/operations';
import { setReleaseSelectedMenu } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import MenuTitle from '../MenuTitle/MenuTitle';

import WarningMessage from './WarningMessage/WarningMessage';

const SellDirectMenu = () => {
	const axiosPrivate = useAxiosPrivate();
	const [isPageLoading, setIsPageLoading] = useState(false);
	const { user, selectedRelease } = useSelector(state => state.user);
	const checkedTracks = selectedRelease?.checkedTracks;
	const isSingleRelease = checkedTracks?.length === 1;
	const dispatch = useDispatch();
	const initialState = checkedTracks?.reduce((acc, el) => {
		acc[el.uniqueName] = { price: el.price };
		return acc;
	}, {});

	const [isSavingLocalPrice, setIsSavingLocalPrice] = useState(false);
	const [isSavingDistributePrice, setIsSavingDistributePrice] = useState(false);
	const [state, setState] = useState(initialState);

	const [averagePrice, setAveragePrice] = useState(0);
	const [isIndividual, setIsIndividual] = useState(false);
	const [releasePrice, setReleasePrice] = useState(selectedRelease?.releasePrice || 0);

	const [initialDistributePrice, setInitialDistributePrice] = useState({});
	const [distributePrice, setDistributePrice] = useState({});

	const handleChange = e => {
		const { name, value } = e.target;

		if (value === '') {
			setState(prev => ({ ...prev, [name]: { price: value } }));
		} else {
			const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
			const isCorrect = numberRegex.test(value);
			if (isCorrect) {
				const price = Number(value);
				setState(prev => ({ ...prev, [name]: { price } }));
			}
		}
	};

	const checkTracksPrice = () => {
		const keys = Object.keys(initialState);

		for (let key of keys) {
			if (initialState[key].price !== state[key].price) {
				return true;
			}
		}
		return false;
	};
	const isTracksPrice = checkTracksPrice();

	const isNewReleasePrice = selectedRelease.releasePrice !== releasePrice;

	const handleSubmit = async e => {
		e.preventDefault();
		setIsSavingLocalPrice(true);
		if (isNewReleasePrice) {
			await dispatch(
				handleEditRelease({
					releaseId: selectedRelease.id,
					releaseData: { releasePrice },
				}),
			);
		}
		if (isTracksPrice) {
			const updatedTracks = checkedTracks?.map(track => {
				const uniqueName = track.uniqueName;
				if (state.hasOwnProperty(uniqueName)) {
					return {
						...track,
						price: state[uniqueName].price,
					};
				}
				return track;
			});
			await dispatch(
				editTracksPriceOrPosition({
					tracksData: state,
					updatedTracks: [...updatedTracks],
				}),
			);
			// if (res?.payload?.success) {
			// 	toast({
			// 		position: 'top',
			// 		title: 'Success',
			// 		description: 'Tracks price has been saved',
			// 		status: 'success',
			// 		duration: 5000,
			// 		isClosable: true,
			// 	});
			// } else {
			// 	toast({
			// 		position: 'top',
			// 		title: 'Error',
			// 		description: 'Something has gone wrong. Try again later',
			// 		status: 'error',
			// 		duration: 5000,
			// 		isClosable: true,
			// 	});
			// }
		}
		setIsSavingLocalPrice(false);
	};

	const setAllTrackValue = e => {
		const { value } = e.target;
		if (!value.includes('-')) {
			let newValue;

			if (value === '') {
				newValue = 0;
			} else {
				const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
				const isCorrect = numberRegex.test(value);
				if (!isCorrect) return;
				const number = +value;
				newValue = parseFloat(number.toFixed(2));
			}

			const newState = {};
			for (let key in state) {
				newState[key] = { price: newValue };
			}
			setState(newState);
			setAveragePrice(newValue);
			// const total = Number((newValue * checkedTracks?.length).toFixed(2));
			// setReleasePrice(total);
		}
	};

	const handleKeyDown = event => {
		if (event.key === '-') {
			event.preventDefault();
		}
	};

	const handleChangeReleasePrice = e => {
		const { value } = e.target;
		if (value === '') {
			setReleasePrice(value);
			if (isSingleRelease) {
				const newState = {};
				for (let key in state) {
					newState[key] = { price: 0 };
				}
				setState(newState);
			}
			// setAveragePrice(0);
			// const newState = {};
			// for (let key in state) {
			// 	newState[key] = { price: 0 };
			// }
			// setState(newState);
		} else {
			const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
			const isCorrect = numberRegex.test(value);
			if (isCorrect) {
				setReleasePrice(Number(value));
				if (isSingleRelease) {
					const newState = {};
					for (let key in state) {
						newState[key] = { price: Number(value) };
					}
					setState(newState);
				}
				// const price = (value / checkedTracks?.length).toFixed(2);
				// setAveragePrice(price);
				// const newState = {};
				// let remaining = +value;
				// for (let key in state) {
				// 	if (key !== Object.keys({ ...state }).pop()) {
				// 		newState[key] = { price };
				// 		remaining -= price;
				// 	} else {
				// 		newState[key] = { price: Number(remaining.toFixed(2)) };
				// 	}
				// }
				// setState(newState);
			}
		}
	};
	const arr = Object.values(state);

	const isAllValuesEqual = arr.every(val => val.price === arr[0].price);

	useEffect(() => {
		isAllValuesEqual && arr[0]?.price ? setAveragePrice(arr[0].price) : setAveragePrice(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAllValuesEqual]);

	useEffect(() => {
		const getOutlets = async () => {
			setIsPageLoading(true);
			const [y, m, d] = selectedRelease.distributeDate?.split('-');
			const release_start_date = `${d}-${m}-${y}`;
			await dispatch(
				getOutletsDetailsEveara({
					uuidEveara: user.uuidEveara,
					releaseId: selectedRelease.evearaReleaseId,
					release_start_date,
					axiosPrivate,
				}),
			);
			setIsPageLoading(false);
		};

		if (selectedRelease.evearaReleaseId && !selectedRelease?.outlets_details) {
			getOutlets();
		}
		[axiosPrivate, dispatch, selectedRelease.evearaReleaseId, user.uuidEveara];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (selectedRelease.evearaReleaseId && selectedRelease?.outlets_details) {
			let initialState = {};
			selectedRelease.outlets_details.forEach(outlet => {
				let trackPrice = 0;
				let releasePrice = 0;

				if (outlet.store_name === 'Apple Music') {
					if (selectedRelease.appleMusicReleasePriceId) {
						const price = outlet.album_code_list.find(
							el => el.id === selectedRelease?.appleMusicReleasePriceId,
						);
						releasePrice = price.value;
					}
					if (selectedRelease.appleMusicTrackPriceId) {
						const price = outlet.track_code_list.find(
							el => el.id === selectedRelease?.appleMusicTrackPriceId,
						);
						trackPrice = price.value;
					}
					initialState = {
						...initialState,
						[outlet.store_name]: { trackPrice, releasePrice },
					};
				} else if (outlet.store_name === 'Amazon Prime Music') {
					if (selectedRelease.amazonReleasePriceId) {
						const price = outlet.album_code_list.find(
							el => el.id === selectedRelease.amazonReleasePriceId,
						);
						releasePrice = price.value;
					}
					if (selectedRelease.amazonTrackPriceId) {
						const price = outlet.track_code_list.find(el => el.id === selectedRelease.amazonTrackPriceId);
						trackPrice = price.value;
					}
					initialState = {
						...initialState,
						[outlet.store_name]: { trackPrice, releasePrice },
					};
				}
			});
			console.log('initialState: ', initialState);
			setDistributePrice(initialState);

			setInitialDistributePrice(initialState);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease.evearaReleaseId, selectedRelease?.outlets_details]);

	const handleSelect = ({ value }, name, type) => {
		setDistributePrice(prev => ({ ...prev, [name]: { ...prev[name], [type]: value } }));
	};

	const allTracksWithPrice = Object.values(state).every(item => item.price > 0);
	const isActive = allTracksWithPrice && releasePrice && (isTracksPrice || isNewReleasePrice);

	const isNewDistributePrice =
		JSON.stringify(initialDistributePrice) !== JSON.stringify(distributePrice);

	const handleSaveDistributePrice = async e => {
		e.preventDefault();
		setIsSavingDistributePrice(true);
		if (isNewDistributePrice) {
			const releaseData = {
				amazonReleasePriceId: distributePrice['Amazon Prime Music'].releasePrice,
				amazonTrackPriceId: distributePrice['Amazon Prime Music'].trackPrice,
				appleMusicReleasePriceId: distributePrice['Apple Music'].releasePrice,
				appleMusicTrackPriceId: distributePrice['Apple Music'].trackPrice,
			};
			await dispatch(
				handleEditRelease({
					releaseId: selectedRelease.id,
					releaseData,
				}),
			);
			setInitialDistributePrice(distributePrice);
		}
		setIsSavingDistributePrice(false);
	};
	return (
		<Flex flexDir={'column'} justifyContent='space-between' h='100%'>
			<Box mb='16px'>
				<MenuTitle
					title='Sell direct'
					text='Major Labl Artist Club will automatically pay the writers according to the agreed splits. To receive payment you must connect an active PayPal account in your user profile.'
				/>
				{user.paymentEmail === null && <WarningMessage />}
				{isPageLoading ? (
					<ContainerLoader />
				) : (
					<>
						<Box maxW='600px' as='form' onSubmit={handleSubmit}>
							<Flex mb='24px' w='100%' align='flex-end' justify='space-between' gap='16px'>
								<CustomInput
									label='Set total release price'
									placeholder='0'
									value={releasePrice}
									type='number'
									textRight='£'
									onChange={handleChangeReleasePrice}
									reverse
									w='292px'
									maxW='292px'
								/>
								{isIndividual && (
									<CustomInput
										label='Per track'
										placeholder={isAllValuesEqual ? '0' : '-'}
										value={averagePrice === 0 ? '' : averagePrice}
										onChange={setAllTrackValue}
										type='number'
										textRight='£'
										onKeyDown={handleKeyDown}
										reverse
										w='292px'
										maxW='292px'
									/>
								)}
								{isSingleRelease && (
									<CustomButton
										type='submit'
										styles={isActive ? 'main' : 'disabled'}
										isSubmiting={isSavingLocalPrice}
										minW='150px'
										ml='auto'
									>
										Approve
									</CustomButton>
								)}
							</Flex>
							{!isSingleRelease && (
								<Flex mb='24px' pl='12px'>
									<Checkbox
										id='individul_price'
										isChecked={isIndividual}
										onChange={() => {
											setIsIndividual(!isIndividual);
										}}
										colorScheme='checkbox'
										iconColor='white'
										borderColor='accent'
										size='lg'
									/>
									<Text fontSize='16px' fontWeight='400' color='black' ml='16px'>
										Allow track to be priced and bought individually
									</Text>
								</Flex>
							)}
							{isIndividual && (
								<Box>
									<Text fontSize='16px' fontWeight='400' color='black' px='12px' mb='24px'>
										Individual price for each track
									</Text>
									<Flex as='ul' flexDir='column' gap='8px'>
										{checkedTracks?.map((el, index) => (
											<Flex key={el.uniqueName} justify='space-between' align='center'>
												<Tooltip
													hasArrow
													label={el.name.length > 53 && el.name}
													placement='top'
													bg='bg.black'
													color='textColor.white'
													fontSize='16px'
													borderRadius={'5px'}
												>
													<Text fontSize='16px' fontWeight='400' color='black' pl='12px' isTruncated={true}>
														{index + 1}. {el.name}
													</Text>
												</Tooltip>
												<CustomInput
													placeholder='0'
													name={el.uniqueName}
													value={state[el.uniqueName].price}
													onChange={handleChange}
													type='number'
													textRight='£'
													w='150px'
													onKeyDown={handleKeyDown}
													reverse
												/>
											</Flex>
										))}
									</Flex>
								</Box>
							)}
							{!isSingleRelease && (
								<Flex mt='24px'>
									<CustomButton
										ml='auto'
										type='submit'
										styles={isActive ? 'main' : 'disabled'}
										isSubmiting={isSavingLocalPrice}
									>
										Approve
									</CustomButton>
								</Flex>
							)}
						</Box>
						{selectedRelease.evearaReleaseId && selectedRelease.outlets_details && (
							<Box mt='24px' maxW='600px' as='form' onSubmit={handleSaveDistributePrice}>
								<Text fontSize='16px' fontWeight={500} mb='12px' pl='12px' color='black'>
									Set the price for distribution in stores
								</Text>
								<Flex as='ul' gap='12px' flexDir='column'>
									{selectedRelease.outlets_details.map(el => (
										<Box as='li' key={el.store_name}>
											<Text
												pl='12px'
												mb='4px'
												fontSize='16px'
												fontWeight={500}
												color='secondary'
												textDecoration='underline'
												textAlign='center'
											>
												{el.store_name}
											</Text>
											<Flex gap='16px'>
												<CustomSelect
													label='Release price'
													options={el.album_code_list}
													name='releasePrice'
													value={distributePrice[el.store_name]?.releasePrice}
													placeholder='Select release price'
													onChange={selectedOptions => {
														handleSelect(selectedOptions, el.store_name, 'releasePrice');
													}}
												/>
												<CustomSelect
													label='Track price'
													options={el.track_code_list}
													name='trackPrice'
													value={distributePrice[el.store_name]?.trackPrice}
													placeholder='Select track price'
													onChange={selectedOptions => {
														handleSelect(selectedOptions, el.store_name, 'trackPrice');
													}}
												/>
											</Flex>
										</Box>
									))}
								</Flex>
								<Flex mt='24px'>
									<CustomButton
										ml='auto'
										type='submit'
										styles={isNewDistributePrice ? 'main' : 'disabled'}
										isSubmiting={isSavingDistributePrice}
									>
										Approve
									</CustomButton>
								</Flex>
							</Box>
						)}
					</>
				)}
			</Box>
			<NextButton
				onClickHandler={() => {
					dispatch(setReleaseSelectedMenu(7));
				}}
			/>
		</Flex>
	);
};

export default SellDirectMenu;
