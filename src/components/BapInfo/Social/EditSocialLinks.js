import Image from 'next/image';

import { Box, Flex, IconButton, ListItem, Text, Tooltip, UnorderedList, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from 'src/functions/utils/getIcon';
import { linksSelectors } from 'store/links';
import { changeBapSocialLinks } from 'store/links/links-operations';
import { setSelectedBapUpdated } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import LinkIcon from '@/assets/icons/base/link.svg';
import MoveIcon from '@/assets/icons/base/move.svg';
import TrashIcon from '@/assets/icons/base/trash.svg';
import AddSocialLinkIcon from '@/assets/icons/social/socialInfo/addSocialLink.svg';

import { poppins_600_18_27 } from '@/styles/fontStyles';

export const EditSocialLinks = ({ setShowSocialEditComponent }) => {
	const socialLinks = useSelector(linksSelectors.getSocialLinks);
	const [invalidLinks, setInvalidLinks] = useState([]);
	const [isLoadingSaveData, setIsLoadingSaveData] = useState(false);
	const [socialArr, setSocialArr] = useState(socialLinks);
	const [hoveredIndex, setHoveredIndex] = useState(-1);

	const dispatch = useDispatch();
	const toast = useToast();

	const { selectedBap, selectedBapUpdated } = useSelector(state => state.user);
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
	const checkIsValid = invalidLinks?.length === 0 && !socialArr?.some(obj => obj.social === '');

	const saveLinkHandler = async () => {
		if (!checkIsValid) return;
		setIsLoadingSaveData(true);

		const res = await dispatch(changeBapSocialLinks({ bapId: selectedBap?.bapId, socialData: socialArr }));
		if (res?.payload?.success) {
			setShowSocialEditComponent(false);
			dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: false }));
		} else {
			getToast('error', 'Error', 'Something went wrong. Changes have not been saved. Please try again');
		}
		setIsLoadingSaveData(false);
	};

	const addingAdditionalFieldHandler = category => {
		if (category === 'socialLinks') {
			const newSocialLinksArr = [...socialArr, { social: '', id: crypto.randomUUID(), position: socialArr?.length + 1 }];
			setSocialArr(newSocialLinksArr);
		}
		// if (category === 'myLinks') {
		// 	const newMyLinksArr = [...myLinkArr, { title: '', link: '', id: crypto.randomUUID() }];
		// 	setMyLinkArr(newMyLinksArr);
		// }
	};

	const deleteLinkHandler = (id, category) => {
		if (invalidLinks.includes(id)) {
			const updatedInvalidLinksArr = invalidLinks.filter(item => item !== id);
			setInvalidLinks(updatedInvalidLinksArr);
		}
		if (category === 'socialLinks') {
			const updatedSocialArr = socialArr
				.filter(item => item.id !== id)
				.sort((a, b) => a.position - b.position)
				.map((el, i) => ({ ...el, position: i + 1 }));
			setSocialArr(updatedSocialArr);
		}
		// if (category === 'myLinks') {
		// 	const updatedMyLinksArr = myLinkArr.filter(item => item.id !== id);
		// 	setMyLinkArr(updatedMyLinksArr);
		// }
	};

	const checkSocialUrls = arr => {
		const regexUrl = /^(http|https|ftp):\/\//i;
		const result = arr?.map(item => {
			if (!regexUrl.test(item.social)) {
				return false;
			}
			return true;
		});
		if (result?.includes(false)) {
			getToast('error', 'Error', 'The entered link should be in this format: https://www.example.com');
			return;
		} else addingAdditionalFieldHandler('socialLinks');
	};

	const validityCheck = (url, id) => {
		const regex = /^(http|https|ftp):\/\/[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([\/?#].*)?$/;

		if (regex.test(url)) {
			if (invalidLinks.includes(id)) {
				const filteredArr = invalidLinks.filter(item => item !== id);
				setInvalidLinks(filteredArr);
			}
		} else if (!invalidLinks.includes(id)) {
			setInvalidLinks(prev => [...prev, id]);
		}
	};

	const handleBlur = () => {
		socialArr?.forEach(obj => {
			validityCheck(obj.social, obj?.id);
		});

		// myLinkArr?.forEach(obj => {
		// 	validityCheck(obj.link, obj?.id);
		// });
	};

	const updateLinkArr = (linksArr, id, event, category) => {
		const indexToUpdate = linksArr.findIndex(item => item.id === id);
		const updatedLink = {
			...linksArr[indexToUpdate],
			...(category === 'myLinks' ? { link: event } : { social: event }),
		};
		const updatedTitle = {
			...linksArr[indexToUpdate],
			title: event,
		};
		return [...linksArr.slice(0, indexToUpdate), category === 'myLinksTitle' ? updatedTitle : updatedLink, ...linksArr.slice(indexToUpdate + 1)];
	};

	const handleChange = (event, id, category) => {
		setInvalidLinks([]);
		const value = event?.target?.value;
		if (category === 'socialLinks') {
			const updatedLinks = updateLinkArr(socialArr, id, value, category);
			setSocialArr(updatedLinks);
		}
		// if (category === 'myLinks' || category === 'myLinksTitle') {
		// 	const updatedLinks = updateLinkArr(myLinkArr, id, value, category);
		// 	setMyLinkArr(updatedLinks);
		// }
	};

	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}
		const newItems = Array.from(socialArr);

		const [removed] = newItems.splice(result.source.index, 1);
		newItems.splice(result.destination.index, 0, removed);
		let position = 1;
		const itemsArr = [];
		newItems.forEach(item => {
			const itemWithNewPosition = {
				...item,
				position,
			};
			position += 1;
			itemsArr.push(itemWithNewPosition);
		});

		setSocialArr(itemsArr);
	};

	const handleMouseEnter = index => {
		setHoveredIndex(index);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(-1);
	};

	const checkEdited = () => {
		const areSocialLinksDifferent = socialArr && JSON.stringify(socialLinks) !== JSON.stringify(socialArr);
		return areSocialLinksDifferent;
		// const areMyLinksDifferent = myLinkArr && JSON.stringify(myLinks) !== JSON.stringify(myLinkArr);
		// return areSocialLinksDifferent || areMyLinksDifferent;
	};

	const isDifferenLinks = Boolean(checkEdited());

	useEffect(() => {
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: isDifferenLinks }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, isDifferenLinks]);

	const onCancel = () => {
		setShowSocialEditComponent(false);
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: false }));
	};

	const onDragStart = e => {
		e.stopPropagation();
	};
	return (
		<>
			<Flex justify='flex-end' w='100%' mb='11px' pl='16px'>
				<CustomButton isSubmiting={isLoadingSaveData} w={'150px'} styles={isDifferenLinks ? 'main' : 'disabled'} onClickHandler={saveLinkHandler}>
					Save
				</CustomButton>

				<CustomButton styles={'light'} w={'150px'} ml='16px' onClickHandler={onCancel}>
					Cancel
				</CustomButton>
			</Flex>

			<Flex flexDir={'column'} w='100%' h={'calc(100% - 80px)'} overflow={'auto'} pl='16px'>
				<Text color={'textColor.black'} sx={poppins_600_18_27}>
					Edit links
				</Text>

				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId='droppable'>
						{(provided, snapshot) => (
							<UnorderedList {...provided.droppableProps} ref={provided.innerRef} m={'0'} w={'475px'} gap={'16px'} mt={'16px'} display={'flex'} flexDir={'column'} listStyleType={'none'}>
								{socialArr?.length !== 0 &&
									socialArr?.map((item, index) => {
										const isHovered = hoveredIndex === index;
										const icon = getIcon(item.social);
										return (
											<Draggable draggableId={item?.id.toString()} index={index} key={item.id}>
												{(provided, snapshot) => (
													<ListItem key={item.id} listStyleType={'none'} maxWidth={'475px'} w={'100%'} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
														<Flex alignItems={'center'} w={'100%'} role='group' position={'relative'}>
															<IconButton onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} {...provided.dragHandleProps} aria-label={isHovered ? 'Drag icon' : 'Social icon'} color='white' icon={isHovered && <MoveIcon />} size='32px' onClick={onDragStart} minW='32px' h='32px' mr='8px'>
																{!isHovered && icon && <Image src={icon.colour} alt={`${icon.title} icon`} width={32} height={32} />}
															</IconButton>
															{invalidLinks.includes(item.id) && (
																<Box position={'absolute'} bottom={'-9px'} left={'60px'} bg={'white'} h={'20px'} width={'147px'} zIndex={100}>
																	<Text color={'textColor.red'} fontSize={'13px'}>
																		*Incorrect link entered
																	</Text>
																</Box>
															)}

															<Tooltip hasArrow label={item?.social?.length > 40 && item?.social} placement='top' bg='bg.black' color='textColor.white' fontSize='16px' borderRadius={'5px'}>
																<Box position={'relative'}>
																	<CustomInput
																		value={item?.social}
																		onChange={e => {
																			handleChange(e, item?.id, 'socialLinks');
																		}}
																		onBlur={handleBlur}
																		w={'435px'}
																		h={'56px'}
																		ml={'8px'}
																		type='text'
																		placeholder={'https://www.facebook.com'}
																		// errors={'*Incorrect link entered'}
																		isInvalid={invalidLinks.includes(item.id) || !item?.social}
																		icon={LinkIcon}
																		iconColor={'#FF0151'}
																	/>
																</Box>
															</Tooltip>

															<IconButton aria-label='Search database' onClick={() => deleteLinkHandler(item?.id, 'socialLinks')} icon={<TrashIcon style={{ height: '20px', width: '20px', fill: '#909090' }} />} />
														</Flex>
													</ListItem>
												)}
											</Draggable>
										);
									})}
								{socialArr?.length === 0 && (
									<Flex alignItems={'center'} gap={'20px'} w='100%'>
										<Text textAlign='start' color={'red'}>
											Social links not added
										</Text>
										<Box
											cursor={'pointer'}
											onClick={() => {
												checkSocialUrls(socialArr);
											}}
										>
											<AddSocialLinkIcon />
										</Box>
									</Flex>
								)}
								{socialArr?.length > 0 && (
									<Flex alignItems={'center'} justifyContent={'end'}>
										<Flex
											as='button'
											cursor={'pointer'}
											onClick={() => {
												checkSocialUrls(socialArr);
											}}
											align='center'
										>
											<Text mr='12px'>Add link</Text>
											<AddSocialLinkIcon />
										</Flex>
									</Flex>
								)}

								{provided.placeholder}
							</UnorderedList>
						)}
					</Droppable>
				</DragDropContext>
			</Flex>
		</>
	);
};
