import { Box } from '@chakra-ui/react';

const StageScale = ({ isRed }) => (
	<Box w='33%' h='8px' ml='4px' borderRadius={'10px'} bgColor={isRed ? 'accent' : 'bg.secondary'} />
);

export default StageScale;
