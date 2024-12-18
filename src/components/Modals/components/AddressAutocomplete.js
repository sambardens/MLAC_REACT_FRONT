// import { Box, Flex, FormControl, Text, Textarea } from '@chakra-ui/react';

// import axios from 'axios';
// import debounce from 'lodash.debounce';
// import { useCallback, useState } from 'react';
// import Highlighter from 'react-highlight-words';
// import getKeyWordsFromString from 'src/functions/utils/getKeyWordsFromString';

// import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

// const AddressAutocomplete = ({ address, setAddress }) => {
// 	const [searchResults, setSearchResults] = useState([]);
// 	const [keyWords, setKeyWords] = useState([]);
// 	const [isVariantsList, setIsVariantsList] = useState(false);

// 	const getAddressBySearch = async value => {
// 		try {
// 			const { data } = await axios.get(
// 				`https://nominatim.openstreetmap.org/search?q=${value}&format=json&limit=5`,
// 			);
// 			setSearchResults(data);
// 			setIsVariantsList(true);
// 			const keyWordsFromUserInput = getKeyWordsFromString(value);
// 			setKeyWords(keyWordsFromUserInput);
// 		} catch (error) {
// 			console.log('getSearchResulterror: ', error);
// 		}
// 	};
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	const debouncedSearchAddress = useCallback(
// 		debounce(value => getAddressBySearch(value), 1500),
// 		[],
// 	);

// 	const handleAddressSelection = adressArg => {
// 		setAddress(adressArg);
// 		setSearchResults([]);
// 		setIsVariantsList(false);
// 	};

// 	const handleChange = e => {
// 		const { value } = e.target;
// 		setAddress(value);
// 		if (value) {
// 			debouncedSearchAddress(value);
// 		}
// 	};

// 	const handleOnBlur = () => {
// 		setTimeout(() => setIsVariantsList(false), 100);
// 	};

// 	return (
// 		<Box>
// 			<Flex position={'relative'} w='100%'>
// 				<FormControl pos='relative'>
// 					<CustomTextarea
// 						type='text'
// 						value={address}
// 						onChange={handleChange}
// 						onBlur={() => {
// 							handleOnBlur();
// 						}}
// 						placeholder='Start typing address here...'
// 						scrollBehavior=''
// 						overflow='none'
// 						maxH='191px'
// 						resize='vertical'
// 					/>
// 				</FormControl>
// 				{isVariantsList && searchResults.length ? (
// 					<Box
// 						position={'absolute'}
// 						top='42px'
// 						zIndex='2'
// 						maxH='40vh'
// 						w='calc(100%)'
// 						bgColor={'white'}
// 						overflowY='scroll'
// 						border='1px solid'
// 						borderColor={'stroke'}
// 					>
// 						{searchResults.map(result => (
// 							<Text
// 								key={result.place_id}
// 								onClick={() => handleAddressSelection(result.display_name)}
// 								cursor='pointer'
// 								p='10px'
// 								borderBottom='1px solid #E2E8F0'
// 								_hover={{ bg: '#47A9DA', color: '#fff' }}
// 								h='auto'
// 								onBlur={() => {
// 									setIsVariantsList(false);
// 								}}
// 							>
// 								<Highlighter
// 									searchWords={keyWords}
// 									autoEscape
// 									textToHighlight={result.display_name}
// 									highlightStyle={{
// 										backgroundColor: 'transparent',
// 										fontWeight: 'bold',
// 									}}
// 								/>
// 							</Text>
// 						))}
// 					</Box>
// 				) : null}
// 			</Flex>
// 		</Box>
// 	);
// };

// export default AddressAutocomplete;
