import { Flex, Image, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const BapCard = ({ mt, bap, isSelected = false, isMenuWide = true, bapSelectHandler }) => {
	const [bapImage, setBapImage] = useState('');
	const bapName = bap?.bapName;

	// const getBapAbbreviation = () => {
	// 	const bapNameCapital = bapName.toUpperCase();
	// 	const words = bapNameCapital.split(' ');
	// 	const abbreviations = words.map(w => w[0]).join('');

	// 	return `${abbreviations}`;
	// };
	const handleOnError = e => {
		if (!e.target.src.includes('/assets/images/logo-white.png')) {
			setBapImage('/assets/images/logo-white.png');
		}
	};

	const isDefaultImage = bapImage === '/assets/images/logo-primary.png';
	useEffect(() => {
		setBapImage(bap?.srcMin || bap?.src);
	}, [bap?.src, bap?.srcMin]);

	const wideMenuStyle = isDefaultImage ? 'initial' : 'cover';
	const wideMenuWidth = isDefaultImage ? '160px' : '192px';
	const wideMenuHeight = isDefaultImage ? '90px' : '100px';
	return (
		<Flex
			as='li'
			justifyContent={'center'}
			alignItems={'center'}
			mt={mt}
			h={isMenuWide ? wideMenuHeight : '64px'}
			w={isMenuWide ? '192px' : '64px'}
			minH={isMenuWide ? '100px' : '64px'}
			cursor='pointer'
			transition='height 0.3s linear, width 0.3s linear'
			pos='relative'
			borderRadius='14px'
			overflow='hidden'
			bgColor={isDefaultImage ? 'bg.main' : 'transparent'}
			boxShadow={isSelected ? '0 0 0 4px #FF0151' : '0 0 2px #ffffff'}
			onClick={() => {
				bapSelectHandler && bapSelectHandler(bap);
			}}
		>
			{bapImage && (
				<Image
					src={bapImage}
					alt='logo'
					objectFit={isMenuWide ? wideMenuStyle : 'contain'}
					h={isMenuWide ? wideMenuHeight : '64px'}
					w={isMenuWide ? wideMenuWidth : '64px'}
					transition='height 0.3s linear, width 0.3s linear'
					onError={e => {
						handleOnError(e);
					}}
				/>
			)}

			{isMenuWide && (
				<Text
					w='100%'
					color='white'
					fontWeight='500'
					fontSize='16px'
					pos='absolute'
					top='50%'
					left='50%'
					transform='translate(-50%, -50%)'
					py='8px'
					bg={bapImage && 'gray'}
					textAlign='center'
				>
					{bap?.bapName}
				</Text>
			)}
		</Flex>
	);
};

export default BapCard;
