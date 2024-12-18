import { Box, FormControl, FormLabel, Icon, Text } from '@chakra-ui/react';

import { Select, chakraComponents } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import CloseIcon from '@/assets/icons/base/close.svg';
import ArrowDownIcon from '@/assets/icons/base/down.svg';

const CustomSelect = ({
	options = [],
	name,
	onFocus,
	onBlur,

	onChange,
	placeholder,
	w = '100%',
	minW,
	maxW,
	minHeight = '56px',
	label,
	ml,
	mr,
	mt,
	mb,
	mtMenu = '5px',
	ptMenu = '0px',
	isMulti = false,
	value,
	selectedOptions,
	isInvalid = false,
	errors = false,
	mlError = false,
	mtError = '5px',
	borderSelect = '1px solid',
	dropdownIconColor = 'stroke',
	pxDropdownIcon = '16px',
	borderRadiusControl = '10px',
	hControl = '56px',
	plValueContainer = '12px',
	pyValueContainer = '7px',
	bgColor = 'bg.main',
	phColor = 'stroke',
	textAlign = 'left',
	isTop = false,
	menuListTopHeight = '- 5',
	isSearchable = true,
	isErrorsAbsolute = false,
	alignSelf = null,
	isClearable = false,
	readOnly = false,
	listMaxHeight = '226px',
	mlLabel = '12px',
	textRight = '',
}) => {
	const selectorRef = useRef(null);
	const [selectorHeight, setSelectorHeight] = useState(null);

	useEffect(() => {
		if (selectorRef?.current?.offsetHeight) {
			const height = selectorRef?.current?.offsetHeight;
			setSelectorHeight(height);
		}
	}, []);

	const components = {
		ClearIndicator: props => (
			<chakraComponents.ClearIndicator {...props}>
				<Icon as={CloseIcon} boxSize='24px' color={dropdownIconColor} />
			</chakraComponents.ClearIndicator>
		),
		DropdownIndicator: props => (
			<chakraComponents.DropdownIndicator {...props}>
				<Icon as={ArrowDownIcon} boxSize='24px' color={dropdownIconColor} />
			</chakraComponents.DropdownIndicator>
		),
	};
	const getSelectedOptions = () => {
		if (value === '') {
			return '';
		}

		if (isMulti && selectedOptions) {
			return selectedOptions;
		}

		return options.find(option => option?.value === value) || '';
	};

	return (
		<FormControl
			ref={selectorRef}
			ml={ml}
			mb={mb}
			mt={mt}
			mr={mr}
			w={w}
			maxW={maxW}
			isInvalid={isInvalid}
			{...(name && { name })}
			textAlign={textAlign}
			alignSelf={alignSelf}
			pos='relative'
		>
			{label && (
				<Text htmlFor={name} mb='8px' ml={mlLabel} fontSize='16px' fontWeight='400' color='black'>
					{label}
				</Text>
			)}
			<Select
				id={name}
				variant='unstyled'
				value={getSelectedOptions()}
				onChange={onChange}
				onBlur={onBlur}
				name={name}
				isReadOnly={readOnly}
				classNamePrefix='chakra-react-select'
				options={options}
				onFocus={onFocus}
				placeholder={placeholder}
				selectedOptionStyle='color'
				components={components}
				isMulti={isMulti}
				isClearable={isClearable}
				focurBorderColor='orange.500'
				isSearchable={isSearchable}
				chakraStyles={{
					dropdownIndicator: (provided, { selectProps }) => ({
						...provided,
						pl: '12px',
						pr: pxDropdownIcon,
						'> svg': {
							transform: `rotate(${selectProps.menuIsOpen ? -180 : 0}deg)`,
							color: 'secondary',
						},
					}),
					clearIndicator: provided => ({
						...provided,
						display: isClearable ? 'flex' : 'none',
						// mr: '4px',
					}),
					indicatorSeparator: provided => ({
						...provided,
						display: 'none',
					}),
					container: provided => ({
						...provided,
					}),
					control: (provided, state) => ({
						...provided,
						bg: bgColor,
						border: borderSelect,
						borderRadius: borderRadiusControl,
						borderColor: isInvalid ? 'accent' : 'stroke',
						height: hControl,
						minHeight,
						size: 'lg',
						cursor: state.isFocused ? 'text' : 'pointer',
						w,
						minW,
					}),
					input: provided => ({
						...provided,
						pl: '0',
					}),
					singleValue: provided => ({
						...provided,
						pl: 0,
					}),
					multiValue: provided => ({
						...provided,
						p: '8px',
						borderRadius: '10px',
						bgColor: 'secondary',
						m: '0',
					}),
					multiValueLabel: provided => ({
						...provided,
						color: 'white',
						fontWeight: 400,
						fontSize: '16px',
					}),
					multiValueRemove: (provided, state) => ({
						...provided,
						ml: '4px',
						color: 'white',
						opacity: 1,
						_hover: { opacity: 1 },
					}),
					valueContainer: provided => ({
						...provided,
						pl: plValueContainer,
						color: 'black',
						py: pyValueContainer,
						gap: '6px',
					}),
					menuList: provided => ({
						...provided,
						position: 'absolute',
						top: isTop && `calc(-${selectorHeight}px ${menuListTopHeight}px)`,
						transform: isTop && 'translateY(-100%)',

						border: '1px',
						borderColor: 'stroke',
						borderRadius: '10px',
						maxH: listMaxHeight,
						p: 0,
					}),
					option: (provided, state) => ({
						...provided,
						height: '56px',
						color: 'black',
						m: 0,
						bgColor: state.isSelected && 'stroke',
					}),
					menu: (provided, state) => ({
						...provided,
						mt: mtMenu,
						pt: ptMenu,
						bgColor: state.isSelected && 'stroke',
					}),
					placeholder: provided => ({
						...provided,
						color: phColor,
					}),
				}}
			/>
			{textRight && (
				<Text pos='absolute' right='48px' bottom='16px' color='black' fontSize='16px'>
					{textRight}
				</Text>
			)}
			{errors && (
				<Text
					color='accent'
					fontSize='12px'
					position={isErrorsAbsolute ? 'absolute' : 'static'}
					{...(mlError && { ml: mlError, mt: mtError })}
				>
					{errors}
				</Text>
			)}
		</FormControl>
	);
};

export default CustomSelect;
