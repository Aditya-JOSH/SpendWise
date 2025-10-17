import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2, Tag, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Food', transaction_count: 15 },
        { id: 2, name: 'Transportation', transaction_count: 8 },
        { id: 3, name: 'Entertainment', transaction_count: 12 },
        { id: 4, name: 'Shopping', transaction_count: 6 },
        { id: 5, name: 'Utilities', transaction_count: 4 },
        { id: 6, name: 'Healthcare', transaction_count: 3 },
        { id: 7, name: 'Education', transaction_count: 2 },
        { id: 8, name: 'Travel', transaction_count: 1 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const onSubmit = (data) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id 
          ? { ...category, name: data.name }
          : category
      ));
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        name: data.name,
        transaction_count: 0
      };
      setCategories([...categories, newCategory]);
    }

    reset();
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    reset({
      name: category.name
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category.transaction_count > 0) {
      alert('Cannot delete category with existing transactions. Please reassign or delete transactions first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    reset();
  };

  const totalTransactions = categories.reduce((sum, category) => sum + category.transaction_count, 0);

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Categories</h1>
          <p>Organize your transactions with custom categories</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={16} />
          New Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="category-form-container">
          <div className="form-header">
            <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                {...register('name', { 
                  required: 'Category name is required',
                  validate: (value) => {
                    const exists = categories.some(cat => 
                      cat.name.toLowerCase() === value.toLowerCase() && 
                      cat.id !== editingCategory?.id
                    );
                    return !exists || 'Category name already exists';
                  }
                })}
                placeholder="e.g., Food, Transportation, Entertainment"
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Summary */}
      <div className="categories-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Tag size={24} />
          </div>
          <div className="summary-content">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <AlertCircle size={24} />
          </div>
          <div className="summary-content">
            <h3>{totalTransactions}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <Tag size={48} className="empty-icon" />
            <h3>No categories yet</h3>
            <p>Create your first category to organize your transactions</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <PlusCircle size={16} />
              Create Category
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon">
                  <Tag size={20} />
                </div>
                <div className="category-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => handleEdit(category)}
                    title="Edit Category"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-icon"
                    onClick={() => handleDelete(category.id)}
                    title="Delete Category"
                    disabled={category.transaction_count > 0}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="category-content">
                <h3>{category.name}</h3>
                <div className="category-stats">
                  <span className="transaction-count">
                    {category.transaction_count} transaction{category.transaction_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {category.transaction_count > 0 && (
                <div className="category-warning">
                  <AlertCircle size={14} />
                  <span>Cannot delete - has transactions</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Usage Tips */}
      <div className="usage-tips">
        <h3>Tips for Managing Categories</h3>
        <ul>
          <li>Create specific categories for different types of expenses</li>
          <li>Use consistent naming conventions (e.g., "Food & Dining" instead of "Food" and "Dining")</li>
          <li>Categories with transactions cannot be deleted - reassign transactions first</li>
          <li>Consider creating subcategories for detailed tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;