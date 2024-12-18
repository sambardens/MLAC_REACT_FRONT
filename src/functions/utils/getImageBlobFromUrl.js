import axios from 'axios';

async function getImageBlobFromUrl(url) {
	const response = await axios({
		url: url,
		method: 'GET',
		responseType: 'blob',
	});
	return response.data;
}

export default getImageBlobFromUrl;
