import React from 'react';
import TransactionItem from './TransactionItem';
import { Calendar, PlusCircle } from 'lucide-react';

const TransactionList = ({ transactions, budgets, categories, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} className="empty-icon" />
        <h3>No transactions found</h3>
        <p>Add your first transaction to start tracking your spending</p>
        <button className="btn btn-primary" onClick={() => onEdit(null)}>
          <PlusCircle size={16} /> Add Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="transactions-list">
      {transactions.map((t) => {
        const budgetName = budgets.find((b) => b.id === t.relationships.budget?.data?.id)?.attributes?.name || '';
        const categoryName = categories.find((c) => c.id === t.relationships.category?.data?.id)?.attributes?.name || '';
        return (
          <TransactionItem
            key={t.id}
            transaction={t}
            budgetName={budgetName}
            categoryName={categoryName}
            onEdit={() => onEdit(t)}
            onDelete={() => onDelete(t.id)}
          />
        );
      })}
    </div>
  );
};

export default TransactionList;
