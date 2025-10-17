import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2, Eye, DollarSign } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setBudgets([
        {
          id: 1,
          name: 'Monthly Budget',
          financial_goal: 3000,
          spent: 1850,
          remaining: 1150,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          name: 'Vacation Fund',
          financial_goal: 5000,
          spent: 1200,
          remaining: 3800,
          created_at: '2024-01-15'
        },
        {
          id: 3,
          name: 'Emergency Fund',
          financial_goal: 10000,
          spent: 0,
          remaining: 10000,
          created_at: '2024-01-20'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const onSubmit = (data) => {
    const budgetData = {
      ...data,
      financial_goal: parseFloat(data.financial_goal),
      spent: 0,
      remaining: parseFloat(data.financial_goal)
    };

    if (editingBudget) {
      // Update existing budget
      setBudgets(budgets.map(budget => 
        budget.id === editingBudget.id 
          ? { ...budget, ...budgetData }
          : budget
      ));
    } else {
      // Add new budget
      const newBudget = {
        ...budgetData,
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0]
      };
      setBudgets([...budgets, newBudget]);
    }

    reset();
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    reset({
      name: budget.name,
      financial_goal: budget.financial_goal
    });
    setShowForm(true);
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(budget => budget.id !== budgetId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
    reset();
  };

  if (loading) {
    return (
      <div className="budgets-loading">
        <div className="loading-spinner"></div>
        <p>Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="budgets-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Budgets</h1>
          <p>Manage your financial goals and track your spending</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={16} />
          New Budget
        </button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <div className="budget-form-container">
          <div className="form-header">
            <h3>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h3>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="budget-form">
            <div className="form-group">
              <label htmlFor="name">Budget Name</label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Budget name is required' })}
                placeholder="e.g., Monthly Budget, Vacation Fund"
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="financial_goal">Financial Goal ($)</label>
              <input
                type="number"
                id="financial_goal"
                step="0.01"
                min="0"
                {...register('financial_goal', { 
                  required: 'Financial goal is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                placeholder="0.00"
              />
              {errors.financial_goal && <span className="error">{errors.financial_goal.message}</span>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="budgets-grid">
        {budgets.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} className="empty-icon" />
            <h3>No budgets yet</h3>
            <p>Create your first budget to start tracking your spending</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <PlusCircle size={16} />
              Create Budget
            </button>
          </div>
        ) : (
          budgets.map((budget) => (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <div className="budget-title">
                  <h3>{budget.name}</h3>
                  <span className="budget-date">Created {budget.created_at}</span>
                </div>
                <div className="budget-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => handleEdit(budget)}
                    title="Edit Budget"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-icon"
                    onClick={() => handleDelete(budget.id)}
                    title="Delete Budget"
                  >
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
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min((budget.spent / budget.financial_goal) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  {((budget.spent / budget.financial_goal) * 100).toFixed(1)}% used
                </div>
              </div>

              <div className="budget-footer">
                <button className="btn btn-outline">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Budgets;
