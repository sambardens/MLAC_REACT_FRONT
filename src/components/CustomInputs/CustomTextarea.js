import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';

const CustomTextarea = ({
	name,
	placeholder,
	onBlur,
	onChange,
	value,
	label,
	ml,
	mb,
	mr,
	mt,
	w = '100%',
	maxW,
	minH = '120px',
	px = '12px',
	py = '16px',
	readOnly = false,
	border = '1px solid #D2D2D2',
	borderRadius = '10px',
	bgColor = 'white',
	isInvalid = false,
	color = 'black',
	required = false,
	maxLength = 350,
	mlLabel = '12px',
	_focus = {
		borderColor: 'brand.gray',
	},
	resize = 'vertical',
}) => {
	return (
		<FormControl
			pos='relative'
			ml={ml}
			mb={mb}
			mt={mt}
			mr={mr}
			w={w}
			maxW={maxW}
			isInvalid={isInvalid}
		>
			{label && (
				<FormLabel htmlFor={name} mb='4px' fontSize='16px' fontWeight='400' color={color} ml={mlLabel}>
					{label}
				</FormLabel>
			)}
			<Textarea
				id={name}
				name={name}
				variant='unstyled'
				px={px}
				py={py}
				value={value}
				readOnly={readOnly}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				_placeholder={{ color: 'stroke' }}
				minH={minH}
				maxLength={maxLength}
				resize={readOnly ? 'none' : resize}
				maxW={maxW}
				borderRadius={borderRadius}
				fontSize='16px'
				fontWeight='400'
				color={color}
				bgColor={bgColor}
				required={required}
				border={border}
				outline='none'
				_focus={_focus}
			/>
		</FormControl>
	);
};

export default CustomTextarea;
