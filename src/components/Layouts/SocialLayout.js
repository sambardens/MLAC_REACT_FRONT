import { useToast } from '@chakra-ui/react';

import jwt from 'jsonwebtoken';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import parseName from 'src/functions/utils/parseName';
import { handleSocialAuth } from 'store/auth/auth-operations';

const SocialLayout = ({ children, setShowAuthModal }) => {
	const { data: session } = useSession();
	const toast = useToast();
	const dispatch = useDispatch();

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};
	useEffect(() => {
		if (session) {
			const login = async () => {
				const authToken = jwt.sign({ email: session.user.email }, process.env.NEXT_PUBLIC_SECRET_SOCIAL_AUTH_TOKEN, { expiresIn: '2min' });

				const { firstName, lastName } = parseName(session.user.name);
				try {
					const authData = {
						email: session?.user?.email,
						firstName,
						authToken,
					};
					if (lastName) {
						authData.lastName = lastName;
					}
					if (session?.user?.image) {
						authData.urlAvatar = session.user.image;
					}
					const res = await dispatch(handleSocialAuth(authData));
					if (res?.payload?.accessToken) {
						setShowAuthModal(false);
					} else {
						getToast('Error', `${res?.payload.error}. Try again later`);
						setErrorMsg(res?.payload?.error);
					}
				} catch (e) {
					console.log('SignIn error:', e);
				}
			};
			login();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	return <>{children}</>;
};

export default SocialLayout;
