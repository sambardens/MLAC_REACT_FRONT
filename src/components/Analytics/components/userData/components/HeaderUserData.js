import { Checkbox, Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import analyticsSelectors from 'store/analytics/analytics-selectors';
import { setTypeGoogleAnalytics } from 'store/analytics/analytics-slice';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

import UserIcon from '@/assets/icons/analytics/user.svg';

import { poppins_600_18_27 } from '@/styles/fontStyles';

const selectOptions = [
	{ id: 11, value: 'all', label: 'All analytics' },
	{ id: 12, value: 'shop', label: 'Analytics by shop' },
	{ id: 13, value: 'landing', label: 'Analytics by landing' },
];

export const HeaderUserData = () => {
	const dispatch = useDispatch();
	const type = useSelector(analyticsSelectors.getTypeGoogleAnalytics);

	const handleSelect = ({ value }) => {
		dispatch(setTypeGoogleAnalytics(value));
	};

	return (
		<Flex alignItems={'center'} justifyContent={'space-between'}>
			<Flex alignItems={'center'} gap={'8px'}>
				<UserIcon />
				<Text sx={poppins_600_18_27} color={'textColor.blue'}>
					User data
				</Text>
			</Flex>
			<CustomSelect
				options={selectOptions}
				name='type'
				value={type}
				placeholder='Select type'
				onChange={handleSelect}
				w={'405px'}
			/>
		</Flex>
	);
};
