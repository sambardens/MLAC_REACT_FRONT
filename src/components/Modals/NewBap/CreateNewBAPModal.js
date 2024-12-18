import { Flex, Text } from '@chakra-ui/react';

import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBapUpdated } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';
import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import roles from '@/components/mockData/roles';

import CustomModal from '../CustomModal';

import { poppins_400_14_21, poppins_600_32_48 } from '@/styles/fontStyles';

export const CreateNewBAPModal = ({ setCurrentModal, cancelHandler }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const { selectedBapUpdated } = useSelector(state => state.user);

	const validationSchema = yup.object().shape({
		title: yup.string().trim().required('This field is required'),
		role: yup.string().required('This field is required'),
	});

	const handleSubmit = async formValues => {
		const { title, role } = formValues;
		const updatedNewBap = {
			...selectedBapUpdated,
			bapName: title,
			role,
			isEdited: true,
		};
		dispatch(setSelectedBapUpdated(updatedNewBap));
		setCurrentModal(4);
	};

	return (
		<CustomModal
			closeOnOverlayClick={false}
			isCloseable={false}
			closeModal={cancelHandler}
			maxW='594px'
		>
			<Flex flexDir={'column'} alignItems='start'>
				<Text color={'textColor.black'} sx={poppins_600_32_48} mb='24px'>
					Create new B.A.P.
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
						<Form style={{ width: '100%' }}>
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

							<Flex
								alignItems={'center'}
								justifyContent={'space-between'}
								mt={'40px'}
								w='100%'
								gap={'16px'}
							>
								<CustomButton
									isBackButton={true}
									onClickHandler={() => setCurrentModal(1)}
									styles={'light-red'}
								>
									Back
								</CustomButton>
								<NextButton
									type='submit'
									isSubmiting={isLoading}
									styles={!isValid || !values.title || !values.role ? 'disabled' : 'main'}
								/>
							</Flex>
						</Form>
					)}
				</Formik>
			</Flex>
		</CustomModal>
	);
};
