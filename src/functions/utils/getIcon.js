import data from '@/assets/icons/icons.json';

function isEmail(str) {
	// Паттерн для определения электронной почты
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailPattern.test(str);
}
function getIcon(url) {
	const icons = data.icons;

	if (url && isEmail(url)) {
		return icons[icons.length - 1];
	}
	if (url) {
		const segments = url
			.toLowerCase()
			.replace(/^(https?:\/\/)/, '')
			.split(/[^a-zA-Z0-9%]+/);
		let icon;
		for (let i = 0; i < segments.length; i++) {
			const currentEl = segments[i];
			let prevEl;
			let nextEl;

			if (i > 0) {
				prevEl = segments[i - 1];
			}
			if (i < segments.length - 1) {
				nextEl = segments[i + 1];
			}

			icon = icons.find(
				icon =>
					icon.name === currentEl ||
					(prevEl && icon.name === `${prevEl}.${currentEl}`) ||
					(nextEl && icon.name === `$${currentEl}.${nextEl}`),
			);
			if (icon) {
				break;
			}
		}

		return icon || icons[0];
	}
	return icons[0];
}

export default getIcon;
