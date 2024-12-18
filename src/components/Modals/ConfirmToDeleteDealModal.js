import { Flex, Heading, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomModal from '@/components/Modals/CustomModal';

import CustomButton from '../Buttons/CustomButton';

const ConfirmToDeleteDealModal = ({ setIsModal, onClickHandler, type }) => {
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
				Delete {type}
			</Heading>
			<Text fontSize='18px' fontWeight='500' color='black' mb='8px'>
				Are you sure you want to delete {type}?
			</Text>

			<Text fontSize='16px' fontWeight='400' color='secondary' mb='24px'>
				After you delete it, you will not be able to get it back
			</Text>
			<Flex justify='flex-end'>
				<CustomButton styles={styles} onClickHandler={onClickHandler} isSubmiting={isLoading}>
					Delete {seconds > 0 && `(${seconds})`}
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

export default ConfirmToDeleteDealModal;
