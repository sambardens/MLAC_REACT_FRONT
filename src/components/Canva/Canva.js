import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { maxWidthAndHeightErrorInCanva } from 'src/functions/utils/validateImg';

import CanvaIcon from '@/assets/icons/base/canva.svg';
import EditIcon from '@/assets/icons/modal/edit.svg';

const Canva = ({
	setImageSrc,
	setImageFile = false,
	w = '301px',
	h = '130px',
	create = false,
	setNewDesignId = false,
	designId: designChange = false,
	title = 'Use Canva to design your artwork',
	justify = 'center',
	flexDir = 'column',
	textMarginTop = '16px',
	textMarginLeft = '0px',
	checkSize = false,
	type = 'PodcastCover',
	imgW = 1500,
	imgH = 1500,
}) => {
	const toast = useToast();
	const [apiCanvaInstance, setApiCanvaInstance] = useState(null);

	const forceCloseCanva = () => {
		const existingScripts = document.querySelectorAll('[id="canva-api"]');
		if (existingScripts?.length > 0)
			existingScripts.forEach(script => {
				if (script.parentNode) {
					script.parentNode.removeChild(script);
				}
			});

		const modals = document.querySelectorAll('div[dir="ltr"]');

		if (modals?.length > 0) {
			modals.forEach(el => {
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
			});
		}

		const canvaLinkElements = document.querySelectorAll(
			'link[href="https://sdk.canva.com/designbutton/v2/api.css"]',
		);
		if (canvaLinkElements?.length > 0) {
			canvaLinkElements.forEach(el => {
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
			});
		}
	};
	const CANVA_CLIENT_API_KEY = process?.env?.NEXT_PUBLIC_CANVA_CLIENT_API_KEY;

	const initializeCanva = async () => {
		try {
			if (window.Canva && window.Canva?.DesignButton?.createDesign) {
				setApiCanvaInstance(window.Canva.DesignButton);
			} else {
				const script = document.createElement('script');
				script.src = 'https://sdk.canva.com/designbutton/v2/api.js';
				script.id = 'canva-api';
				document.body.appendChild(script);

				script.onload = async () => {
					if (!window.Canva || !window.Canva?.DesignButton) {
						return;
					}
					const api = await window.Canva.DesignButton.initialize({
						apiKey: CANVA_CLIENT_API_KEY,
					});
					if (!document.getElementById('meta')) {
						const meta = document.createElement('meta');
						meta.httpEquiv = 'Referrer-Policy';
						meta.content = 'strict-origin-when-cross-origin';
						document.head.appendChild(meta);
					}
					api && setApiCanvaInstance(api);
				};
			}
		} catch (error) {
			console.error('Ошибка при инициализации Canva SDK:', error);
		}
	};
	const openCanva = async () => {
		try {
			let exportUrl = '';
			let designId = '';
			if (create) {
				const result = await new Promise(resolve => {
					apiCanvaInstance.createDesign({
						design: {
							type: 'Poster',
							dimensions: {
								width: imgW,
								height: imgH,
							},
						},
						editor: {
							fileType: 'jpeg',
						},

						onDesignPublish: async ({ exportUrl, designId }) => {
							resolve({ exportUrl, designId });
						},
						onDesignClose: () => {
							resolve({ exportUrl: null, designId: null });
						},
					});
				});
				exportUrl = result?.exportUrl;
				designId = result?.designId;
			} else {
				const result = await new Promise(resolve => {
					apiCanvaInstance.editDesign({
						design: {
							id: designChange,
						},
						onDesignPublish: async ({ exportUrl, designId }) => {
							resolve({ exportUrl, designId });
						},
						onDesignClose: () => {
							resolve({ exportUrl: null, designId: null });
						},
					});
				});
				exportUrl = result?.exportUrl;
				designId = result?.designId;
			}
			if (exportUrl && designId) {
				// Resize and convert the image.
				if (checkSize && (await maxWidthAndHeightErrorInCanva(exportUrl))) {
					toast({
						position: 'top',
						title: 'Image size error.',
						description: 'The artwork image must be a square',
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
				} else {
					setNewDesignId && setNewDesignId(designId);
					setImageFile && setImageFile(null);
					setImageSrc(exportUrl);
				}
			}
		} catch (error) {
			console.error('Error Canva occurred:', error);
		} finally {
			forceCloseCanva();
		}
	};

	useEffect(() => {
		if (apiCanvaInstance) {
			openCanva();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiCanvaInstance]);
	return (
		<Flex
			w={w}
			h={h}
			py='16px'
			bg='bg.secondary'
			align='center'
			justify='center'
			borderRadius='10px'
			cursor='pointer'
			onClick={initializeCanva}
		>
			<Flex justify={justify} align='center' flexDir={flexDir}>
				{create ? <Icon as={CanvaIcon} boxSize='40px' /> : <EditIcon />}
				<Text
					mt={textMarginTop}
					ml={textMarginLeft}
					fontSize='14px'
					fontWeight='400'
					color='secondary'
					maxW={'80%'}
					textAlign={'center'}
				>
					{title}
				</Text>
			</Flex>
		</Flex>
	);
};

export default Canva;
