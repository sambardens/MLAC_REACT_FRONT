import { releaseTypes } from '@/components/Releases/Menus/AddNameMenu/releaseTypes';

const getReleaseType = spotifyType => {
	if (spotifyType === 'album') return 'Standard Album';
	const type = releaseTypes.find(el => el.value.toLowerCase() === spotifyType);
	return type?.value || '';
};

export default getReleaseType;
