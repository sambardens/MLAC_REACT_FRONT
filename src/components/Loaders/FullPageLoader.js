import { Box } from '@chakra-ui/react';

import { RotatingLines } from 'react-loader-spinner';

export default function FullPageLoader({ color = '#db2754', position = 'fixed', w = '200' }) {
	return (
		<Box position={position} top='50%' left='50%' transform='translate(-50%, -50%)' zIndex='100'>
			<RotatingLines
				strokeColor={color}
				strokeWidth='5'
				animationDuration='1'
				visible={true}
				width={w}
				ariaLabel='Rotating-lines-loading'
			/>
		</Box>
	);
}
