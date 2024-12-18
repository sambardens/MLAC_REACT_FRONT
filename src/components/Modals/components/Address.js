import { Flex } from '@chakra-ui/react';

import { useState } from 'react';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import countries from '@/assets/countries.json';

export const Address = ({
	values,
	handleChange,
	handleBlur,
	errors,
	touched,
	handleFocus,
	isTitle = false,
}) => {
	const [regions, setRegions] = useState([]);
	const handleChangeZipCode = event => {
		const inputValue = event.target.value;
		const alphanumericValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Оставить только буквы и цифры
		handleChange({ target: { name: 'postCodeZipCode', value: alphanumericValue } });
	};

	const getRegions = (countryCode, firstRender) => {
		if (countryCode && (firstRender || countryCode !== values.country)) {
			const selectedCountry = countries.list.find(el => el.value === countryCode);
			if (selectedCountry) {
				const regionsList = selectedCountry.state.map(el => ({
					id: el.state_code,
					label: el.state_name,
					value: el.state_code,
				}));
				setRegions(regionsList);
			} else {
				setRegions([]);
			}
		} else {
			setRegions([]);
		}
	};

	const handleSelectCountry = e => {
		const countryCode = e?.value || '';
		// getRegions(countryCode);
		// if (countryCode !== values.country) {
		// 	handleChange({ target: { name: 'regionState', value: '' } });
		// }
		handleChange({ target: { name: 'country', value: countryCode || '' } });
	};

	// const handleSelectRegion = e => {
	// 	handleChange({ target: { name: 'regionState', value: e?.value || '' } });
	// };

	// useEffect(() => {
	// 	getRegions(values.country, true);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	return (
		<Flex flexDir={'column'} gap={'12px'}>
			{/* {isTitle && (
				<Text fontSize={'16px'} fontWeight={'500'} color='black' pl='12px'>
					Enter your address
				</Text>
			)} */}

			<CustomInput
				label={`Street address line 1${errors.streetAddressOne ? '*' : ''}`}
				type='text'
				name='streetAddressOne'
				value={values.streetAddressOne}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder='Enter your first street address'
				isInvalid={errors.streetAddressOne && touched.streetAddressOne}
			/>
			<CustomInput
				label='Street address line 2'
				type='text'
				name='streetAddressTwo'
				value={values.streetAddressTwo}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder='Enter your house number'
				isInvalid={errors.streetAddressTwo && touched.streetAddressTwo}
			/>
			<CustomInput
				label={`City${errors.city ? '*' : ''}`}
				type='text'
				name='city'
				value={values.city}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder='Enter your city'
				isInvalid={errors.city && touched.city}
			/>
			{/* <CustomSelect
				label='Region/State'
				options={regions}
				name='regionState'
				value={values.regionState}
				placeholder='Select your region/state'
				onChange={handleSelectRegion}
				onBlur={handleBlur}
				onFocus={handleFocus}
				hControl='fit-content'
				isClearable
				isInvalid={errors.regionState && touched.regionState}
			/> */}
			<CustomInput
				label='Region/State'
				type='text'
				name='regionState'
				value={values.regionState}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder='Enter your region/state'
				isInvalid={errors.regionState && touched.regionState}
			/>
			<CustomInput
				label='Post Code/Zip Code'
				type='text'
				name='postCodeZipCode'
				value={values.postCodeZipCode}
				onChange={handleChangeZipCode}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder='Enter your post code/zip Code'
				isInvalid={errors.postCodeZipCode && touched.postCodeZipCode}
				maxLength={8}
			/>
			<CustomSelect
				label={`Country${errors.country ? '*' : ''}`}
				options={countries.list}
				name='country'
				value={values.country}
				placeholder='Select your country'
				onChange={handleSelectCountry}
				onBlur={handleBlur}
				onFocus={handleFocus}
				hControl='fit-content'
				isClearable
				isInvalid={errors.country && touched.country}
			/>
		</Flex>
	);
};
