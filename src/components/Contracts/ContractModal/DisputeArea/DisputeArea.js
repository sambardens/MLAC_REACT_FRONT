import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

const DisputeArea = ({ handleDispute, setDisputeField, isLoading }) => {
	const [disputeText, setDisputeText] = useState('');
	const handleChange = e => {
		setDisputeText(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		handleDispute(disputeText);
		setDisputeText('');
	};
	return (
		<form onSubmit={handleSubmit}>
			<CustomTextarea
				label='Describe why you want to dispute the contract'
				placeholder='Enter text'
				name='text'
				value={disputeText}
				onChange={handleChange}
				maxW='100%'
			/>

			<Flex justify='flex-end' mt='16px'>
				<CustomButton styles={disputeText ? 'main' : 'disabled'} type='submit' isSubmiting={isLoading}>
					Save
				</CustomButton>
				<CustomButton
					styles='trasparent'
					onClickHandler={() => {
						setDisputeField(false);
					}}
					ml='16px'
				>
					Cancel
				</CustomButton>
			</Flex>
		</form>
	);
};

export default DisputeArea;
