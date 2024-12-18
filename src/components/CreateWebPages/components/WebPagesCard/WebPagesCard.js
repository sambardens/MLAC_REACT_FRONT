import Image from 'next/image';
import { useRouter } from 'next/router';

import { Box, Flex, Heading, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getWebPath from 'src/functions/utils/web-pages/getWebPath';
import { dropMenuSelectors } from 'store/dropMenu';
import { setDropMenu } from 'store/dropMenu/dropMenu-slice';
import {
	deleteLandingPageInBap,
	deleteLandingPageInRelease,
	deleteShopInBap,
} from 'store/operations';
import { setLandingPage } from 'store/slice';

import DeleteModal from '@/components/Modals/DeleteModal';
import CopyToClipboardButton from '@/components/Modals/components/CopyToClipboardButton';

import EditIcon from '@/assets/icons/base/edit.svg';
import MoreIcon from '@/assets/icons/base/more.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

const WebPagesCard = ({ web, h = '120px', mt, alt, webType }) => {
	const { selectedBap } = useSelector(state => state.user);
	const { pathname, push } = useRouter();
	const dropMenu = useSelector(dropMenuSelectors.getDropMenu);
	const isReleases = pathname.includes('/releases');
	const isWebPages = pathname.includes('/web-pages');
	const popupRef = useRef(null);
	const dispatch = useDispatch();
	const toast = useToast();
	const [isDeleteWebModal, setIsDeleteWebModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	useEffect(() => {
		const handleClickOutside = e => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				dispatch(setDropMenu(false));
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [dispatch]);

	const handleCloseDropMenu = e => {
		e.stopPropagation();
		dispatch(setDropMenu(false));
	};
	const handleShowDropMenu = (e, web) => {
		e.stopPropagation();
		dispatch(setDropMenu({ webId: web?.id }));
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		if (webType === 'landing') {
			let isLandingDeleted;
			if (isReleases) {
				isLandingDeleted = await dispatch(deleteLandingPageInRelease(web.id));
			} else {
				isLandingDeleted = await dispatch(deleteLandingPageInBap(web.id));
			}
			if (isLandingDeleted?.payload?.success) {
				getToast('success', 'Success', 'Landing page has been deleted');
			} else {
				getToast('error', 'Error', 'Landing page has not been deleted. Try again later');
			}
		} else if (webType === 'shop') {
			const isShopDeleted = await dispatch(deleteShopInBap(web.id));

			if (isShopDeleted?.payload?.success) {
				getToast('success', 'Success', 'Shop has been deleted');
			} else {
				getToast('error', 'Error', 'Shop has not been deleted. Try again later');
			}
		}
		setIsDeleting(false);
	};

	const handleEdit = e => {
		if (webType === 'landing') {
			const path = getWebPath(webType, web.webpagesTypeId);
			dispatch(setLandingPage(null));
			if (isReleases) {
				push({
					pathname: `/bap/[bapId]/releases/[releaseId]/${path}/[landingId]`,
					query: { bapId: selectedBap.bapId, releaseId: web.releaseId, landingId: web.id },
				});
			} else if (isWebPages) {
				push({
					pathname: `/bap/[bapId]/web-pages/[releaseId]/${path}/[landingId]`,
					query: { bapId: selectedBap.bapId, releaseId: web.releaseId, landingId: web.id },
				});
			}
		} else if (webType === 'shop') {
			push({
				pathname: '/bap/[bapId]/web-pages/edit-shop/[shopName]',
				query: { bapId: selectedBap.bapId, shopName: web.name },
			});
		}
		handleCloseDropMenu(e);
	};

	const getText = () => {
		if (webType === 'landing') {
			if (web.webpagesTypeId === 1) return 'Download landing page';
			if (web.webpagesTypeId === 2) return 'Sell Landing page';
			if (web.webpagesTypeId === 3) return 'Landing page with streaming links';
		}
		return `${web?.name}`;
	};

	const handleCardSelection = () => {
		if (webType === 'shop') {
			const newPath = `/music/shop/${web.name}`;
			window.open(newPath, '_blank');
		} else {
			const newPath = `/music/${web.name}`;
			window.open(newPath, '_blank');
		}
	};

	const getLink = () => {
		if (webType === 'shop') {
			return `${process.env.NEXT_PUBLIC_FRONT_URL}/music/shop/${web.name}`;
		}
		return `${process.env.NEXT_PUBLIC_FRONT_URL}/music/${web.name}`;
	};

	const src = web?.releaseLogo || '/assets/images/shop-logo.png';

	return (
		<>
			{isDeleteWebModal && (
				<DeleteModal
					closeModal={() => {
						setIsDeleteWebModal(false);
					}}
					deleteHandler={handleDelete}
					title={`Delete ${webType}`}
					text={`Are you sure you want to delete ${webType} ${web.name}?`}
					description={'Once deleted, it cannot be restored'}
					isLoadingDelete={isDeleting}
				/>
			)}
			<Flex
				align='center'
				h={h}
				mt={mt}
				bg='bg.main '
				pos='relative'
				borderRadius='10px'
				overflow='hidden'
			>
				<Flex
					onClick={handleCardSelection}
					as='button'
					minW='197px'
					h='100%'
					bg='bg.light'
					align='center'
					justify='center'
					pos='relative'
					cursor='pointer'
				>
					<Image
						src={src}
						alt={alt}
						fill
						style={{ objectFit: web?.releaseLogo ? 'cover' : 'initial' }}
						sizes='197px'
					/>
				</Flex>

				<Box position={'absolute'} top='12px' right='0'>
					<IconButton
						icon={<MoreIcon />}
						boxSize='24px'
						onClick={e =>
							dropMenu && dropMenu?.webId === web?.id ? handleCloseDropMenu(e) : handleShowDropMenu(e, web)
						}
						color={dropMenu && dropMenu?.webId === web?.id ? 'accent' : 'secondary'}
						_hover={{ color: 'accent' }}
						transition='0.3s linear'
					/>
				</Box>

				{dropMenu && dropMenu?.webId === web?.id && (
					<Box
						position={'absolute'}
						top='40px'
						right='8px'
						boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)'
						borderRadius='6px'
						bgColor='bg.main'
						ref={popupRef}
						zIndex={50}
					>
						<Flex
							as='button'
							cursor='pointer'
							onClick={e => handleEdit(e)}
							w='100%'
							py='8px'
							px='12px'
							color='secondary'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
						>
							<Icon as={EditIcon} mr='10px' boxSize='24px' />
							<Text fontWeight='500' fontSize='16px'>
								Edit
							</Text>
						</Flex>

						<Flex
							as='button'
							cursor='pointer'
							onClick={() => setIsDeleteWebModal(true)}
							py='8px'
							px='12px'
							color='secondary'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
						>
							<Icon as={TrashIcon} mr='10px' boxSize='24px' />
							<Text fontWeight='500' fontSize='16px'>
								Delete
							</Text>
						</Flex>
					</Box>
				)}
				<Flex px='24px' justify='center' flexDir='column'>
					<Heading as='h4' mb='4px' fontSize='16px' fontWeight='400' color='black'>
						{getText()}
					</Heading>
					<Flex fontSize='14px' fontWeight='400'>
						<CopyToClipboardButton value={getLink()} type='webLink' mt={'4px'} />
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};

export default WebPagesCard;
