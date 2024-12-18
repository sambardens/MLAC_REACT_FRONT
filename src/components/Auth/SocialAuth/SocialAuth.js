import { useRouter } from 'next/router';

import { Flex, IconButton, useToast } from '@chakra-ui/react';

import jwt from 'jsonwebtoken';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import getImageSrc from 'src/functions/utils/getImageSrc';
import parseName from 'src/functions/utils/parseName';
import { handleSocialAuth } from 'store/auth/auth-operations';
import { setBaps } from 'store/slice';

import FacebookIcon from '@/assets/icons/social/facebook.svg';
import GoogleIcon from '@/assets/icons/social/google.svg';
import SpotifyIcon from '@/assets/icons/social/spotify.svg';

const SocialAuth = ({
	setErrorMsg,
	deleteBapHandler,
	takeoverBapHandler,
	acceptInviteToBapHandler,
}) => {
	const { data: session } = useSession();
	const toast = useToast();
	const router = useRouter();
	const isWebPage = router.pathname.includes('music');
	const dispatch = useDispatch();
	const { deleteToken, takeoverToken } = useSelector(state => state.user);
	const { inviteToken } = useSelector(state => state.auth);
	const axiosPrivate = useAxiosPrivate();

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
		if (!isWebPage && session) {
			console.log('session-----------SocialAuth--------------: ', session);
			const login = async () => {
				const authToken = jwt.sign(
					{ email: session.user.email },
					process.env.NEXT_PUBLIC_SECRET_SOCIAL_AUTH_TOKEN,
					{ expiresIn: '2min' },
				);

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
						let userDataFromServer = res?.payload?.user;

						if (userDataFromServer?.avatar) {
							const srcFromServer = getImageSrc(
								userDataFromServer?.thumbnail || userDataFromServer.avatar,
								true,
								true,
							);
							userDataFromServer = { ...userDataFromServer, avatarSrc: srcFromServer };
						}

						if (inviteToken) {
							await acceptInviteToBapHandler();
						}

						if (deleteToken) {
							await deleteBapHandler();
						}

						if (takeoverToken) {
							await takeoverBapHandler();
						}

						const bapsWithImages = await getBapsRequest(axiosPrivate);
						dispatch(setBaps(bapsWithImages));

						if (res?.payload?.user?.isNew) {
							router.push('/welcome');
						} else {
							if (bapsWithImages?.length) {
								router.push({
									pathname: '/bap/[bapId]/dashboard',
									query: { bapId: bapsWithImages[0]?.bapId },
								});
							} else {
								router.push('/my-splits-contracts');
							}
						}
					} else {
						getToast('Error', `${res?.payload.error}`);
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

	return (
		<Flex w='100%' justifyContent='center'>
			<Flex w='308px' justifyContent='space-between'>
				<IconButton
					w='64px'
					h='64px'
					borderRadius='14px'
					border='1px solid'
					aria-label={'Google Authorization'}
					icon={<GoogleIcon />}
					color='stroke'
					_hover={{ bg: 'stroke' }}
					transition='0.3s linear'
					onClick={() => signIn('google')}
				/>
				<IconButton
					w='64px'
					h='64px'
					borderRadius='14px'
					aria-label={'Facebook Authorization'}
					icon={<FacebookIcon />}
					bg='#1877F2'
					_hover={{ opacity: '0.8' }}
					transition='0.3s linear'
					onClick={() => signIn('facebook')}
				/>
				<IconButton
					w='64px'
					h='64px'
					borderRadius='14px'
					aria-label={'Spotify Authorization'}
					icon={<SpotifyIcon />}
					bg='#1ED760'
					_hover={{ opacity: '0.8' }}
					transition='0.3s linear'
					onClick={() => signIn('spotify')}
				/>
			</Flex>
		</Flex>
	);
};

export default SocialAuth;
