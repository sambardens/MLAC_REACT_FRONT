import { Flex, Heading, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomModal from '@/components/Modals/CustomModal';

import CustomButton from '../Buttons/CustomButton';

const TransformContractModal = ({ setIsModal, onClickHandler, editMode }) => {
	const { isLoading } = useSelector(state => state.user);
	const [styles, setStyles] = useState('disabled');
	const [seconds, setSeconds] = useState(5);

	useEffect(() => {
		let interval;
		if (styles === 'disabled') {
			interval = setInterval(() => {
				setSeconds(prevSeconds => prevSeconds - 1);
			}, 1000);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [styles]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setStyles('main');
		}, 5000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<CustomModal
			maxW='692px'
			closeModal={() => {
				setIsModal(false);
			}}
		>
			<Heading fontSize='32px' fontWeight='600' mb='24px'>
				{editMode ? 'Edit contract' : 'Recreate the contract'}
			</Heading>
			<Text fontSize='18px' fontWeight='500' color='black' mb='8px'>
				Are you sure you want to change the terms of the {!editMode && 'active'} contract?
			</Text>

			<Text fontSize='16px' fontWeight='400' color='secondary' mb='24px'>
				{editMode
					? 'Some of the participants have already signed the contract, in case of changes it will need to be resigned again by all participants'
					: 'Until the signing of a new contract, funds from the sale of these tracks will be distributed according to the terms of the old contract'}
			</Text>
			<Flex justify='flex-end'>
				<CustomButton styles={styles} onClickHandler={onClickHandler} isSubmiting={isLoading}>
					{editMode ? 'Edit' : 'Recreate'} {seconds > 0 && `(${seconds})`}
				</CustomButton>
				<CustomButton
					styles={'light'}
					ml='16px'
					onClickHandler={() => {
						setIsModal(false);
					}}
				>
					Cancel
				</CustomButton>
			</Flex>
		</CustomModal>
	);
};

export default TransformContractModal;
