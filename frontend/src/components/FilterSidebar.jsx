import { useState } from 'react';
import { Filter, X, RotateCcw, Car, Calendar, TrendingUp, Package } from 'lucide-react';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const serviceTypes = [
    { value: 'Basic Wash', label: 'Basic Wash', price: '$25' },
    { value: 'Deluxe Wash', label: 'Deluxe Wash', price: '$50' },
    { value: 'Full Detailing', label: 'Full Detailing', price: '$100' }
  ];
  
  const carTypes = [
    { value: 'sedan', label: 'Sedan', icon: '🚗' },
    { value: 'suv', label: 'SUV', icon: '🚙' },
    { value: 'hatchback', label: 'Hatchback', icon: '🚗' },
    { value: 'luxury', label: 'Luxury', icon: '🏎️' },
    { value: 'pickup', label: 'Pickup', icon: '🛻' },
    { value: 'convertible', label: 'Convertible', icon: '🏎️' }
  ];
  
  const statuses = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];
  
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc', icon: Calendar },
    { value: 'createdAt', label: 'Oldest First', order: 'asc', icon: Calendar },
    { value: 'price', label: 'Price: Low to High', order: 'asc', icon: TrendingUp },
    { value: 'price', label: 'Price: High to Low', order: 'desc', icon: TrendingUp },
    { value: 'date', label: 'Date: Earliest', order: 'asc', icon: Calendar },
    { value: 'date', label: 'Date: Latest', order: 'desc', icon: Calendar }
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto bg-white/95 backdrop-blur-md border-r border-white/20 
        w-80 lg:w-72 p-6 overflow-y-auto z-50 transition-all duration-300 ease-in-out shadow-xl lg:shadow-lg lg:rounded-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <p className="text-xs text-gray-500">Refine your search</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                title="Clear all filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Service Type */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Package className="h-4 w-4 text-blue-500" />
              <span>Service Type</span>
            </label>
            <div className="space-y-2">
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300"
                  value={localFilters.serviceType}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                >
                  <option value="">All Services</option>
                  {serviceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.price}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Car Type */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Car className="h-4 w-4 text-green-500" />
              <span>Car Type</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {carTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange('carType', 
                    localFilters.carType === type.value ? '' : type.value
                  )}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    localFilters.carType === type.value
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md transform scale-105'
                      : 'border-gray-200 bg-white/80 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:scale-102'
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div>{type.label}</div>
                </button>
              ))}
            </div>
            {localFilters.carType && (
              <button
                onClick={() => handleFilterChange('carType', '')}
                className="mt-2 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Status */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span>Status</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => handleFilterChange('status', 
                    localFilters.status === status.value ? '' : status.value
                  )}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium text-left ${
                    localFilters.status === status.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md transform scale-105'
                      : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${status.color} mr-2`}>
                    {status.label}
                  </span>
                  {status.label}
                </button>
              ))}
            </div>
            {localFilters.status && (
              <button
                onClick={() => handleFilterChange('status', '')}
                className="mt-2 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Date Range */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span>Date Range</span>
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">From Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  value={localFilters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">To Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  value={localFilters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
              {(localFilters.dateFrom || localFilters.dateTo) && (
                <button
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear date range
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="group">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <span>Sort By</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Active Filters</span>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {Object.values(localFilters).filter(value => 
                    value && value !== 'createdAt' && value !== 'desc'
                  ).length}
                </div>
              </div>
              
              <div className="space-y-2">
                {Object.entries(localFilters).map(([key, value]) => {
                  if (!value || value === 'createdAt' || value === 'desc') return null;
                  
                  let displayValue = value;
                  if (key === 'carType') {
                    displayValue = carTypes.find(t => t.value === value)?.label || value;
                  }
                  
                  return (
                    <div 
                      key={key} 
                      className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-sm"
                    >
                      <span className="text-blue-800 font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {displayValue}
                      </span>
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="text-blue-600 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;