import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { budgetsAPI, categoriesAPI, transactionsAPI } from '../../services/api';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';
import LoadingSpinner from './LoadingSpinner';
import useFilteredTransactions from './hooks/useFilteredTransactions';

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
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);

  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        budgetsAPI.getAll(),
        categoriesAPI.getAll(),
        transactionsAPI.getWithoutBudget(),
      ]);
      setBudgets(budgetsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setTransactions(transactionsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = useFilteredTransactions(
    transactions,
    searchTerm,
    selectedBudget,
    selectedCategory,
    dateRange
  );

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + parseFloat(t.attributes.amount || 0),
    0
  );

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.deleteWithoutBudget(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Delete failed', err);
        alert('Failed to delete transaction');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      description: data.description,
      amount: parseFloat(data.amount),
      date: data.date,
      budget_id: parseInt(data.budget_id),
      category_id: parseInt(data.category_id),
    };

    try {
      if (editingTransaction) {
        const id = editingTransaction.id;
        const { budget_id, ...transactionData } = payload;
        await transactionsAPI.update(budget_id, id, transactionData);

        setTransactions((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  attributes: { ...t.attributes, ...payload },
                  relationships: {
                    ...t.relationships,
                    budget: { data: { id: String(payload.budget_id), type: 'budget' } },
                    category: { data: { id: String(payload.category_id), type: 'category' } },
                  },
                }
              : t
          )
        );
      } else {
        const { budget_id, ...transactionData } = payload;
        const res = await transactionsAPI.create(budget_id, transactionData);
        setTransactions((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      console.error('Transaction save failed', err);
      alert('Failed to save transaction');
      throw err;
    } finally {
      setShowForm(false);
      setEditingTransaction(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) return <LoadingSpinner message="Loading transactions..." />;

  return (
    <div className="transactions-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Transactions</h1>
          <p>Track and manage your spending</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <PlusCircle size={16} /> New Transaction
        </button>
      </header>

      {showForm && (
        <TransactionForm
          budgets={budgets}
          categories={categories}
          onSubmit={handleFormSubmit}
          editingTransaction={editingTransaction}
          onCancel={handleCancel}
        />
      )}

      <TransactionFilters
        budgets={budgets}
        categories={categories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dateRange={dateRange}
        setDateRange={setDateRange}
        summaryCount={filteredTransactions.length}
        totalAmount={totalAmount}
      />

      <TransactionList
        transactions={filteredTransactions}
        budgets={budgets}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Transactions;
