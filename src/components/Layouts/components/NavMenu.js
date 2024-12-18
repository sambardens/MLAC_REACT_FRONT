import { Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import StrokeUnderline from '@/components/Underlines/StrokeUnderline';

import MySplitsAndContractsIcon from '@/assets/icons/dropdown-menu/contract.svg';
import MyIncomeIcon from '@/assets/icons/dropdown-menu/income.svg';
import MyProfileIcon from '@/assets/icons/dropdown-menu/profile.svg';
import AnalyticsIcon from '@/assets/icons/navMenu/analytics.svg';
import BapInfoIcon from '@/assets/icons/navMenu/bap-info.svg';
import ContractsIcon from '@/assets/icons/navMenu/contracts.svg';
import DashboardIcon from '@/assets/icons/navMenu/dashboard.svg';
import IncomeIcon from '@/assets/icons/navMenu/income.svg';
import mlIcon from '@/assets/icons/navMenu/mailing-list.svg';
import ReleasesIcon from '@/assets/icons/navMenu/releases.svg';
import WebPagesIcon from '@/assets/icons/navMenu/web-pages.svg';

import NavMenuItem from './NavMenuItem';

const fullMenu = [
	{
		menuName: '/dashboard',
		title: 'Dashboard',
		icon: DashboardIcon,
	},
	{
		menuName: '/releases',
		title: 'Releases',
		icon: ReleasesIcon,
	},
	{
		menuName: '/web-pages',
		title: 'Web pages',
		icon: WebPagesIcon,
	},
	{
		menuName: '/mailing-list',
		title: 'Mailing list',
		icon: mlIcon,
	},
	{
		menuName: '/splits-contracts',
		title: 'Splits & contracts',
		icon: ContractsIcon,
	},
	{
		menuName: '/income',
		title: 'Income',
		icon: IncomeIcon,
	},
	{
		menuName: '/analytics',
		title: 'Analytics',
		icon: AnalyticsIcon,
	},
	{
		menuName: '/bap-info',
		title: 'B.A.P. info',
		icon: BapInfoIcon,
	},
];

const shortMenu = [
	{
		menuName: '/my-profile',
		title: 'My profile',
		icon: MyProfileIcon,
	},
	{
		menuName: '/my-splits-contracts',
		title: 'My splits & contracts',
		icon: MySplitsAndContractsIcon,
	},

	{
		menuName: '/my-income',
		title: 'My income',
		icon: MyIncomeIcon,
	},
];

const NavMenu = ({ setIsStartPage, setIsUserProfileModal, isUserProfileModal }) => {
	const { selectedBap, baps } = useSelector(state => state.user);

	const getAccurateText = () => {
		if (selectedBap?.isNew) {
			return 'Creating new bap';
		}
		if (selectedBap?.bapName) {
			return selectedBap?.bapName;
		}
		// if (baps?.length > 0) {
		// 	return 'B.A.P. not selected';
		// }
		else {
			return '';
		}
	};
	const text = getAccurateText();
	const menuItems = baps?.length > 0 && selectedBap.bapId ? fullMenu : shortMenu;

	return (
		<Flex flexDir={'column'} minW='300px' h='100vh' p='24px'>
			<Image
				src='/assets/images/logo-primary.png'
				w='100px'
				h='56px'
				alt='Major Labl logo'
				mx='auto'
			/>

			<Tooltip
				hasArrow
				label={text?.length > 25 && text}
				placement='bottom'
				bg='bg.black'
				color='textColor.white'
				fontSize='16px'
				borderRadius={'5px'}
				left={'15px'}
			>
				<Text
					mt='30px'
					p='0px 8px'
					fontSize={'18px'}
					fontWeight={'600'}
					color={'black'}
					h='27px'
					maxWidth={'260px'}
					overflow={'hidden'}
					textOverflow={'ellipsis'}
					whiteSpace='nowrap'
					textAlign='center'
				>
					{text}
				</Text>
			</Tooltip>

			<StrokeUnderline isNotAccent={selectedBap?.bapName} />

			<Flex as='ul' flexDir='column' mt='16px'>
				{menuItems.map(({ menuName, title, icon }) => (
					<NavMenuItem
						key={title}
						menuName={menuName}
						title={title}
						icon={icon}
						setIsStartPage={setIsStartPage}
						isUserProfileModal={isUserProfileModal}
						setIsUserProfileModal={setIsUserProfileModal}
					/>
				))}
			</Flex>
		</Flex>
	);
};

export default NavMenu;
