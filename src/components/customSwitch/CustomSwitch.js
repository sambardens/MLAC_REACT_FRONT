import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

export const CustomSwitch = ({
	title,
	onChange,
	id,
	w = '170px',
	isChecked,
	justify = 'flex-start',
	pr = 0,
	fontWeight = 500,
}) => {
	return (
		<FormControl display='flex' alignItems='center' w={w} justifyContent={justify} pr={pr}>
			<FormLabel htmlFor={id} mb='0' fontWeight={fontWeight}>
				{title}
			</FormLabel>
			<Switch
				isChecked={isChecked}
				onChange={onChange}
				id={id}
				colorScheme='checkbox'
				bg={'gray'}
				borderRadius={'10px'}
			/>
		</FormControl>
	);
};
