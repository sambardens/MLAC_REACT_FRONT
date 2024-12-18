import { Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';

import CustomButton from '@/components/Buttons/CustomButton';

import CustomModal from '../CustomModal';
import { JoinVariant } from '../components/JoinVariant';

const mockData = [
	{
		id: 3,
		title: 'Create new B.A.P.',
		text:
			'Create a private workspace and invite your bandmates and collaborators to join you. Add music to distribute, sell or promote.',
	},
	{
		id: 2,
		title: 'Join existing B.A.P.',
		text: 'If you have received an invite to join a B.A.P. click here',
	},
];

export const NewBapModal = ({ setCurrentModal, cancelHandler }) => {
	const [selectedOptions, setSelectedOptions] = useState(3);

	return (
		<CustomModal
			closeModal={() => cancelHandler()}
			closeOnOverlayClick={false}
			maxW='594px'
			h='455px'
		>
			<Flex flexDir={'column'} justifyContent={'space-between'} alignItems='start' w={'100%'} h='100%'>
				<Text fontSize={'32px'} fontWeight='600' mb='24px'>
					New B.A.P.
				</Text>
				{/* <Text mt='24px' fontSize={'16px'} fontWeight={'400'} color='secondary'>
					Choose how you want to add a new B.A.P (band/artist/project)
				</Text> */}

				<JoinVariant
					item={mockData[0]}
					key={mockData[0]?.id}
					handler={setSelectedOptions}
					selectedOptions={selectedOptions}
					mt={'24px'}
				/>
				<JoinVariant
					item={mockData[1]}
					key={mockData[1]?.id}
					handler={setSelectedOptions}
					selectedOptions={selectedOptions}
					mt={'8px'}
				/>

				<Flex alignItems={'center'} justifyContent={'end'} mt={'24px'} w='100%'>
					<CustomButton rightIcon={true} onClickHandler={() => setCurrentModal(selectedOptions)}>
						Next
					</CustomButton>
				</Flex>
			</Flex>
		</CustomModal>
	);
};
