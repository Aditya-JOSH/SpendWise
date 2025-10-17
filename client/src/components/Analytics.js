import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,  
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setAnalyticsData({
        spendingTrend: [
          { month: 'Jan', spent: 1850, budget: 3000 },
          { month: 'Feb', spent: 2100, budget: 3000 },
          { month: 'Mar', spent: 1950, budget: 3000 },
          { month: 'Apr', spent: 2200, budget: 3000 },
          { month: 'May', spent: 1800, budget: 3000 },
          { month: 'Jun', spent: 2400, budget: 3000 }
        ],
        categoryBreakdown: [
          { name: 'Food', value: 850, color: '#8884d8' },
          { name: 'Transportation', value: 450, color: '#82ca9d' },
          { name: 'Entertainment', value: 300, color: '#ffc658' },
          { name: 'Shopping', value: 250, color: '#ff7300' },
          { name: 'Utilities', value: 200, color: '#00ff00' },
          { name: 'Healthcare', value: 150, color: '#0088fe' }
        ],
        monthlyComparison: [
          { month: 'Jan', thisYear: 1850, lastYear: 1650 },
          { month: 'Feb', thisYear: 2100, lastYear: 1900 },
          { month: 'Mar', thisYear: 1950, lastYear: 1800 },
          { month: 'Apr', thisYear: 2200, lastYear: 2000 },
          { month: 'May', thisYear: 1800, lastYear: 1750 },
          { month: 'Jun', thisYear: 2400, lastYear: 2100 }
        ],
        budgetPerformance: [
          { budget: 'Monthly Budget', spent: 1850, goal: 3000, percentage: 61.7 },
          { budget: 'Vacation Fund', spent: 1200, goal: 5000, percentage: 24.0 },
          { budget: 'Emergency Fund', spent: 0, goal: 10000, percentage: 0 }
        ],
        summary: {
          totalSpent: 12300,
          totalBudget: 18000,
          averageMonthly: 2050,
          topCategory: 'Food',
          savingsRate: 31.7
        }
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Analytics</h1>
          <p>Insights into your spending patterns and financial trends</p>
        </div>
        <div className="header-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="card-icon">
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <h3>Total Spent</h3>
            <p className="card-amount">${analyticsData.summary?.totalSpent?.toLocaleString()}</p>
            <span className="card-subtitle">This period</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Average Monthly</h3>
            <p className="card-amount">${analyticsData.summary?.averageMonthly?.toLocaleString()}</p>
            <span className="card-subtitle">Spending</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <Calendar size={24} />
          </div>
          <div className="card-content">
            <h3>Savings Rate</h3>
            <p className="card-amount">{analyticsData.summary?.savingsRate}%</p>
            <span className="card-subtitle">Of total budget</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <Filter size={24} />
          </div>
          <div className="card-content">
            <h3>Top Category</h3>
            <p className="card-amount">{analyticsData.summary?.topCategory}</p>
            <span className="card-subtitle">Highest spending</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Spending Trend */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3>Spending Trend</h3>
            <p>Monthly spending vs budget</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="spent" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Spent"
              />
              <Area 
                type="monotone" 
                dataKey="budget" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Budget"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Spending by Category</h3>
            <p>Current period breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.categoryBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year-over-Year Comparison */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Year-over-Year Comparison</h3>
            <p>This year vs last year</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="thisYear" fill="#8884d8" name="This Year" />
              <Bar dataKey="lastYear" fill="#82ca9d" name="Last Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Performance */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Budget Performance</h3>
            <p>Spending vs goals</p>
          </div>
          <div className="budget-performance-list">
            {analyticsData.budgetPerformance?.map((budget, index) => (
              <div key={index} className="budget-performance-item">
                <div className="budget-info">
                  <h4>{budget.budget}</h4>
                  <span>${budget.spent.toLocaleString()} / ${budget.goal.toLocaleString()}</span>
                </div>
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${budget.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{budget.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <TrendingDown size={24} />
            <div className="insight-content">
              <h4>Spending Decreased</h4>
              <p>Your spending in June was 8% lower than May, showing good budget control.</p>
            </div>
          </div>
          
          <div className="insight-card warning">
            <TrendingUp size={24} />
            <div className="insight-content">
              <h4>Food Spending High</h4>
              <p>Food expenses represent 35% of your total spending. Consider meal planning.</p>
            </div>
          </div>
          
          <div className="insight-card positive">
            <DollarSign size={24} />
            <div className="insight-content">
              <h4>Savings Rate Good</h4>
              <p>You're saving 32% of your budget, which is above the recommended 20%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
