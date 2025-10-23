import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { budgetsAPI } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';
import BudgetForm from './BudgetForm';
import BudgetsGrid from './BudgetsGrid';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const res = await budgetsAPI.getAll();
        const items = res.data?.data || [];

        const mapped = items.map((b) => {
          const attrs = b.attributes || {};
          return {
            id: b.id || attrs.id,
            name: attrs.name || b.name,
            financial_goal: parseFloat(attrs.financial_goal || 0),
            spent: parseFloat(attrs.spent || 0),
            remaining: parseFloat(attrs.remaining || 0),
            created_at: attrs.created_at ? new Date(attrs.created_at).toLocaleString() : '',
          };
        });
        setBudgets(mapped);
      } catch (err) {
        console.error('Failed to load budgets', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    setLoading(true);
    try {
      await budgetsAPI.delete(budgetId);
      setBudgets((prev) => prev.filter((b) => String(b.id) !== String(budgetId)));
    } catch (err) {
      console.error('Delete budget failed', err);
      alert('Failed to delete budget');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (updatedBudgets) => {
    setBudgets(updatedBudgets);
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  if (loading) return <LoadingSpinner message="Loading budgets..." />;

  return (
    <div className="budgets-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Budgets</h1>
          <p>Manage your financial goals and track your spending</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <PlusCircle size={16} /> New Budget
        </button>
      </header>

      {showForm && (
        <BudgetForm
          editingBudget={editingBudget}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          budgets={budgets}
        />
      )}

      <BudgetsGrid budgets={budgets} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Budgets;
