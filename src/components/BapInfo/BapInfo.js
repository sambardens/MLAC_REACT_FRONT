import {
	Box,
	Flex,
	Icon,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import EditIcon from '@/assets/icons/base/edit.svg';
import PlusIcon from '@/assets/icons/base/plus.svg';

import CustomButton from '../Buttons/CustomButton';
import AddBapMemberModal from '../Modals/AddBapMemberModal';
import { membersMockData } from '../mockData/joinBAPmockData';

import { BrandKitTab } from './BrandKit/BrandKitTab';
import MainInfoEditing from './MainInfo/MainInfoEditing';
import { MainInfoTab } from './MainInfo/MainInfoTab';
import { MembersTab } from './Members/MembersTab';
import { EditSocialLinks } from './Social/EditSocialLinks';
import { SocialTab } from './Social/SocialTab';
import { Tracking } from './Tracking/Tracking';
import { poppins_500_18_27 } from '@/styles/fontStyles';

const titleTabsArr = [
	{ title: 'Main info', id: 1 },
	{ title: 'Members', id: 2 },
	{ title: 'Links', id: 3 },
	{ title: 'Brand kit', id: 4 },
	{ title: 'Tracking', id: 5 },
];

export const BapInfo = () => {
	const [activeTabId, setActiveTabId] = useState(titleTabsArr[0].id);
	const [showEditInfoComponent, setShowEditInfoComponent] = useState(false);
	const [showAddMemberModal, setShowAddMemberModal] = useState(false);
	const [showSocialEditComponent, setShowSocialEditComponent] = useState(false);
	const [trackingEditMode, setTrackingEditMode] = useState(false);
	const [pendingInvitations, setPendingInvitations] = useState([]);
	const { selectedBap } = useSelector(state => state.user);
	const [pendingReqsTrigger, setPendingReqsTrigger] = useState(false);
	const ref = useRef();
	const [isInFlow, setIsInFlow] = useState(true);

	const handleTabClick = id => {
		setActiveTabId(id);
	};

	const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		setShowEditInfoComponent(false);
		setShowAddMemberModal(false);
		setShowSocialEditComponent(false);
		setIsInFlow(false);
	}, [selectedBap.bapId]);

	useEffect(() => {
		setActiveTabId(titleTabsArr[0].id);
		setIsInFlow(true);
	}, [isInFlow]);

	const isShowSocialEdit = activeTabId === titleTabsArr[2].id && !showSocialEditComponent;
	const isShowMainEdit = activeTabId === titleTabsArr[0].id;
	const isTrackingTab = activeTabId === titleTabsArr[4].id;
	const isShowEdit = isShowSocialEdit || isShowMainEdit || isTrackingTab;
	const isShowBtnAddMember = activeTabId === titleTabsArr[1].id;

	const handleEdit = () => {
		if (isShowMainEdit) {
			setShowEditInfoComponent(true);
		} else if (isShowSocialEdit) {
			setShowSocialEditComponent(true);
		} else if (isTrackingTab) {
			setTrackingEditMode(true);
		}
	};

	return (
		<Box
			bg='bg.main'
			borderRadius='10px'
			h={`${viewportHeight - 115}px`}
			overflow={'hidden'}
			px='24px'
			py='24px'
			ref={ref}
		>
			{isInFlow && (
				<>
					{showAddMemberModal && (
						<AddBapMemberModal
							closeModal={() => setShowAddMemberModal(false)}
							setPendingReqsTrigger={setPendingReqsTrigger}
							pendingReqsTrigger={pendingReqsTrigger}
							pendingInvitations={pendingInvitations}
						/>
					)}
					{showEditInfoComponent ? (
						<MainInfoEditing setShowEditInfoComponent={setShowEditInfoComponent} />
					) : showSocialEditComponent ? (
						<EditSocialLinks setShowSocialEditComponent={setShowSocialEditComponent} />
					) : trackingEditMode ? (
						<Tracking trackingEditMode={trackingEditMode} setTrackingEditMode={setTrackingEditMode} />
					) : (
						<Tabs
							position='relative'
							variant='unstyled'
							isLazy={true}
							defaultIndex={activeTabId - 1}
							h='100%'
						>
							<TabList>
								{titleTabsArr?.map(({ title, id }) => {
									return (
										<Box key={id}>
											<Tab
												_selected={{ color: 'accent' }}
												sx={poppins_500_18_27}
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												onClick={() => handleTabClick(id)}
											>
												{title}
											</Tab>
										</Box>
									);
								})}
								{(selectedBap?.isCreator || selectedBap?.isFullAdmin) && (
									<>
										{isShowBtnAddMember && (
											<Box position='absolute' right='0' top='0px'>
												<CustomButton
													onClickHandler={() => {
														setShowAddMemberModal(true);
													}}
													w='191px'
												>
													<Icon as={PlusIcon} mr='8px' boxSize='24px' />
													Add member
												</CustomButton>
											</Box>
										)}
										{isShowEdit && (
											<Flex
												py='8px'
												px='12px'
												pos='absolute'
												right='0'
												top='0'
												as='button'
												cursor='pointer'
												onClick={handleEdit}
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
											>
												<Icon as={EditIcon} mr='8px' boxSize='24px' />
												<Text fontWeight='500' fontSize='16px'>
													Edit
												</Text>
											</Flex>
										)}
									</>
								)}
							</TabList>
							<TabIndicator mt='-1.5px' height='2px' bg='accent' borderRadius='1px' />
							<TabPanels h={'100%'} mt={'24px'}>
								<TabPanel p='0 24px 0 0' h={'calc(100% - 65px)'} overflow={'auto'}>
									<MainInfoTab />
								</TabPanel>
								<TabPanel p='0 24px 0 0' h={'calc(100% - 65px)'} overflow={'auto'}>
									<MembersTab
										membersMockData={membersMockData}
										setPendingReqsTrigger={setPendingReqsTrigger}
										pendingReqsTrigger={pendingReqsTrigger}
										setPendingInvitations={setPendingInvitations}
										pendingInvitations={pendingInvitations}
									/>
								</TabPanel>
								<TabPanel p={'0'} h={'calc(100% - 65px)'}>
									<SocialTab />
								</TabPanel>
								<TabPanel p={'0'} h={'calc(100% - 65px)'}>
									<BrandKitTab />
								</TabPanel>
								<TabPanel p={'0'} h={'calc(100% - 65px)'}>
									<Tracking trackingEditMode={trackingEditMode} setTrackingEditMode={setTrackingEditMode} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					)}
				</>
			)}
		</Box>
	);
};
