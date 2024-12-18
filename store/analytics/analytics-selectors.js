const getFilters = state => state.analytics.filters;
const getAnalyticsData = state => state.analytics.analyticsData;
const getAnalyticsDataFromGoogle = state => state.analytics.analyticsDataFromGoogle;
const getChartType = state => state.analytics.chart.chartType;
const getTypeGoogleAnalytics = state => state.analytics.typeGoogleAnalytics;
const getIsLoading = state => state.analytics.isLoading;

const analyticsSelectors = {
	getFilters,
	getAnalyticsData,
	getAnalyticsDataFromGoogle,
	getChartType,
	getTypeGoogleAnalytics,
	getIsLoading,
};

export default analyticsSelectors;
