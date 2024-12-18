import { Button, Flex, Icon, Text, useClipboard } from '@chakra-ui/react';

import CustomButton from '@/components/Buttons/CustomButton';

import CopyIcon from '@/assets/icons/base/copy.svg';
import LinkIcon from '@/assets/icons/base/link.svg';

const CopyToClipboardButton = ({
	sendInviteHandler,
	value,
	type = 'inviteLink',
	mt,
	placeholder,
	p = 0,
	boxShadow = 'none',
}) => {
	const { hasCopied, onCopy } = useClipboard(value);
	const copyHandler = async () => {
		if (sendInviteHandler) {
			await sendInviteHandler(false, onCopy);
			return;
		}

		onCopy(value);
	};

	return (
		<>
			{type === 'inviteLink' && (
				<CustomButton onClickHandler={copyHandler} w='220px' styles='light'>
					<LinkIcon style={{ fill: '#FF0151', height: '24px', width: '24px' }} />
					<Text fontSize={'16px'} fontWeight={'500'} color='accent' ml={'10px'}>
						{hasCopied ? 'Copied' : 'Copy invitation link'}
					</Text>
				</CustomButton>
			)}
			{type === 'webLink' && (
				<Button onClick={copyHandler} p={p} h='fit-content' mt={mt} _hover={{ boxShadow }}>
					{hasCopied ? (
						<Text fontSize={'14px'} fontWeight={'400'} color='secondary'>
							Copied
						</Text>
					) : (
						<Flex align='center'>
							<Text fontSize={'14px'} fontWeight={'400'} color='secondary'>
								{placeholder || value}
							</Text>
							<Icon as={CopyIcon} color='secondary' boxSize='12px' ml='8px' />
						</Flex>
					)}
				</Button>
			)}
		</>
	);
};

export default CopyToClipboardButton;
