import { useRouter } from 'next/router';

import { Flex, Heading, Text, useToast } from '@chakra-ui/react';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { downloadListOfTracks } from 'src/functions/serverRequests/downloads/getTracksToDownLoad';
import { setToken } from 'store/operations';

const DownloadMusic = () => {
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { asPath } = useRouter();
	const toast = useToast();
	const searchParams = new URLSearchParams(asPath.split(/\?/)[1]);
	const token = searchParams.get('token');
	const accessToken = searchParams.get('accessToken');

	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};

	const handleDownload = async token => {
		try {
			setIsLoading(true);
			const { data } = await axios.get(
				`${process.env.NEXT_PUBLIC_FRONT_URL}/api/download?token=${token}`,
			);
			if (data.success && data?.tracks) {
				const tracks = data.tracks.map(el => ({ name: el.name, id: el.trackId }));
				const res = await downloadListOfTracks({
					tracks,
					bapId: 0,
				});

				if (res?.success) {
					setMessage('Success');
				} else {
					setMessage('Download failed');
					getToast('error', 'Error', 'Download failed');
				}
			} else {
				setMessage('Download failed');
				getToast('error', 'Error', 'Download failed');
			}
		} catch (error) {
			console.log('Download error: ', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined' && token && accessToken) {
			setToken(accessToken);
			handleDownload(token);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, accessToken]);

	return (
		<Flex align='center' justify='center' flexDir='column' h='calc(100vh - 370px)' min='300px'>
			<Heading
				fontWeight='600'
				fontSize='46px'
				color='black'
				textAlign='center'
				mb='16px'
				lineHeight='1.5'
			>
				Music download
			</Heading>

			<Text textAlign='center' color='accent' fontSize='24px' lineHeight='1.5'>
				{isLoading ? 'Loading...' : message ? message : 'Please wait...'}
			</Text>
		</Flex>
	);
};

export default DownloadMusic;
