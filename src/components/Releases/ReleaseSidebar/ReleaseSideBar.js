import { Box, Heading } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import MenuCard from './MenuCard/MenuCard';

const ReleaseSidebar = ({
	handleSelectMenu,
	isPriceMenuValid,
	isTrackMenuValid,
	isFirstMenuValid,
	isDealsMenuValid,
	isWebpagesMenuValid,
	isCreditMenuValid,
	isSpotifyRelease,
	isDealsMenu,
}) => {
	const { releaseSelectedMenu, selectedRelease } = useSelector(state => state.user);
	const title = isFirstMenuValid ? 'Edit release' : 'New release';
	const showWebpagesMenu =
		!selectedRelease.isDuplicate && (isSpotifyRelease ? isFirstMenuValid : isDealsMenuValid);
	return (
		<Box
			w='240px'
			minW='240px'
			pr='20px'
			py='24px'
			borderRight='4px solid'
			borderColor='bg.secondary'
		>
			<Heading color='black' fontSize='18px' fontWeight='500' pl='16px' mb='24px' lineHeight='1.5'>
				{title}
			</Heading>
			<Box bgColor='bg.main'>
				<MenuCard
					title='Title & artwork'
					isSelected={releaseSelectedMenu === 1}
					isValid={isFirstMenuValid}
					onClick={() => {
						handleSelectMenu(1);
					}}
					isAvalaible={true}
				/>

				<MenuCard
					title='Add tracks'
					isSelected={releaseSelectedMenu === 2}
					isValid={isTrackMenuValid}
					onClick={() => {
						handleSelectMenu(2);
					}}
					isAvalaible={isFirstMenuValid}
				/>

				{isDealsMenu && (
					<MenuCard
						title='Add splits'
						isSelected={releaseSelectedMenu === 3}
						isValid={isDealsMenuValid}
						onClick={() => {
							handleSelectMenu(3);
						}}
						isAvalaible={true}
					/>
				)}
				{isDealsMenuValid && (
					<MenuCard
						title='Add credits'
						isSelected={releaseSelectedMenu === 4}
						isValid={isCreditMenuValid}
						onClick={() => {
							handleSelectMenu(4);
						}}
						isAvalaible={true}
					/>
				)}
				{isDealsMenuValid && (
					<MenuCard
						title='Distribute'
						isSelected={releaseSelectedMenu === 5}
						isValid={false}
						onClick={() => {
							handleSelectMenu(5);
						}}
						isAvalaible={isCreditMenuValid}
					/>
				)}

				{isDealsMenuValid && (
					<MenuCard
						title='Set price'
						isSelected={releaseSelectedMenu === 6}
						isValid={isPriceMenuValid}
						onClick={() => {
							handleSelectMenu(6);
						}}
						isAvalaible={true}
					/>
				)}
				{showWebpagesMenu && (
					<MenuCard
						title={'Web pages & shop'}
						isSelected={releaseSelectedMenu === 7}
						isValid={isWebpagesMenuValid}
						onClick={() => {
							handleSelectMenu(7);
						}}
						isAvalaible={true}
					/>
				)}
				{/* {isDealsMenuValid && (
				<MenuCard
					title='Press / PR'
					isSelected={releaseSelectedMenu === 7}
					isValid={false}
					onClick={() => {
						handleSelectMenu(7);
					}}
					isAvalaible={true}
				/>
			)} */}
			</Box>
		</Box>
	);
};

export default ReleaseSidebar;
