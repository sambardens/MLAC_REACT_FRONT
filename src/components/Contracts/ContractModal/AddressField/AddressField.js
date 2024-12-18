import { Flex, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { saveUserAddress } from 'store/operations';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';
import { Address } from '@/components/Modals/components/Address';

const AddressField = ({ setAddressField, handleAddressSaved }) => {
	const { user } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
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
	const initialValues = {
		streetAddressOne: user.streetAddressOne || '',
		streetAddressTwo: user.streetAddressTwo || '',
		city: user.city || '',
		regionState: user.regionState || '',
		postCodeZipCode: user.postCodeZipCode || '',
		country: user.country || '',
	};

	const validationSchema = yup.object().shape({
		streetAddressOne: yup.string().required('Required'),
		streetAddressTwo: yup.string(),
		city: yup.string().required('Required'),
		regionState: yup.string(),
		postCodeZipCode: yup.string().min(5, 'Must be at least 5 characters long').nullable(),
		country: yup.string().required('Required'),
	});

	const handleSubmit = async values => {
		const { streetAddressOne, streetAddressTwo, city, regionState, postCodeZipCode, country } =
			values;
		setIsLoading(true);
		const options = {
			streetAddressOne,
			streetAddressTwo,
			city,
			regionState,
			postCodeZipCode,
			country,
		};

		const res = await dispatch(saveUserAddress(options));

		if (res?.payload?.success) {
			getToast('success', 'Success', 'Thank you, your address has been saved');
			handleAddressSaved();
		} else {
			getToast('error', 'Error', 'Something went wrong, your address has not been saved');
		}
		setIsLoading(false);
	};
	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
			{({ values, handleChange, handleBlur, errors, touched, setTouched }) => (
				<Form>
					<Address
						values={values}
						handleChange={handleChange}
						handleBlur={handleBlur}
						handleFocus={() => setTouched({})}
						errors={errors}
						touched={touched}
					/>
					{/* <AddressAutocompleteWithGoogle address={address} setAddress={setAddress} /> */}
					<Flex justify='flex-end' mt='16px'>
						<CustomButton styles='main' type='submit' isSubmiting={isLoading}>
							Save
						</CustomButton>
						<CustomButton
							styles='trasparent'
							onClickHandler={() => {
								setAddressField(false);
							}}
							ml='16px'
						>
							Cancel
						</CustomButton>
					</Flex>
				</Form>
			)}
		</Formik>
	);
};

export default AddressField;
