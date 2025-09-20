import { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const serviceTypes = ['Basic Wash', 'Deluxe Wash', 'Full Detailing'];
  const carTypes = ['sedan', 'suv', 'hatchback', 'luxury', 'pickup', 'convertible'];
  const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc' },
    { value: 'createdAt', label: 'Oldest First', order: 'asc' },
    { value: 'price', label: 'Price: Low to High', order: 'asc' },
    { value: 'price', label: 'Price: High to Low', order: 'desc' },
    { value: 'date', label: 'Date: Earliest', order: 'asc' },
    { value: 'date', label: 'Date: Latest', order: 'desc' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (sortBy, sortOrder) => {
    const newFilters = { ...localFilters, sortBy, sortOrder };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      serviceType: '',
      carType: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value && value !== 'createdAt' && value !== 'desc'
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto bg-white border-r border-gray-200 
        w-80 lg:w-72 p-6 overflow-y-auto z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                title="Clear all filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Service Type */}
          <div>
            <label className="form-label">Service Type</label>
            <select
              className="form-select"
              value={localFilters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            >
              <option value="">All Services</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Car Type */}
          <div>
            <label className="form-label">Car Type</label>
            <select
              className="form-select"
              value={localFilters.carType}
              onChange={(e) => handleFilterChange('carType', e.target.value)}
            >
              <option value="">All Car Types</option>
              {carTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="form-label">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                className="form-input"
                placeholder="From date"
                value={localFilters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
              <input
                type="date"
                className="form-input"
                placeholder="To date"
                value={localFilters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleSortChange(sortBy, sortOrder);
              }}
            >
              {sortOptions.map((option, index) => (
                <option 
                  key={index} 
                  value={`${option.value}-${option.order}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Count */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active filters</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium">
                  {Object.values(localFilters).filter(value => 
                    value && value !== 'createdAt' && value !== 'desc'
                  ).length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;