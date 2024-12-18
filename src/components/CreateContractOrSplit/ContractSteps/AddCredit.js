import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
// import getCreditTypes from 'src/functions/serverRequests/splits/getCreditTypes';
import getCreditsInfo from 'src/functions/serverRequests/splits/getCreditsInfo';

import NextButton from '@/components/Buttons/NextButton/NextButton';

import CreditSelect from '../CreditSelect/CreditSelect';

const creditTypes = [
	{
		id: 2,
		label: 'Composer',
		value: 'Composer',
	},
	{
		id: 3,
		label: 'Lyricist',
		value: 'Lyricist',
	},
	{
		id: 4,
		label: 'Producer',
		value: 'Producer',
	},
	{
		id: 5,
		label: 'Remixer',
		value: 'Remixer',
	},
];

const AddCredit = ({ setIsModal, splitTracks, setSplitTracks }) => {
	const [creditsIsReady, setCreditsIsReady] = useState(false);
	const { selectedSplit } = useSelector(state => state.user.selectedRelease);
	const axiosPrivate = useAxiosPrivate();
	// useEffect(() => {
	// 	const getTypes = async () => {
	// 		const types = await getCreditTypes();
	//     console.log('types: ', types);
	// 		const options = types.filter(type => type.name !== 'No Credit').map(type => ({
	// 			id: type.id,
	// 			label: type.name,
	// 			value: type.name,
	// 		}));
	// 		setOptions(options);
	// 	};
	// 	getTypes();
	// }, []);

	useEffect(() => {
		if (selectedSplit?.splitId && creditTypes.length > 0) {
			const getCredits = async () => {
				const data = {
					splitId: selectedSplit.splitId,
					splitUsers: selectedSplit.splitUsers,
					splitTracks,
				};
				const res = await getCreditsInfo(data, axiosPrivate);
				if (res) {
					setSplitTracks(res.splitTracks);
					setCreditsIsReady(true);
				}
			};

			getCredits(selectedSplit?.splitId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSplit?.splitId, creditTypes.length]);

	const filteredTracks = splitTracks.filter(el => el.selected);
	return (
		<Flex flexDir='column' h='100%' justify='space-between'>
			<Flex as='ul' flexDir='column' gap='4px'>
				{creditsIsReady &&
					filteredTracks.map((el, i) => {
						return (
							<Flex
								as='li'
								key={el.id}
								p='12px'
								bg='bg.light'
								w='50%'
								minW='580px'
								justifyContent='space-between'
								alignItems='center'
								borderRadius='14px'
							>
								<Box borderRadius='10px' bgColor='#fff' p='20px' w='100%'>
									<Text mb='10px'>{el.name}</Text>

									<CreditSelect
										track={el}
										options={creditTypes}
										setSplitTracks={setSplitTracks}
										splitTracks={splitTracks}
										isLast={i === filteredTracks.length - 1}
										tracksNumber={filteredTracks.length}
									/>
								</Box>
							</Flex>
						);
					})}
			</Flex>
			<NextButton
				onClickHandler={() => {
					setIsModal(true);
				}}
			/>
		</Flex>
	);
};

export default AddCredit;
