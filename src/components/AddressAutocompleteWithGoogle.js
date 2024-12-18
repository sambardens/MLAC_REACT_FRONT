// import { Box, Flex } from '@chakra-ui/react';

// import { useEffect, useState } from 'react';
// import useOnclickOutside from 'react-cool-onclickoutside';
// import Highlighter from 'react-highlight-words';
// import getKeyWordsFromString from 'src/functions/utils/getKeyWordsFromString';
// import usePlacesAutocomplete from 'use-places-autocomplete';

// import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

// const AddressAutocompleteWithGoogle = ({ address, setAddress }) => {
// 	const [keyWords, setKeyWords] = useState([]);

// 	const {
// 		suggestions: { status, data },
// 		setValue,
// 		init,
// 		clearSuggestions,
// 	} = usePlacesAutocomplete({
// 		initOnMount: false,
// 		debounce: 300,
// 	});

// 	useEffect(() => {
// 		init();
// 	}, [init]);

// 	const ref = useOnclickOutside(() => {
// 		clearSuggestions();
// 	});

// 	const handleSelect =
// 		({ description }) =>
// 		() => {
// 			setAddress(description);
// 			setValue(description, false);
// 			clearSuggestions();
// 		};

// 	const handleChange = e => {
// 		const { value } = e.target;
// 		const keyWordsFromUserInput = getKeyWordsFromString(value);
// 		setKeyWords(keyWordsFromUserInput);
// 		setAddress(value);
// 		setValue(value);
// 	};

// 	const renderSuggestions = () =>
// 		data.map(suggestion => {
// 			const { place_id, description } = suggestion;

// 			return (
// 				<Box
// 					as='li'
// 					key={place_id}
// 					onClick={handleSelect(suggestion)}
// 					cursor='pointer'
// 					px='12px'
// 					py='8px'
// 					borderBottom='1px solid #E2E8F0'
// 					_hover={{ bg: '#47A9DA', color: '#fff' }}
// 					transition='0.3s linear'
// 					h='auto'
// 				>
// 					<Highlighter
// 						searchWords={keyWords}
// 						autoEscape
// 						textToHighlight={description}
// 						highlightStyle={{
// 							backgroundColor: 'transparent',
// 							fontWeight: '400',
// 							fontWeight: '16px',
// 							fontFamily: 'Poppins',
// 						}}
// 						activeStyle={{ backgroundColor: 'yellow' }}
// 					/>
// 				</Box>
// 			);
// 		});

// 	return (
// 		<Box>
// 			<Flex position='relative' w='100%' ref={ref}>
// 				<CustomTextarea
// 					label='Address'
// 					placeholder='Start typing address here...'
// 					name='text'
// 					value={address}
// 					onChange={handleChange}
// 					minH='80px'
// 				/>

// 				{status === 'OK' && (
// 					<Box
// 						as='ul'
// 						position='absolute'
// 						top='110px'
// 						zIndex='20'
// 						bgColor='white'
// 						border='2px solid'
// 						borderColor='stroke'
// 						borderRadius='10px'
// 						w='100%'
// 						overflow='hidden'
// 					>
// 						{renderSuggestions()}
// 					</Box>
// 				)}
// 			</Flex>
// 		</Box>
// 	);
// };

// export default AddressAutocompleteWithGoogle;
