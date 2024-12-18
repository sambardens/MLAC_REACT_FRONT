function getUniqueUsers(deals) {
  const usersFromDeals = deals
    .reduce((sum, deal) => {
      const dealUserArray = deal.users;
      const updatedSumArray = [...sum, ...dealUserArray];
      return updatedSumArray;
    }, []);

  const includedUserIds = [];
  const uniqueUsers = usersFromDeals.filter((user) => {
    const isAlreadyIncluded = includedUserIds.includes(user.userId);
    includedUserIds.push(user.userId);
    return !isAlreadyIncluded;
  });

  return uniqueUsers;
}

export default getUniqueUsers;
