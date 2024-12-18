import { Flex, Text } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const StepsMenu = ({ currentStep, setCurrentStep, steps }) => {
	const { selectedLandingPage } = useSelector(state => state.user);
	// const webpagesTypeId = selectedLandingPage?.webpagesTypeId;
	// const handleSetCurrentStep = index => {
	// 	if (webpagesTypeId !== 3 && index === 1) {
	// 		setCurrentStep(2);
	// 	} else {
	// 		setCurrentStep(index);
	// 	}
	// };

	const handleSetCurrentStep = index => {
		setCurrentStep(index);
	};
	const getBorderColor = index => {
		// let step = currentStep;
		// if (webpagesTypeId !== 3 && index === 1 && currentStep === 2) {
		// 	step = 1;
		// }
		return currentStep === index ? 'accent' : 'transparent';
	};

	return (
		<Flex as='ul' bg='bg.main' borderRadius='10px' mx='12px' w='calc(100% - 24px)' p='12px' mb='16px'>
			{steps.map((step, i) => (
				<Flex
					as='li'
					key={nanoid()}
					borderBottom='2px solid'
					h='56px'
					borderColor={getBorderColor(i)}
					w={`${100 / steps.length}%`}
					onClick={() => {
						handleSetCurrentStep(i);
					}}
					align='center'
					justify='center'
					cursor='pointer'
				>
					<Text fontWeight='500' fontSize='18px' color={currentStep === i ? 'accent' : 'black'}>
						{step}
					</Text>
				</Flex>
			))}
		</Flex>
	);
};

export default StepsMenu;
