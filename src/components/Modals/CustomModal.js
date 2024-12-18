import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react';

const CustomModal = ({
	children,
	closeModal,
	w,
	h,
	p = '40px',
	px,
	maxH = '772px',
	minH,
	maxW = '692px',
	isCentered = true,
	bgImage,
	isCloseable = true,
	isCloseCross = true,
	closeOnOverlayClick = true,
	bgColor = 'white',
	closeIconColor = '',
	closeIconHoverColor = '',
	top,
	right,
	bgSize = '455px 100%',
}) => {
	return (
		<Modal
			isCloseable={isCloseable}
			isCentered={isCentered}
			onClose={closeModal}
			closeOnOverlayClick={closeOnOverlayClick}
			isOpen={true}
			motionPreset='slideInBottom'
		>
			<ModalOverlay />
			<ModalContent
				position={'absolute'}
				p={p}
				px={px}
				borderRadius={'10px'}
				h={h}
				w={w}
				maxH={maxH}
				minH={minH}
				maxW={`${maxW}`}
				bgImage={{ base: 'none', lg: bgImage }}
				bgSize={bgSize}
				bgRepeat={'no-repeat'}
				backgroundPosition={'right'}
				m={{ base: '0 6px 0 0', lg: 0 }}
				bgColor={bgColor}
				right={right ? { base: null, lg: right } : null}
				top={top ? { base: top } : null}
			>
				{isCloseCross && (
					<ModalCloseButton
						color={closeIconColor || 'stroke'}
						_focusVisible={{ boxShadow: 'none' }}
						_hover={{
							color: closeIconHoverColor || 'accent',
							bgColor: !closeIconHoverColor && 'pink',
							transition: '0.3s linear',
						}}
					/>
				)}
				<ModalBody p='0'>{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default CustomModal;
