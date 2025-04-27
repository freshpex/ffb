// Example formatter function
export function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

// Format currency function
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}
