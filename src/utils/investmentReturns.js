export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const calculateExpectedReturn = (amount, planOrInvestment = {}) => {
  const numericAmount = Number(amount) || 0;
  const baseAmount = Number(planOrInvestment.baseAmount);
  const roiAmount = Number(
    planOrInvestment.roiAmount ??
      planOrInvestment.expectedReturn ??
      planOrInvestment.returnAmount,
  );

  if (numericAmount > 0 && baseAmount > 0 && roiAmount > 0) {
    return (numericAmount / baseAmount) * roiAmount;
  }

  if (roiAmount > 0 && (!numericAmount || numericAmount === Number(planOrInvestment.amount))) {
    return roiAmount;
  }

  const rate = Number(planOrInvestment.returnRate ?? planOrInvestment.roi) || 0;
  return (numericAmount * rate) / 100;
};

export const formatExpectedReturn = (amount, planOrInvestment = {}) =>
  formatCurrency(calculateExpectedReturn(amount, planOrInvestment));
