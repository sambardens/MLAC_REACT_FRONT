import { Flex, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeSubscriptionStatus, getUserSubscription } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';

const SignUpForML = ({
	textColor,
	buttonColor,
	fontFamily,
	fontStyle,
	fontWeight,
	fontSize,
	openAuthModal,
	isСonstructor = false,
	bapId,
	mt = 0,
	bapName = '',
}) => {
	const { user } = useSelector(state => state.user);
	const { jwtToken } = useSelector(state => state.auth);
	const toast = useToast();
	const [isSubscribedConstructor, setIsSubscribedConstructor] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const isSubscribed = user?.subscriptions ? user.subscriptions?.includes(bapId) : false;
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type,
			description: text || '',
			status: type.toLowerCase(),
			duration: 5000,
			isClosable: true,
		});
	};
	const subscribeHandler = async () => {
		if (isСonstructor) {
			getToast('Info', `You have been subscribed to ${bapName} mailing list.`);
			setIsSubscribedConstructor(true);
		} else {
			if (user?.id && jwtToken) {
				setIsLoading(true);
				const res = await dispatch(changeSubscriptionStatus({ bapId, userId: user.id }));

				if (res?.payload?.success) {
					getToast('Success', 'You have been subscribed.');
				} else {
					getToast('Error', 'You have not been subscribed. Try again later.');
				}
				setIsLoading(false);
			} else {
				getToast('Info', 'After authorisation you will be able to subscribe.');
				openAuthModal();
			}
		}
	};

	const unsubscribeHandler = async () => {
		if (isСonstructor) {
			getToast(
				'Info',
				'After clicking on the button the user will be unsubscribed and removed from the B.A.P. mail list.',
			);
			setIsSubscribedConstructor(false);
		} else {
			if (user?.id && jwtToken) {
				setIsLoading(true);
				const res = await dispatch(changeSubscriptionStatus({ bapId, userId: user.id }));
				if (res?.payload?.success) {
					getToast('Success', 'You have been unsubscribed.');
				} else {
					getToast('Error', 'You have not been unsubscribed. Try again later.');
				}
				setIsLoading(false);
			} else {
				getToast('Info', 'After authorisation you will be able to unsubscribe.');
				openAuthModal();
			}
		}
	};

	const getBtnText = () => {
		if (isСonstructor) {
			return isSubscribedConstructor ? 'Unsubscribe' : 'Subscribe';
		} else {
			return isSubscribed ? 'Unsubscribe' : 'Subscribe';
		}
	};
	const getText = () => {
		if (isСonstructor) {
			return isSubscribedConstructor
				? 'Unsubscribe from our mailing list!'
				: 'Subscribe to our mailing list!';
		} else {
			return isSubscribed ? 'Unsubscribe from our mailing list!' : 'Subscribe to our mailing list!';
		}
	};

	const onClickHandler = () => {
		if (isСonstructor) {
			return isSubscribedConstructor ? unsubscribeHandler() : subscribeHandler();
		} else {
			isSubscribed ? unsubscribeHandler() : subscribeHandler();
		}
	};

	useEffect(() => {
		if (!isСonstructor && user?.uuidEveara && user?.id && jwtToken) {
			dispatch(getUserSubscription(user?.id));
		}
	}, [dispatch, isСonstructor, jwtToken, user?.id, user?.uuidEveara]);
	return (
		<Flex flexDir={'column'} alignItems={'center'} mt={mt}>
			<Text
				fontFamily={fontFamily}
				fontStyle={fontStyle}
				fontWeight={400}
				fontSize='14px'
				color={textColor}
			>
				{getText()}
			</Text>

			<CustomButton
				onClickHandler={onClickHandler}
				minW='200px'
				mt='8px'
				w='fit-content'
				fontFamily={fontFamily}
				fontStyle={fontStyle}
				fontWeight={fontWeight}
				fontSize={fontSize}
				bgColor={buttonColor}
				color={textColor}
				isSubmiting={isLoading}
				h='40px'
			>
				{getBtnText()}
			</CustomButton>
		</Flex>
	);
};

export default SignUpForML;
