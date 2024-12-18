import Image from 'next/image';

import {
	Box,
	Flex,
	Heading,
	Icon,
	IconButton,
	ListItem,
	Text,
	UnorderedList,
} from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import getIcon from 'src/functions/utils/getIcon';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import MoveIcon from '@/assets/icons/base/move.svg';
import TrashIcon from '@/assets/icons/base/trash.svg';
import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';
import AddSocialLinkIcon from '@/assets/icons/social/socialInfo/addSocialLink.svg';
import UrlIcon from '@/assets/icons/social/socialInfo/url.svg';

const CreateWebPageLinks = ({
	isNew,
	links,
	setLinks,
	invalidLinks,
	setInvalidLinks,
	validLinks,
	setValidLinks,
	setSocialLinksType,
	socialLinksType,
	isStreaming = false,
	streamingTracks,
	setIsLandingForTrack,
	isLandingForTrack,
	streamingTrack,
	handleAddTrackLinks,
	isShop = false,
}) => {
	const [hoveredIndex, setHoveredIndex] = useState(-1);

	const addingAdditionalFieldHandler = () => {
		const newSocialLinksArr = [...links, { link: '', id: nanoid(), position: links?.length + 1 }];
		setLinks(newSocialLinksArr);
	};
	const deleteLinkHandler = id => {
		if (invalidLinks.includes(id)) {
			const updatedInvalidLinksArr = invalidLinks.filter(el => el !== id);
			setInvalidLinks(updatedInvalidLinksArr);
		}
		const updatedSocialArr = links
			.filter(el => el.id !== id)
			.map((el, i) => ({ ...el, position: i + 1 }));
		setLinks(updatedSocialArr);
		setValidLinks(updatedSocialArr);
	};

	const handleBlur = () => {
		let newValidLinks = [];
		// const regex = /^(http|https|ftp):\/\/(open\.)?[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([\/?#].*)?$/;
		const regex = /^(http|https|ftp):\/\/[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([\/?#].*)?$/;

		links?.forEach(({ link, id }) => {
			if (regex.test(link)) {
				const newValid = links.find(el => el.id === id);
				newValidLinks.push(newValid);
				if (invalidLinks.includes(id)) {
					const filteredInvalidLinksArr = invalidLinks.filter(el => el !== id);
					setInvalidLinks(filteredInvalidLinksArr);
				}
			} else if (!invalidLinks.includes(id)) {
				setInvalidLinks(prev => [...prev, id]);
			}
		});

		const updradedValidLinks =
			newValidLinks.length > 0 ? [...newValidLinks].sort((a, b) => a.position - b.position) : [];
		setValidLinks(updradedValidLinks);
	};

	const updateLinkArr = (linksArr, id, e) => {
		const indexToUpdate = linksArr.findIndex(el => el.id === id);
		const updatedLink = {
			...linksArr[indexToUpdate],
			...{ link: e },
		};
		return [...linksArr.slice(0, indexToUpdate), updatedLink, ...linksArr.slice(indexToUpdate + 1)];
	};

	const handleChange = (e, id) => {
		const { value } = e.target;
		// setInvalidLinks([]);
		const updatedLinks = updateLinkArr(links, id, value.trim());
		setLinks(updatedLinks);
	};

	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}
		const newItems = [...links];
		const [removed] = newItems.splice(result.source.index, 1);

		newItems.splice(result.destination.index, 0, removed);
		const newSocialLinksArr = newItems.map((el, i) => ({ ...el, position: i + 1 }));

		setLinks(newSocialLinksArr);

		if (validLinks?.length > 0) {
			let updatedValidLinks = [];
			validLinks.forEach(link => {
				const updatedLink = newSocialLinksArr.find(el => el.id === link.id);
				updatedValidLinks.push(updatedLink);
			});
			const sortedLinks =
				updatedValidLinks.length > 0
					? [...updatedValidLinks].sort((a, b) => a.position - b.position)
					: [];
			setValidLinks(sortedLinks);
		}
	};

	const handleMouseEnter = index => {
		setHoveredIndex(index);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(-1);
	};

	const onDragStart = e => {
		e.stopPropagation();
	};
	return (
		<Box>
			<Box mb='16px'>
				<Heading as='h3' mb='4px' fontSize='18px' fontWeight='500' color='black'>
					{isNew ? 'Add' : 'Edit'} {isShop ? '' : isStreaming ? 'streaming' : 'social'} links
				</Heading>
				{/* <Text fontSize='14px' fontWeight='400' color='secondary'>
					{isNew
						? `Add ${isStreaming ? 'streaming' : 'social'} links to your landing page`
						: `Edit ${isStreaming ? 'streaming' : 'social'} links on your landing page`}
				</Text> */}
			</Box>
			{isStreaming ? (
				<>
					{streamingTracks?.length > 1 && (
						<Box mb='16px'>
							<Text fontWeight={'500'} fontSize={'16px'} color='black' mb='16px'>
								Choose type
							</Text>
							<Flex gap='8px' mb='16px'>
								<CustomButton
									onClickHandler={() => {
										setIsLandingForTrack(false);
									}}
									w='50%'
									styles={isLandingForTrack ? 'transparent-bold' : 'blueYonder'}
								>
									Release
								</CustomButton>

								<CustomButton
									onClickHandler={() => {
										setIsLandingForTrack(true);
									}}
									w='50%'
									styles={isLandingForTrack ? 'blueYonder' : 'transparent-bold'}
								>
									Track
								</CustomButton>
							</Flex>
							{isLandingForTrack && (
								<>
									{/* <Flex gap='16px' mb='12px' align='center' justify='space-between'>
									<Text fontSize='14px' fontWeight='400' color='secondary'>
										You can choose a track for landing page.
									</Text>

									<CustomButton
										styles={streamingTrack ? 'main' : 'disabled'}
										onClickHandler={handleAddTrackLinks}
										minW='150px'
									>
										Add links
									</CustomButton>
								</Flex> */}
									<CustomSelect
										options={streamingTracks}
										name='streaming track'
										value={streamingTrack?.value || ''}
										placeholder='Choose track'
										onChange={value => {
											handleAddTrackLinks(value);
										}}
										pxDropdownIcon='12px'
										mlLabel='0'
									/>
								</>
							)}
						</Box>
					)}
				</>
			) : (
				<Flex mb='16px' align='center' gap='16px'>
					<Text fontSize='16px' fontWeight='400' color='black'>
						Choose icon type
					</Text>
					<Flex
						onClick={() => {
							setSocialLinksType('colour');
						}}
						px='12px'
						py='10px'
						cursor='pointer'
						align='center'
					>
						{socialLinksType === 'colour' ? (
							<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
						) : (
							<Icon as={RadioButtonIcon} boxSize='24px' />
						)}

						<Text lineHeight='1' fontSize='14px' fontWeight='400' color='secondary' ml='6px'>
							colour
						</Text>
					</Flex>
					<Flex
						onClick={() => {
							setSocialLinksType('white');
						}}
						px='12px'
						py='10px'
						cursor='pointer'
						align='center'
					>
						{socialLinksType === 'white' ? (
							<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
						) : (
							<Icon as={RadioButtonIcon} boxSize='24px' />
						)}

						<Text fontSize='14px' lineHeight='1' fontWeight='400' color='secondary' ml='6px'>
							white
						</Text>
					</Flex>
					<Flex
						onClick={() => {
							setSocialLinksType('black');
						}}
						px='12px'
						py='10px'
						cursor='pointer'
						align='center'
					>
						{socialLinksType === 'black' ? (
							<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
						) : (
							<Icon as={RadioButtonIcon} boxSize='24px' />
						)}

						<Text fontSize='14px' lineHeight='1' fontWeight='400' color='secondary' ml='6px'>
							black
						</Text>
					</Flex>
				</Flex>
			)}
			<Flex flexDir='column' w='100%'>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId='socialLinksList'>
						{provided => (
							<UnorderedList
								{...provided.droppableProps}
								ref={provided.innerRef}
								m='0'
								w='100%'
								gap='16px'
								display='flex'
								flexDir='column'
								listStyleType='none'
							>
								{links?.length !== 0 &&
									links?.map((item, index) => {
										const isHovered = hoveredIndex === index;
										const icon = getIcon(item.link);
										return (
											<Draggable draggableId={item?.id.toString()} index={index} key={item.id}>
												{(provided, snapshot) => (
													<ListItem
														key={item.id}
														listStyleType='none'
														w='100%'
														{...provided.draggableProps}
														ref={provided.innerRef}
													>
														<Flex alignItems={'center'} w={'100%'} role='group' position={'relative'}>
															<IconButton
																onMouseEnter={() => handleMouseEnter(index)}
																onMouseLeave={handleMouseLeave}
																{...provided.dragHandleProps}
																aria-label={isHovered ? 'Drag icon' : 'Service icon'}
																color='white'
																icon={isHovered && <MoveIcon />}
																size='32px'
																onClick={onDragStart}
																minW='32px'
																h='32px'
																mr='8px'
															>
																{!isHovered && icon && (
																	<Image src={icon.colour} alt={`${icon.title} icon`} width={32} height={32} />
																)}
															</IconButton>

															{invalidLinks.includes(item.id) && (
																<Box position='absolute' bottom='-9px' left='60px' bg='white' h='20px' zIndex={100}>
																	<Text color='textColor.red' fontSize='13px'>
																		*Incorrect link format
																	</Text>
																</Box>
															)}
															{/* 
															<Tooltip
																hasArrow
																label={item?.link?.length > 40 && item?.link}
																placement='top'
																bg='bg.black'
																color='textColor.white'
																fontSize='16px'
																borderRadius='5px'
															> */}
															<CustomInput
																value={item?.link}
																onChange={e => {
																	handleChange(e, item?.id);
																}}
																onBlur={handleBlur}
																w='100%'
																placeholder={'https://www.facebook.com'}
																isInvalid={invalidLinks.includes(item.id) || !item?.link}
																icon={UrlIcon}
																iconColor='accent'
															/>
															{/* </Tooltip> */}

															<IconButton
																aria-label='Delete social link'
																onClick={() => deleteLinkHandler(item?.id)}
																icon={<TrashIcon style={{ height: '20px', width: '20px', fill: '#909090' }} />}
																_hover={{ icon: { fill: 'accent' } }}
															/>
														</Flex>
													</ListItem>
												)}
											</Draggable>
										);
									})}
								{links?.length === 0 && (
									<Flex h='56px' align='center'>
										<Text textAlign='center' fontSize='16px' fontWeight='500' mb='12px'>
											{isShop ? 'Links' : isStreaming ? 'Streaming links' : 'Social links'} not added
										</Text>
									</Flex>
								)}

								<Flex align='center' justify='end'>
									<Text fontSize='16px' fontWeight='500' color='black'>
										Add link
									</Text>
									<IconButton
										ml='8px'
										boxSize='32px'
										icon={<AddSocialLinkIcon />}
										onClick={addingAdditionalFieldHandler}
										aria-label='Add link'
									/>
								</Flex>

								{provided.placeholder}
							</UnorderedList>
						)}
					</Droppable>
				</DragDropContext>
			</Flex>
		</Box>
	);
};

export default CreateWebPageLinks;
