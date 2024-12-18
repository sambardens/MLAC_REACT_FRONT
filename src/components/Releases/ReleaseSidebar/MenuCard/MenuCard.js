import { Flex, Icon, Text } from '@chakra-ui/react';

import React from 'react';

import checkMenuIcon from '@/assets/icons/releases-contracts/check-menu.svg';

const MenuCard = ({ title, isSelected, isValid, onClick, isAvalaible }) => (
	<Flex
		w='100%'
		justify='space-between'
		align='center'
		h='56px'
		borderBottom={'2px solid'}
		borderColor={isSelected ? 'accent' : 'transparent'}
		px='16px'
		onClick={onClick}
		cursor={isAvalaible ? 'pointer' : 'not-allowed'}
		color={isSelected ? 'accent' : 'secondary'}
		_hover={{ color: 'accent' }}
		transition='0.2s linear'
	>
		<Text fontSize='16px' fontWeight='500'>
			{title}
		</Text>
		{isValid && (
			<Icon as={checkMenuIcon} boxSize='24px' color={isSelected ? 'accent' : 'secondary'} />
		)}
	</Flex>
);

export default MenuCard;
