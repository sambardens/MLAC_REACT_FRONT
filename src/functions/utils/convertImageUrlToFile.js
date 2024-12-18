import axios from 'axios';

const convertImageUrlToFile = async (imageUrl, imageName) => {
	try {
		const { data } = await axios.get(imageUrl, { responseType: 'blob' });
		const fileName = `${imageName || 'release'} avatar`;
		const logoFile = new File([data], fileName, { type: 'image/jpeg' });
		const logo = URL.createObjectURL(logoFile);
		return { logoFile, logo };
	} catch (error) {
		console.error('Error convertImageUrlToFile:', error);
	}
};

export default convertImageUrlToFile;
