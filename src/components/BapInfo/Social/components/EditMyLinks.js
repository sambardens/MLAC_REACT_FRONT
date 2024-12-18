import {
	Box,
	Flex,
	ListItem,
	Text,
	UnorderedList,
	Editable,
	EditablePreview,
	EditableInput,
	IconButton,
} from '@chakra-ui/react';

import LinkIcon from '@/assets/icons/all/link.svg';
import TrashIcon from '@/assets/icons/all/trash.svg';
import AddSocialLinkIcon from '@/assets/icons/social/socialInfo/addSocialLink.svg';
import { poppins_500_16_24, poppins_600_18_27 } from '@/styles/fontStyles';
import { CustomEditable } from '../../../CustomInputs/CustomEditable';
import CustomInput from '@/components/CustomInputs/CustomInput';

export const EditMyLinks = ({
	myLinkArr,
	handleChange,
	deleteLinkHandler,
	addingAdditionalFieldHandler,
	invalidLinks,
	handleBlur,
}) => {
	return (
		<Box mt={'32px'}>
			<Text color={'textColor.black'} sx={poppins_600_18_27}>
				My links
			</Text>

			<UnorderedList m={'0'} w={'475px'} gap={'16px'} mt={'16px'} display={'flex'} flexDir={'column'}>
				{myLinkArr?.map((item, index) => {
					return (
						<ListItem
							key={item?.id}
							listStyleType={'none'}
							maxWidth={'500px'}
							w={'100%'}
							position={'relative'}
						>
							{invalidLinks.includes(item.id) && (
								<Box
									position={'absolute'}
									bottom={'-9px'}
									left={'15px'}
									bg={'white'}
									h={'20px'}
									width={'147px'}
									zIndex={100}
								>
									<Text color={'textColor.red'} fontSize={'13px'}>
										*Incorrect link entered
									</Text>
								</Box>
							)}
							<Text color={'textColor.gray'} sx={poppins_500_16_24} mb={'8px'}>{`Link${index + 1}`}</Text>

							{/* top */}
							<CustomEditable
								id={item.id}
								defaultValue={item?.title}
								onChange={e => {
									handleChange(e, item?.id, 'myLinksTitle');
								}}
								width={'475px'}
								height={'56px'}
								px={'12px'}
								py='16px'
							/>

							{/* bottom */}
							<Flex alignItems={'center'} w={'100%'} role='group' mt={'8px'}>
								<CustomInput
									value={item?.link}
									onChange={e => {
										handleChange(e, item?.id, 'myLinks');
									}}
									onBlur={handleBlur}
									w={'475px'}
									h={'56px'}
									type='text'
									placeholder={'https://www.support.com'}
									isInvalid={invalidLinks.includes(item.id) || !item?.link}
									icon={LinkIcon}
									iconColor={'#FF0151'}
								/>

								<IconButton
									aria-label='Search database'
									onClick={() => deleteLinkHandler(item?.id, 'myLinks')}
									icon={<TrashIcon style={{ height: '20px', width: '20px', fill: '#909090' }} />}
								/>
							</Flex>
						</ListItem>
					);
				})}
				{myLinkArr?.length === 0 && <Text textAlign='center'>My links not added</Text>}
				<Flex alignItems={'center'} justifyContent={'end'}>
					<Box
						cursor={'pointer'}
						onClick={() => {
							addingAdditionalFieldHandler('myLinks');
						}}
					>
						<AddSocialLinkIcon />
					</Box>
				</Flex>
			</UnorderedList>
		</Box>
	);
};
