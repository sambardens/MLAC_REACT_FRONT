import { useRouter } from 'next/router';

import {
	Box,
	Button,
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

import BackArrowIcon from '@/assets/icons/modal/backArrow.svg';
import InviteLink from '@/assets/icons/modal/inviteLink.svg';
import NextArrowIcon from '@/assets/icons/modal/nextArrow.svg';

import CustomModal from '../CustomModal';
import StageScale from '../components/StageScale';

import { poppins_400_14_21, poppins_400_16_24, poppins_500_16_24 } from '@/styles/fontStyles';

export const InviteLinkModal = ({ closeModal, goBack, setCurrentModal }) => {
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
		if (bapsWithImages?.length) {
			push({
				pathname: '/bap/[bapId]/bap-info',
				query: { bapId: bapsWithImages[0]?.bapId },
			});
		} else {
			router.push('/my-splits-contracts');
		}
	};

	const handleSubmit = async formValues => {
		setIsLoading(true);
		const token = getTokenFromLink(formValues.invitationLink);
		const formData = new FormData();
		formData.append('isAccept', true);
		const resData = await checkNotifications(formData, token);

		if (resData.success) {
			getToast(
				'success',
				'Success',
				'Thank you, the B.A.P. has been added,  you will be redirected on the main page.',
			);

			getBapsFromServer();
			setIsLoading(false);
			setCurrentModal(null);

			router.push('bap-info');

			return;
		}
		getToast('error', 'Error', `Failed to add new B.A.P. to your B.A.P. list.. ${resData.message}`);

		setIsLoading(false);
	};

	return (
		<CustomModal
			closeOnOverlayClick={false}
			closeModal={() => closeModal()}
			maxW='1170px'
			maxH='725px'
			w='90vw'
			h='90vh'
			bgImage={'/assets/images/Blackchords.png'}
		>
			<Flex flexDir={'column'} alignItems='start' w={'635px'} h='100%'>
				<Text fontSize={'32px'} fontWeight='600'>
					Welcome to
					<Box as='span' ml='10px' color='accent'>
						Major Labl Artist Club
					</Box>
				</Text>
				<Flex w='100%' mt='24px'>
					<StageScale isRed={true} />
					<StageScale isRed={true} />
					<StageScale isRed={true} />
				</Flex>
				<Text mt='24px' fontSize={'18px'} fontWeight={'500'}>
					3.Join to B.A.P.
				</Text>
				<Text mt='8px' fontSize={'16px'} fontWeight={'400'} color='brand.textGray'>
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
								marginTop: '16px',
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
										<Flex flexDir={'column'} w='414px' position='relative'>
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
									<Button
										sx={poppins_500_16_24}
										color={'textColor.red'}
										bg={'transparent'}
										leftIcon={<BackArrowIcon />}
										pl={'40px'}
										_hover={{}}
										_focus={{}}
										_active={{}}
										onClick={goBack}
									>
										Back
									</Button>

									<Button type='submit'>
										<CustomButton
											styles={!values.invitationLink && 'disabled'}
											w={'150px'}
											h={'56px'}
											rightIcon={<NextArrowIcon />}
											_hover={{}}
											_focus={{}}
											_active={{}}
											isNextButton
										>
											Next
										</CustomButton>
									</Button>
								</Flex>
							</Flex>
						</Form>
					)}
				</Formik>
			</Flex>
		</CustomModal>
	);
};
