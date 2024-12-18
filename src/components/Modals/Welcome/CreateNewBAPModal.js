import { useRouter } from 'next/router';

import { Box, Flex, Text } from '@chakra-ui/react';

import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBap } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';
import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import roles from '@/components/mockData/roles';

import CustomModal from '../CustomModal';
import StageScale from '../components/StageScale';

import { poppins_400_14_21 } from '@/styles/fontStyles';

export const CreateNewBAPModal = ({ closeModal, goBack, setCurrentModal }) => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { push } = useRouter();

	const validationSchema = yup.object().shape({
		title: yup.string().required('This field is required'),
		role: yup.string().required('This field is required'),
	});

	const handleSubmit = async formValues => {
		setIsLoading(true);

		const { title, role } = formValues;

		const newBapData = {
			isNew: true,
			bapId: '',
			role,
			bapName: title,
			bapMembers: null,
			bapDescription: '',
			bapArtistBio: '',
			src: '../../../assets/images/logo-primary.png',
			designId: null,
			spotifyId: null,
			facebookPixel: null,
			genres: {
				mainGenre: null,
				secondaryGenre: null,
				subGenres: [],
			},
			releases: null,
			socialLinks: [],
			brandStyles: {},
			isFullAdmin: true,
			isCreator: true,
			isFirstVisit: 'yes',
		};

		dispatch(setBap(newBapData));
		setIsLoading(false);
		setCurrentModal(null);

		push('/create-new-bap');
	};

	return (
		<CustomModal
			closeModal={closeModal}
			closeOnOverlayClick={false}
			maxW='1170px'
			maxH='725px'
			w='90vw'
			h='90vh'
			bgImage={'/assets/images/Blackchords.png'}
			bgSize='550px 100%'
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
					3.Create new B.A.P.
				</Text>
				<Text mt='8px' fontSize={'16px'} fontWeight={'400'} color='brand.textGray'>
					Band/Artist/Project
				</Text>

				<Formik
					initialValues={{
						title: '',
						role: null,
					}}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}
				>
					{({ values, handleChange, handleBlur, errors, touched, isValid }) => (
						<Form
							style={{
								marginTop: '16px',
								width: '100%',
								maxWidth: '500px',
								height: '100%',
							}}
						>
							<Flex flexDir={'column'} justifyContent={'space-between'} h='100%'>
								<Flex flexDir={'column'}>
									<CustomInput
										type={'text'}
										name={'title'}
										label={'Title'}
										value={values.title}
										onChange={handleChange}
										onBlur={handleBlur}
										mlError={'12px'}
										errors={errors.title}
										isInvalid={errors.title && touched.title}
										isErrorsAbsolute={true}
									/>
									{!errors.title && (
										<Text color='secondary' sx={poppins_400_14_21} ml='12px' mt={'4px'}>
											Tell us the name of your band, artist or project.
										</Text>
									)}

									<Field>
										{({ field, form }) => (
											<CustomSelect
												options={roles}
												mt={errors.title ? '41px' : '16px'}
												placeholder={''}
												value={field.value.role}
												name={'role'}
												onBlur={handleBlur}
												errors={errors.role}
												label={'Your role'}
												onChange={option => form.setFieldValue('role', option.value)}
												isInvalid={errors.role && touched.role}
												id='role'
												mlError={'12px'}
												isErrorsAbsolute={true}
												isSearchable={false}
											/>
										)}
									</Field>
								</Flex>

								<Flex alignItems={'center'} justifyContent={'space-between'} mt={'24px'} w='100%'>
									<CustomButton isBackButton={true} onClickHandler={goBack} styles={'light-red'}>
										Back
									</CustomButton>
									<NextButton type='submit' isSubmiting={isLoading} />
								</Flex>
							</Flex>
						</Form>
					)}
				</Formik>
			</Flex>
		</CustomModal>
	);
};
