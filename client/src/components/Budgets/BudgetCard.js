import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const progressPercent = Math.min((budget.spent / budget.financial_goal) * 100, 100);

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div className="budget-title">
          <h3>{budget.name}</h3>
          <span className="budget-date">Created {budget.created_at}</span>
        </div>
        <div className="budget-actions">
          <button className="btn-icon" onClick={() => onEdit(budget)} title="Edit Budget">
            <Edit size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(budget.id)} title="Delete Budget">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="budget-stats">
        <div className="stat-item">
          <span className="stat-label">Goal</span>
          <span className="stat-value">${budget.financial_goal.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Spent</span>
          <span className="stat-value spent">${budget.spent.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Remaining</span>
          <span className="stat-value remaining">${budget.remaining.toLocaleString()}</span>
        </div>
      </div>

      <div className="budget-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-text">{progressPercent.toFixed(1)}% used</div>
      </div>

      <div className="budget-footer">
        <button className="btn btn-outline">
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;
