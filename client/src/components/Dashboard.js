import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBudgets([
        {
          id: 1,
          name: 'Monthly Budget',
          financial_goal: 3000,
          spent: 1850,
          remaining: 1150
        },
        {
          id: 2,
          name: 'Vacation Fund',
          financial_goal: 5000,
          spent: 1200,
          remaining: 3800
        }
      ]);

      setRecentTransactions([
        { id: 1, description: 'Grocery Shopping', amount: 150, category: 'Food', date: '2024-01-15' },
        { id: 2, description: 'Gas Station', amount: 45, category: 'Transportation', date: '2024-01-14' },
        { id: 3, description: 'Coffee Shop', amount: 12, category: 'Food', date: '2024-01-13' },
        { id: 4, description: 'Movie Tickets', amount: 25, category: 'Entertainment', date: '2024-01-12' },
        { id: 5, description: 'Online Shopping', amount: 89, category: 'Shopping', date: '2024-01-11' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.financial_goal, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Chart data
  const categoryData = [
    { name: 'Food', value: 400, color: '#8884d8' },
    { name: 'Transportation', value: 300, color: '#82ca9d' },
    { name: 'Entertainment', value: 200, color: '#ffc658' },
    { name: 'Shopping', value: 150, color: '#ff7300' },
    { name: 'Utilities', value: 100, color: '#00ff00' }
  ];

  const monthlyData = [
    { month: 'Jan', spent: 1850, budget: 3000 },
    { month: 'Feb', spent: 2100, budget: 3000 },
    { month: 'Mar', spent: 1950, budget: 3000 },
    { month: 'Apr', spent: 2200, budget: 3000 },
    { month: 'May', spent: 1800, budget: 3000 },
    { month: 'Jun', spent: 2400, budget: 3000 }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <h3>Total Budget</h3>
            <p className="card-amount">${totalBudget.toLocaleString()}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon spent">
            <TrendingDown size={24} />
          </div>
          <div className="card-content">
            <h3>Total Spent</h3>
            <p className="card-amount">${totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon remaining">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Remaining</h3>
            <p className="card-amount">${totalRemaining.toLocaleString()}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <PlusCircle size={24} />
          </div>
          <div className="card-content">
            <h3>Quick Add</h3>
            <p className="card-subtitle">New Transaction</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spent" fill="#8884d8" name="Spent" />
              <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budgets Overview */}
      <div className="budgets-section">
        <div className="section-header">
          <h3>Your Budgets</h3>
          <button className="btn btn-primary">
            <PlusCircle size={16} />
            New Budget
          </button>
        </div>

        <div className="budgets-grid">
          {budgets.map((budget) => (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <h4>{budget.name}</h4>
                <div className="budget-actions">
                  <button className="btn-icon">
                    <Eye size={16} />
                  </button>
                  <button className="btn-icon">
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="budget-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(budget.spent / budget.financial_goal) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="budget-stats">
                  <span>${budget.spent.toLocaleString()} / ${budget.financial_goal.toLocaleString()}</span>
                  <span className="budget-remaining">${budget.remaining.toLocaleString()} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <button className="btn btn-secondary">View All</button>
        </div>

        <div className="transactions-list">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <h4>{transaction.description}</h4>
                <p>{transaction.category} • {transaction.date}</p>
              </div>
              <div className="transaction-amount">
                -${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
