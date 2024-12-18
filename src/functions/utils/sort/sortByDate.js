function sortByDate(deals) {
  const sortedDeals = deals ? [...deals].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  ) : []
  return sortedDeals;
}

export default sortByDate;
