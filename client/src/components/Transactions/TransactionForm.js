import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const TransactionForm = ({ budgets, categories, onSubmit, editingTransaction, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingTransaction) {
      reset({
        description: editingTransaction.attributes.description,
        amount: editingTransaction.attributes.amount,
        date: editingTransaction.attributes.date.split('T')[0],
        budget_id: editingTransaction.relationships.budget?.data?.id,
        category_id: editingTransaction.relationships.category?.data?.id,
      });
    } else {
      reset();
    }
  }, [editingTransaction, reset]);

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      </div>  
      <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label>Description</label>
            <input type="text" {...register('description', { required: 'Description is required' })} placeholder="e.g., Grocery Shopping" />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } })}
              placeholder="0.00"
            />
            {errors.amount && <span className="error">{errors.amount.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" {...register('date', { required: 'Date is required' })} />
            {errors.date && <span className="error">{errors.date.message}</span>}
          </div>

          <div className="form-group">
            <label>Budget</label>
            <select {...register('budget_id', { required: 'Budget is required' })}>
              <option value="">Select a budget</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.attributes?.name || b.name}
                </option>
              ))}
            </select>
            {errors.budget_id && <span className="error">{errors.budget_id.message}</span>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select {...register('category_id', { required: 'Category is required' })}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.attributes?.name || c.name}
                </option>
              ))}
            </select>
            {errors.category_id && <span className="error">{errors.category_id.message}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
