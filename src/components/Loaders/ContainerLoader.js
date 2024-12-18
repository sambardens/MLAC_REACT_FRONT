import { Flex } from '@chakra-ui/react';

import { RotatingLines } from 'react-loader-spinner';

const ContainerLoader = ({ color = '#FF0151', w = '200', pb = '0', h = '100%', minH = 'auto' }) => {
	return (
		<Flex w='100%' h={h} justify='center' align='center' pb={pb} minH={minH}>
			<RotatingLines
				strokeColor={color}
				strokeWidth='5'
				animationDuration='1'
				visible={true}
				width={w}
				ariaLabel='Rotating-lines-loading'
			/>
		</Flex>
	);
};

export default ContainerLoader;
