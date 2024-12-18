import { useRouter } from 'next/router';

import { Flex, Icon, useToast } from '@chakra-ui/react';

import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBap, setDefaultReleaseModalMenuScreen } from 'store/slice';

import AddBapBtn from '@/components/Buttons/AddBapButton';
import SearchBtn from '@/components/Buttons/SearchBtn';

import ArrowInRound from '@/assets/icons/base/arrowInRound.svg';

import BapCardSmall from '../../BapCard/BapCard';

const BapsMenu = ({ isMenuWide, setIsMenuWide, bapsMenuBtnHandler }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const { pathname, push } = router;
	const { selectedBap, selectedBapUpdated, baps } = useSelector(state => state.user);
	const [searchQuery, setSearchQuery] = useState('');
	const myRef = useRef(null);
	const toast = useToast();
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
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');

	const bapSelectHandler = async rawSelectedBap => {
		if (selectedBapUpdated?.isEdited) {
			getToast(
				'info',
				'Attention',
				'You have unsaved data in the B.A.P. edit menu. Please press the Save or Cancel button before moving on.',
			);
			return;
		}
		// dispatch(removeLinks());
		dispatch(setDefaultReleaseModalMenuScreen());
		// dispatch(resetSelectedRelease());
		const path = pathname.split('/')[1];
		if (
			path === 'my-splits-contracts' ||
			path === 'my-income' ||
			path === 'create-new-bap' ||
			path === 'welcome'
		) {
			push({
				pathname: '/bap/[bapId]/dashboard',
				query: { bapId: rawSelectedBap.bapId },
			});
		} else if (pathname.includes('[releaseId]')) {
			push({
				pathname: '/bap/[bapId]/releases',
				query: { bapId: rawSelectedBap.bapId },
			});
		} else {
			push({
				pathname,
				query: { bapId: rawSelectedBap.bapId },
			});
		}
	};

	const openNewBapModal = () => {
		if (selectedBapUpdated?.isEdited) {
			getToast(
				'info',
				'Attention',
				'You have unsaved data in the B.A.P. edit menu. Please press the Save or Cancel button before moving on.',
			);

			return;
		}
		if (!selectedBap?.isNew) {
			const newBapData = {
				isNew: true,
				bapId: '',
				bapName: '',
				bapMembers: null,
				role: '',
				bapDescription: '',
				bapArtistBio: '',
				src: '../../../assets/images/logo-primary.png',
				designId: null,
				spotifyId: null,
				facebookPixel: null,
				spotifyUri: null,
				deezerId: null,
				napsterId: null,
				appleMusicId: null,
				genres: {
					mainGenre: null,
					secondaryGenre: null,
					subGenres: [],
				},
				releases: null,
				socialLinks: [],
				brandStyles: {},
				isFullAdmin: true,
				isCreator: true,
				isFirstVisit: 'no',
				soundCloudId: '',
			};
			push('/create-new-bap').then(() => {
				dispatch(setBap(newBapData));
			});
		}
	};

	const filteredBaps =
		baps?.length > 0
			? baps?.filter(bap => {
					const res = bap.bapName.toLowerCase().includes(searchQuery.trim().toLowerCase());
					if (!isMyContractsAndSplitsPage) {
						return res && bap.bapId !== selectedBap?.bapId;
					}
					return res;
			  })
			: [];

	return (
		<Flex
			position={'relative'}
			flexDir={'column'}
			alignItems={'center'}
			w={isMenuWide ? '240px' : '112px'}
			h='100vh'
			bgColor={'black'}
			transition='width 0.3s linear'
			py='24px'
		>
			<Flex
				position={'relative'}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				mb='16px'
				gap='16px'
				w='100%'
				px='24px'
			>
				<AddBapBtn onClick={openNewBapModal} isMenuWide={isMenuWide} />

				{baps?.length > 4 && (
					<SearchBtn
						setSearchQuery={setSearchQuery}
						searchQuery={searchQuery}
						setIsMenuWide={setIsMenuWide}
						isMenuWide={isMenuWide}
					/>
				)}
				{selectedBap.bapId &&
					!selectedBap?.isNew &&
					!isMyContractsAndSplitsPage &&
					selectedBap?.bapName?.toLowerCase()?.includes(searchQuery?.trim()?.toLowerCase()) && (
						<BapCardSmall bap={selectedBap} isMenuWide={isMenuWide} isSelected={true} />
					)}

				<Flex
					as='button'
					size='24px'
					position={'absolute'}
					top='0'
					right='0'
					aria-label={isMenuWide ? 'show narrow bap menu list' : 'show wide bap menu list'}
					color='secondary'
					onClick={bapsMenuBtnHandler}
					transform='translate(50%, 124px)'
				>
					<Icon
						boxSize='24px'
						as={ArrowInRound}
						transform={isMenuWide ? 'rotate(180deg)' : ''}
						transition='0.3s linear'
					/>
				</Flex>
			</Flex>

			{filteredBaps.length > 0 && (
				<Flex
					as='ul'
					ref={myRef}
					flexDir={'column'}
					align='center'
					w='100%'
					overflowY='scroll'
					gap='16px'
					py='4px'
					pl='6px'
				>
					{filteredBaps.map(bap => (
						<BapCardSmall
							key={bap?.bapId}
							bap={bap}
							isMenuWide={isMenuWide}
							bapSelectHandler={bapSelectHandler}
						/>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default BapsMenu;
