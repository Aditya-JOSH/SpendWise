import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TransactionItem = ({ transaction, budgetName, categoryName, onEdit, onDelete }) => {
  const { attributes } = transaction;
  const dateStr = new Date(attributes.date).toLocaleDateString();
  const amount = parseFloat(attributes.amount).toFixed(2);

  return (
    <div className="transaction-item">
      <div className="transaction-main">
        <div className="transaction-info">
          <h4>{attributes.description}</h4>
          <div className="transaction-meta">
            <span className="category">{categoryName}</span>
            <span className="budget">{budgetName}</span>
            <span className="date">{dateStr}</span>
          </div>
        </div>
        <div className="transaction-amount">-${amount}</div>
      </div>

      <div className="transaction-actions">
        <button className="btn-icon" onClick={onEdit} title="Edit Transaction">
          <Edit size={16} />
        </button>
        <button className="btn-icon" onClick={onDelete} title="Delete Transaction">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
