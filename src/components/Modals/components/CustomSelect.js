import { Select } from 'chakra-react-select';

export const CustomSelect = ({ options, field, form, name, handleBlur }) => {
	return (
		<Select
			value={options.find(option => option.value === field.value)}
			onChange={option => form.setFieldValue('role', option.value)}
			onBlur={handleBlur}
			focusBorderColor='brand.lightGray'
			name={name}
			classNamePrefix='chakra-react-select'
			options={options}
			placeholder={''}
			selectedOptionStyle='check'
			chakraStyles={{
				dropdownIndicator: provided => ({
					...provided,
					bg: 'transparent',
					px: 2,
					cursor: 'inherit',
					display: 'none',
				}),
				indicatorSeparator: provided => ({
					...provided,
					display: 'none',
				}),

				control: provided => ({
					...provided,
					bg: 'bg.main',
					border: '1px',
					borderRadius: '10px',
					borderColor: 'brand.lightGray',
					width: '414px',
					height: '56px',
				}),
				input: provided => ({
					...provided,
					pl: 0,
				}),
				singleValue: provided => ({
					...provided,
					pl: 0,
					maxWidth: '260px',
				}),
				valueContainer: provided => ({
					...provided,
					pl: '20px',
					color: '#000000',
				}),
				menuList: provided => ({
					...provided,
					border: '1px',
					borderColor: 'brand.lightGray',
				}),
			}}
		/>
	);
};
