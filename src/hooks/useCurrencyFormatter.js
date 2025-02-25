import { useMemo } from "react";

const useCurrencyFormatter = () => {
  const formatCurrency = useMemo(() => {
    return (amount) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    };
  }, []);

  return formatCurrency;
};

export default useCurrencyFormatter;
