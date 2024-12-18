function getProfitSum(purchases = []) {
  const totalProfit = purchases.reduce(((sum, p) => sum + Number(p.gross)), 0);

  return totalProfit;
}

export default getProfitSum;
