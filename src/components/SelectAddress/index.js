import { Box, Flex } from '@chakra-ui/react';

import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import Highlighter from 'react-highlight-words';
import getKeyWordsFromString from 'src/functions/utils/getKeyWordsFromString';

import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

function AddressAutocomplete({ address, setAddress }) {
	const [searchResults, setSearchResults] = useState([]);
	const [keyWords, setKeyWords] = useState([]);
	const [isVariantsList, setIsVariantsList] = useState(false);

	// 	const getAddressBySearch = async value => {
	// 		try {
	// 			const { data } = await axios.get(
	// 				`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${value}&format=json&limit=5&accept-language=en`,
	// 			);
	// const res={id:data.place_id, address: data.display_name}
	// 			setSearchResults(res);
	// 			setIsVariantsList(true);
	// 			const keyWordsFromUserInput = getKeyWordsFromString(value);
	// 			setKeyWords(keyWordsFromUserInput);
	// 		} catch (error) {
	// 			console.log('getSearchResulterror: ', error);
	// 		}
	// 	};

	const getAddressBySearch = async value => {
		try {
			const { data } = await axios.get(
				`https://geocode.search.hereapi.com/v1/geocode?q=${value}&limit=5&apiKey=${process.env.NEXT_PUBLIC_HERE_API_KEY}&lang=en`,
			);
			setSearchResults(data.items);
			setIsVariantsList(true);
			const keyWordsFromUserInput = getKeyWordsFromString(value);
			setKeyWords(keyWordsFromUserInput);
		} catch (error) {
			console.log('getSearchResulterror: ', error);
		}
	};
	const debouncedSearchAddress = useCallback(async value => {
		getAddressBySearch(value);
	}, []);

	const handleAddressSelection = adressArg => {
		setAddress(adressArg);
		setSearchResults([]);
		setIsVariantsList(false);
	};

	const debouncedSearch = useMemo(() => {
		return debounce(debouncedSearchAddress, 500);
	}, [debouncedSearchAddress]);

	const handleChange = e => {
		const { value } = e.target;
		setAddress(value);
		if (value) {
			debouncedSearch(value);
		}
	};

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	return (
		<Box>
			<Flex position='relative' w='100%'>
				<CustomTextarea
					label='Address'
					placeholder='Start typing address here...'
					name='text'
					value={address}
					onChange={handleChange}
					minH='80px'
				/>

				{isVariantsList && searchResults.length ? (
					<Box
						as='ul'
						position='absolute'
						top='110px'
						zIndex='20'
						bgColor='white'
						border='2px solid'
						borderColor='stroke'
						borderRadius='10px'
						w='100%'
						overflow='hidden'
					>
						{searchResults.map(result => (
							<Box
								as='li'
								key={result.id}
								onClick={() => handleAddressSelection(result.address.label)}
								cursor='pointer'
								px='12px'
								py='8px'
								borderBottom='1px solid #E2E8F0'
								_hover={{ bg: '#47A9DA', color: '#fff' }}
								transition='0.3s linear'
								h='auto'
								// onBlur={() => {
								// 	setIsVariantsList(false);
								// }}
							>
								<Highlighter
									searchWords={keyWords}
									autoEscape
									textToHighlight={result.address.label}
									highlightStyle={{
										backgroundColor: 'transparent',
										fontWeight: '400',
										fontWeight: '16px',
										fontFamily: 'Poppins',
									}}
									activeStyle={{ backgroundColor: 'yellow' }}
								/>
							</Box>
						))}
					</Box>
				) : null}
			</Flex>
		</Box>
	);
}

export default AddressAutocomplete;
