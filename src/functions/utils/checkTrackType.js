const types = ['acoustic', 'live', 'edit', 'version', 'remix', 'demo'];

function checkTrackType(str) {
	// Инициализируем начальные значения
	let name = str;
	let type = '';

	// Проверяем, содержит ли строка "-" или "("
	if (str.includes('-')) {
		const parts = str.split('-');
		name = parts[0].trim();
		type = parts[1].trim();
	} else if (str.includes('(')) {
		const parts = str.split('(');
		name = parts[0].trim();
		type = parts[1].replace(')', '').trim();
	}

	// Проверяем, содержится ли одно из слов из списка types во второй части
	const typeWords = type.split(' ');

	let hasMatchingType = false;

	for (const word of typeWords) {
		if (types.includes(word.toLowerCase())) {
			hasMatchingType = true;
			break;
		}
	}

	if (!hasMatchingType) {
		return { name: str, type: '' };
	}

	return { name, type };
}

export default checkTrackType;
