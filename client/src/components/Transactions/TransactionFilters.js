import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const TransactionFilters = ({
  budgets,
  categories,
  searchTerm,
  setSearchTerm,
  selectedBudget,
  setSelectedBudget,
  selectedCategory,
  setSelectedCategory,
  dateRange,
  setDateRange,
  summaryCount = 0,
  totalAmount = 0,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
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
          <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)}>
            <option value="">All Budgets</option>
            {budgets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.attributes?.name || b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <button onClick={() => setShowDatePicker(!showDatePicker)} className="date-range">
            {dateRange[0].startDate && dateRange[0].endDate
              ? `${format(dateRange[0].startDate, 'MMM dd, yyyy')} - ${format(dateRange[0].endDate, 'MMM dd, yyyy')}`
              : 'Select date range'}
          </button>

          {showDatePicker && (
            <div className="absolute z-50 mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowDatePicker(false)} className="btn btn-outline">
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDatePicker(false);
                  }}
                  className="btn btn-primary"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="filter-group">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.attributes?.name || c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="transactions-summary">
        <span>{summaryCount} transactions</span>
        <span className="total-amount">Total: ${Number(totalAmount || 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TransactionFilters;
