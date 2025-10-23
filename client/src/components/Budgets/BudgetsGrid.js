import React from 'react';
import { Edit, Trash2, Eye, DollarSign, PlusCircle } from 'lucide-react';
import BudgetCard from './BudgetCard';

const BudgetsGrid = ({ budgets, onEdit, onDelete }) => {
  if (budgets.length === 0) {
    return (
      <div className="empty-state">
        <DollarSign size={48} className="empty-icon" />
        <h3>No budgets yet</h3>
        <p>Create your first budget to start tracking your spending</p>
        <button className="btn btn-primary" onClick={() => onEdit(null)}>
          <PlusCircle size={16} /> Create Budget
        </button>
      </div>
    );
  }

  return (
    <div className="budgets-grid">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default BudgetsGrid;
