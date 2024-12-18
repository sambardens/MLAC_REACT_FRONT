const getFilteredData = state => state.income.filteredData;
const getIncomes = state => state.income.incomes;

const incomeSelectors = {
	getFilteredData,
	getIncomes,
};

export default incomeSelectors;
