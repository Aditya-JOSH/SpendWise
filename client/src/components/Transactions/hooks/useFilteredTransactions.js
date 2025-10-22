import { useMemo } from 'react';

const useFilteredTransactions = (transactions, searchTerm, selectedBudget, selectedCategory, dateRange) => {
  return useMemo(() => {
    return transactions.filter((t) => {
      const desc = (t.attributes.description || '').toLowerCase();
      const matchesSearch = desc.includes(searchTerm.toLowerCase());
      const matchesBudget = !selectedBudget || t.relationships.budget?.data?.id === selectedBudget;
      const matchesCategory = !selectedCategory || t.relationships.category?.data?.id === selectedCategory;
      const transactionDate = new Date(t.attributes.date);
      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      const matchesDate = !start || !end || (transactionDate >= start && transactionDate <= end);

      return matchesSearch && matchesBudget && matchesCategory && matchesDate;
    });
  }, [transactions, searchTerm, selectedBudget, selectedCategory, dateRange]);
};

export default useFilteredTransactions;
