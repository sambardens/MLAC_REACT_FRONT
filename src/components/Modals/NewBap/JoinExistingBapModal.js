import { useRouter } from 'next/router';

import {
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useToast,
} from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import getTokenFromLink from 'src/functions/utils/getTokenFromLink';
import { setBaps } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';

import InviteLink from '@/assets/icons/modal/inviteLink.svg';

import CustomModal from '../CustomModal';

import { poppins_400_14_21, poppins_400_16_24 } from '@/styles/fontStyles';

export const JoinExistingBapModal = ({ setCurrentModal, cancelHandler }) => {
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();
	const dispatch = useDispatch();
	const { push } = useRouter();
	const [isLoading, setIsLoading] = useState(false);

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
	const validationSchema = yup.object().shape({
		invitationLink: yup.string().required('This field is required'),
	});

	const getBapsFromServer = async () => {
		const bapsWithImages = await getBapsRequest(axiosPrivate);
		dispatch(setBaps(bapsWithImages));
		push({
			pathname: '/bap/[bapId]/bap-info',
			query: { bapId: bapsWithImages[0]?.bapId },
		});
	};

	const handleSubmit = async formValues => {
		const token = getTokenFromLink(formValues.invitationLink);
		setIsLoading(true);
		const formData = new FormData();
		formData.append('isAccept', true);
		const resData = await checkNotifications(formData, token);
		console.log('resData JoinExistingBapModal: ', resData);

		if (resData.success) {
			getToast(
				'success',
				'Success',
				'Thank you, the B.A.P. has been added, you will be redirected on the main page.',
			);

			getBapsFromServer();
			setIsLoading(false);
			setCurrentModal(null);
			return;
		}
		getToast(
			'error',
			'Error',
			`Failed to add new B.A.P. to your B.A.P. list. ${resData?.message || ''}`,
		);

		setIsLoading(false);
	};

	return (
		<CustomModal
			closeOnOverlayClick={false}
			// isCentered={false}
			closeModal={() => cancelHandler()}
			maxW='594px'
			h='455px'
		>
			<Flex flexDir={'column'} alignItems='start' w={'100%'} h='100%'>
				<Text fontSize={'32px'} fontWeight='600'>
					Join existing B.A.P.
				</Text>
				<Text mt='24px' fontSize={'14px'} fontWeight={'400'} color='secondary'>
					Have you been sent a link to join an existing B.A.P.?
				</Text>

				<Formik
					initialValues={{
						invitationLink: '',
					}}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}
				>
					{({ values, handleChange, handleBlur, errors, touched }) => (
						<Form
							style={{
								marginTop: '24px',
								width: '100%',
								height: '100%',
							}}
						>
							<Flex flexDir={'column'} justifyContent={'space-between'} h='100%'>
								<FormControl id='title' isInvalid={errors.invitationLink && touched.invitationLink}>
									<Flex flexDir={'column'}>
										<FormLabel sx={poppins_400_16_24} color={'textColor.black'}>
											Paste your invitation link here.
										</FormLabel>
										<Flex
											flexDir={'column'}
											// w='414px'
											position='relative'
										>
											<InputGroup>
												<InputLeftElement pointerEvents='none' top='10px' left='7px'>
													<InviteLink />
												</InputLeftElement>
												<Input
													type='text'
													name='invitationLink'
													value={values.invitationLink}
													onChange={handleChange}
													onBlur={handleBlur}
													w='100%'
													h='56px'
													borderRadius='10px'
													border='1px'
													borderColor='brand.lightGray'
													focusBorderColor='brand.lightGray'
													pl='48px'
												/>
											</InputGroup>
											<FormErrorMessage position='absolute' bottom='-20px' left='0'>
												{errors.invitationLink}
											</FormErrorMessage>

											<Text mt={'4px'} sx={poppins_400_14_21} color={'textColor.gray'}>
												You can request the invitation link from the administrator of the B.A.P.
											</Text>
										</Flex>
									</Flex>
								</FormControl>

								<Flex alignItems={'center'} justifyContent={'space-between'} mt={'24px'} w='100%'>
									<CustomButton
										styles={'light-red'}
										isBackButton={true}
										onClickHandler={() => setCurrentModal(1)}
									>
										Back
									</CustomButton>
									<CustomButton
										isSubmiting={isLoading}
										type='submit'
										styles={values.invitationLink ? 'main' : 'transparent-bold'}
									>
										Join
									</CustomButton>
								</Flex>
							</Flex>
						</Form>
					)}
				</Formik>
			</Flex>
		</CustomModal>
	);
};
