import Image from 'next/image';
import { useRouter } from 'next/router';

import { Box, Flex, Heading, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getWebPath from 'src/functions/utils/web-pages/getWebPath';
import { dropMenuSelectors } from 'store/dropMenu';
import { setDropMenu } from 'store/dropMenu/dropMenu-slice';
import { deleteLandingPageInBap, deleteShopInBap } from 'store/operations';

import DeleteModal from '@/components/Modals/DeleteModal';
import CopyToClipboardButton from '@/components/Modals/components/CopyToClipboardButton';

import EditIcon from '@/assets/icons/base/edit.svg';
import MoreIcon from '@/assets/icons/base/more.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

const WebpageCard = ({ web, mt, alt, webType, p = '0 12px' }) => {
	const { selectedBap } = useSelector(state => state.user);
	const { push } = useRouter();
	const dropMenu = useSelector(dropMenuSelectors.getDropMenu);
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
			const isLandingDeleted = await dispatch(deleteLandingPageInBap(web.id));
			if (isLandingDeleted?.payload?.success) {
				getToast('success', 'Success', 'The landing page has been deleted.');
			} else {
				getToast('error', 'Error', 'The landing page has not been deleted. Please try again.');
			}
		} else if (webType === 'shop') {
			const isShopDeleted = await dispatch(deleteShopInBap(web.id));

			if (isShopDeleted?.payload?.success) {
				getToast('success', 'Success', 'The shop has been deleted.');
			} else {
				getToast('error', 'Error', 'The shop has not been deleted. Please try again.');
			}
		}
		setIsDeleting(false);
	};

	const handleEdit = e => {
		if (webType === 'landing') {
			const path = getWebPath(webType, web.webpagesTypeId);
			push({
				pathname: `/bap/[bapId]/web-pages/[releaseId]/${path}/[landingId]`,
				query: { bapId: selectedBap.bapId, releaseId: web.releaseId, landingId: web.id },
			});
		} else if (webType === 'shop') {
			push({
				pathname: '/bap/[bapId]/web-pages/edit-shop/[shopName]',
				query: { bapId: selectedBap.bapId, shopName: web.name },
			});
		}
		handleCloseDropMenu(e);
	};

	const handleCardSelection = () => {
		if (webType === 'shop') {
			const newPath = `/music/shop/${web.name}`;
			window.open(newPath, '_blank');
		}

		if (webType === 'landing') {
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
			<Flex as='li' pos='relative' align='center' mt={mt} p={p} w='100%' bg='bg.main'>
				<Flex
					onClick={handleCardSelection}
					as='button'
					minW='197px'
					h='140px'
					bg='bg.light'
					align='center'
					justify='center'
					pos='relative'
					borderLeftRadius='10px'
					overflow='hidden'
				>
					<Image
						src={src}
						alt={alt}
						fill
						sizes='197px'
						style={{ objectFit: web?.releaseLogo ? 'cover' : 'initial' }}
					/>
				</Flex>

				<Flex
					flexDir={'column'}
					alignItems={'start'}
					w={'100%'}
					ml='12px'
					flexGrow={'1'}
					fontSize='14px'
					fontWeight='400'
					mt='8px'
				>
					<Heading as='h4' mb='4px' fontSize='16px' fontWeight='400'>
						{web?.name}
					</Heading>
					<CopyToClipboardButton
						value={getLink()}
						type='webLink'
						linkW='100%'
						placeholder={'Copy link'}
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
					>
						<Flex
							as='button'
							cursor='pointer'
							onClick={handleEdit}
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
			</Flex>
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
		</>
	);
};

export default WebpageCard;
