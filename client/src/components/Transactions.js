import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2, Search, Filter, Calendar } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setBudgets([
        { id: 1, name: 'Monthly Budget' },
        { id: 2, name: 'Vacation Fund' },
        { id: 3, name: 'Emergency Fund' }
      ]);

      setCategories([
        { id: 1, name: 'Food' },
        { id: 2, name: 'Transportation' },
        { id: 3, name: 'Entertainment' },
        { id: 4, name: 'Shopping' },
        { id: 5, name: 'Utilities' },
        { id: 6, name: 'Healthcare' }
      ]);

      setTransactions([
        {
          id: 1,
          description: 'Grocery Shopping',
          amount: 150.00,
          date: '2024-01-15',
          budget_id: 1,
          category_id: 1,
          budget_name: 'Monthly Budget',
          category_name: 'Food'
        },
        {
          id: 2,
          description: 'Gas Station',
          amount: 45.00,
          date: '2024-01-14',
          budget_id: 1,
          category_id: 2,
          budget_name: 'Monthly Budget',
          category_name: 'Transportation'
        },
        {
          id: 3,
          description: 'Coffee Shop',
          amount: 12.50,
          date: '2024-01-13',
          budget_id: 1,
          category_id: 1,
          budget_name: 'Monthly Budget',
          category_name: 'Food'
        },
        {
          id: 4,
          description: 'Movie Tickets',
          amount: 25.00,
          date: '2024-01-12',
          budget_id: 1,
          category_id: 3,
          budget_name: 'Monthly Budget',
          category_name: 'Entertainment'
        },
        {
          id: 5,
          description: 'Online Shopping',
          amount: 89.99,
          date: '2024-01-11',
          budget_id: 1,
          category_id: 4,
          budget_name: 'Monthly Budget',
          category_name: 'Shopping'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const onSubmit = (data) => {
    const transactionData = {
      ...data,
      amount: parseFloat(data.amount),
      budget_id: parseInt(data.budget_id),
      category_id: parseInt(data.category_id)
    };

    if (editingTransaction) {
      // Update existing transaction
      setTransactions(transactions.map(transaction => 
        transaction.id === editingTransaction.id 
          ? { 
              ...transaction, 
              ...transactionData,
              budget_name: budgets.find(b => b.id === parseInt(data.budget_id))?.name || '',
              category_name: categories.find(c => c.id === parseInt(data.category_id))?.name || ''
            }
          : transaction
      ));
    } else {
      // Add new transaction
      const newTransaction = {
        ...transactionData,
        id: Date.now(),
        budget_name: budgets.find(b => b.id === parseInt(data.budget_id))?.name || '',
        category_name: categories.find(c => c.id === parseInt(data.category_id))?.name || ''
      };
      setTransactions([newTransaction, ...transactions]);
    }

    reset();
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    reset({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      budget_id: transaction.budget_id,
      category_id: transaction.category_id
    });
    setShowForm(true);
  };

  const handleDelete = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
    reset();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBudget = !selectedBudget || transaction.budget_id === parseInt(selectedBudget);
    const matchesCategory = !selectedCategory || transaction.category_id === parseInt(selectedCategory);
    
    return matchesSearch && matchesBudget && matchesCategory;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  if (loading) {
    return (
      <div className="transactions-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Transactions</h1>
          <p>Track and manage your spending</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={16} />
          New Transaction
        </button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="transaction-form-container">
          <div className="form-header">
            <h3>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  placeholder="e.g., Grocery Shopping"
                />
                {errors.description && <span className="error">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                  })}
                  placeholder="0.00"
                />
                {errors.amount && <span className="error">{errors.amount.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <span className="error">{errors.date.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="budget_id">Budget</label>
                <select
                  id="budget_id"
                  {...register('budget_id', { required: 'Budget is required' })}
                >
                  <option value="">Select a budget</option>
                  {budgets.map(budget => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                  ))}
                </select>
                {errors.budget_id && <span className="error">{errors.budget_id.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  {...register('category_id', { required: 'Category is required' })}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <span className="error">{errors.category_id.message}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="">All Budgets</option>
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="transactions-summary">
          <span>{filteredTransactions.length} transactions</span>
          <span className="total-amount">Total: ${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} className="empty-icon" />
            <h3>No transactions found</h3>
            <p>Add your first transaction to start tracking your spending</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <PlusCircle size={16} />
              Add Transaction
            </button>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-info">
                  <h4>{transaction.description}</h4>
                  <div className="transaction-meta">
                    <span className="category">{transaction.category_name}</span>
                    <span className="budget">{transaction.budget_name}</span>
                    <span className="date">{transaction.date}</span>
                  </div>
                </div>
                <div className="transaction-amount">
                  -${transaction.amount.toFixed(2)}
                </div>
              </div>
              
              <div className="transaction-actions">
                <button 
                  className="btn-icon"
                  onClick={() => handleEdit(transaction)}
                  title="Edit Transaction"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon"
                  onClick={() => handleDelete(transaction.id)}
                  title="Delete Transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
