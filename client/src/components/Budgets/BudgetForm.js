import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { budgetsAPI } from '../../services/api';

const BudgetForm = ({ editingBudget, onSubmit, onCancel, budgets }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', financial_goal: 0 },
  });

  useEffect(() => {
    if (editingBudget) {
      reset({
        name: editingBudget.name,
        financial_goal: editingBudget.financial_goal,
      });
    } else {
      reset({ name: '', financial_goal: 0 });
    }
  }, [editingBudget, reset]);

  const submitHandler = async (data) => {
    const payload = {
      name: data.name,
      financial_goal: parseFloat(data.financial_goal),
    };

    try {
      if (editingBudget) {
        const res = await budgetsAPI.update(editingBudget.id, { budget: payload });
        const returned = res.data?.data || res.data;
        const attrs = returned?.attributes || payload;

        const updatedBudgets = budgets.map((b) =>
          String(b.id) === String(returned?.id || editingBudget.id)
            ? {
                ...b,
                name: attrs.name,
                financial_goal: parseFloat(attrs.financial_goal || b.financial_goal),
                spent: parseFloat(attrs.spent || b.spent),
                remaining: parseFloat(attrs.remaining || b.remaining),
                created_at: attrs.created_at || b.created_at,
              }
            : b
        );
        onSubmit(updatedBudgets);
      } else {
        const res = await budgetsAPI.create({ budget: payload });
        const returned = res.data?.data || res.data;
        const attrs = returned?.attributes || payload;

        const newBudget = {
          id: returned?.id || Date.now(),
          name: attrs.name,
          financial_goal: parseFloat(attrs.financial_goal || 0),
          spent: 0,
          remaining: parseFloat(attrs.financial_goal || 0),
          created_at: attrs.created_at || new Date().toISOString(),
        };

        onSubmit([newBudget, ...budgets]);
      }
    } catch (err) {
      console.error('Budget save failed', err);
      alert('Failed to save budget');
    }
  };

  return (
    <div className="budget-form-container">
      <div className="form-header">
        <h3>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h3>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="budget-form">
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
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              max: { value: 10000000, message: 'Budget must not be greater than 10,000,000' },
            })}
            placeholder="0.00"
          />
          {errors.financial_goal && <span className="error">{errors.financial_goal.message}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingBudget ? 'Update Budget' : 'Create Budget'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
