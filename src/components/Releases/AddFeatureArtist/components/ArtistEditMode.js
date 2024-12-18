import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import countries from '@/assets/countries.json';

const ArtistEditMode = ({
	selectedArtist,
	setSelectedArtist,
	onSave,
	onCancel,
	isDisabled,
	isNew = false,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSelectCountry = ({ value }) => {
		setSelectedArtist(prev => ({ ...prev, country: value }));
	};
	const handleChange = e => {
		const { value } = e.target;
		const normalizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
		setSelectedArtist(prev => ({ ...prev, soundCloudId: normalizedValue }));
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setIsLoading(true);
		await onSave();
		setIsLoading(false);
	};
	return (
		<form
			onSubmit={handleSubmit}
			style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}
		>
			<CustomSelect
				label='Country of the artist'
				options={countries.list}
				name='country'
				value={selectedArtist.country || ''}
				placeholder='Select'
				onChange={handleSelectCountry}
			/>
			<Box>
				<CustomInput
					value={selectedArtist.soundCloudId || ''}
					label='Soundcloud name'
					onChange={handleChange}
					name='soundCloudId'
					placeholder='Enter name'
				/>
				<Text
					fontSize='16px'
					fontWeight='400'
					color={selectedArtist.soundCloudId ? 'black' : 'secondary'}
					mt='4px'
					pl='12px'
				>
					https://soundcloud.com/
					<Text as='span' color='accent'>
						{selectedArtist.soundCloudId ? selectedArtist.soundCloudId : 'name'}
					</Text>
				</Text>
			</Box>
			<Flex>
				<CustomButton
					styles={isDisabled ? 'disabled' : 'main'}
					ml='auto'
					isSubmiting={isLoading}
					type='submit'
				>
					{isNew ? 'Add' : 'Edit'}
				</CustomButton>
				<CustomButton styles='transparent' ml='16px' onClickHandler={onCancel}>
					Cancel
				</CustomButton>
			</Flex>
		</form>
	);
};

export default ArtistEditMode;
