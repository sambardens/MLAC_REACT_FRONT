import getGenresFromAudd from 'src/functions/serverRequests/audd/getGenresFromAudd';
import getReleaseType from 'src/functions/utils/getReleaseType';

const getReleaseTypeAndGenres = ({ albumType = '', genreNames = [], mainGenres }) => {
	let type = '';
	if (albumType) {
		type = getReleaseType(albumType);
	}
	const indexToRemove = genreNames.indexOf('Music');
	if (indexToRemove !== -1) {
		genreNames.splice(indexToRemove, 1);
	}
	const genresData = getGenresFromAudd({
		mainGenres,
		genreNames,
	});
	const { mainGenre, secondaryGenre, subGenres } = genresData;
	return {
		genresRequestBody: {
			mainGenreId: mainGenre?.id || null,
			secondaryGenreId: secondaryGenre?.id || null,
			subGenresIds: subGenres.length > 0 ? subGenres.map(el => el.id) : [],
		},
		type,
		genresData,
	};
};
export default getReleaseTypeAndGenres;
