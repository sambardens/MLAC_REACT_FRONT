import getPreparedDateObj from '../getPreparedDateObj';

function getPreparedPurchases(rawPurchases) {
	console.log(rawPurchases, 'rawPurchases');
	const preparedPurchases = rawPurchases.map(el => {
		const preparedDate = getPreparedDateObj(el.createdAt);
		const preparedPurchase = { ...el, preparedDate };
		return preparedPurchase;
	});

	return preparedPurchases;
}

export default getPreparedPurchases;
