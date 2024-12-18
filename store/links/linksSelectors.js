const getSocialLinks = state => state.links.socialLinks;
const getReleaseLinks = state => state.links.releaseLinks;

const linksSelectors = {
	getSocialLinks,
	getReleaseLinks,
};

export default linksSelectors;
