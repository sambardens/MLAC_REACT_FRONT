import { useMemo } from 'react';

const useCountWithPercentage = (dataArray, key, maxItems = 4, showOther = true) => {
	const dataCounts = useMemo(() => {
		if (!dataArray) {
			return;
		}

		const counts = dataArray.reduce((acc, item) => {
			const value = item.dimensionValues[0].value;
			acc[value] = (acc[value] || 0) + 1;
			return acc;
		}, {});

		const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

		const data = Object.keys(counts).map(value => ({
			[key]: value,
			repeat: counts[value],
			percentage: Math.round((counts[value] / totalCount) * 100),
		}));

		// Sort the array in descending order of percentages
		data.sort((a, b) => b.percentage - a.percentage);

		const result = data.slice(0, maxItems);

		// If there are more items than maxItems, combine them into the "Other" category
		if (data.length > maxItems && showOther) {
			const otherCount = data.slice(maxItems).reduce((sum, item) => sum + item.repeat, 0);
			const otherPercentage = Math.round((otherCount / totalCount) * 100);
			result.push({ [key]: 'Other', repeat: otherCount, percentage: otherPercentage });
		}

		return result;
	}, [dataArray, key, maxItems, showOther]);

	return dataCounts;
};

export default useCountWithPercentage;
