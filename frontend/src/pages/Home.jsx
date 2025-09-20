import { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Loading, { BookingCardSkeleton } from '../components/Loading';

const HomePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const [filters, setFilters] = useState({
    serviceType: '',
    carType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 9
  });

  // Fetch bookings with current filters and pagination
  const fetchBookings = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = { ...filters, ...params };
      const response = await bookingAPI.getBookings(queryParams);
      
      setBookings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Search bookings
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is cleared, fetch regular bookings
      await fetchBookings({ page: 1 });
      return;
    }

    try {
      setSearchLoading(true);
      const response = await bookingAPI.searchBookings(query);
      setBookings(response.data);
      
      // Reset pagination for search results
      setPagination({
        current: 1,
        pages: 1,
        total: response.data.length,
        hasNext: false,
        hasPrev: false
      });
    } catch (err) {
      toast.error('Search failed');
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  }, [fetchBookings]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    const updatedFilters = { ...newFilters, page: 1 }; // Reset to first page
    setFilters(prev => ({ ...prev, ...updatedFilters }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      
      // Refresh bookings
      if (searchQuery) {
        await handleSearch(searchQuery);
      } else {
        await fetchBookings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking');
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    if (!searchQuery) {
      fetchBookings();
    }
  }, [fetchBookings, searchQuery]);

  // Stats calculation
  const stats = {
    total: pagination.total,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Wash Bookings</h1>
          <p className="text-gray-600 mt-1">Manage and track all your car wash appointments</p>
        </div>
        <Link
          to="/add-booking"
          className="btn btn-primary flex items-center space-x-2 justify-center sm:justify-start"
        >
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by customer name, car make, or model..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary flex items-center space-x-2 lg:hidden"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Bookings Grid */}
        <div className="flex-1 min-w-0">
          {/* Search Query Display */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Showing search results for: <span className="font-medium">"{searchQuery}"</span>
                {bookings.length > 0 && ` (${bookings.length} results)`}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchBookings()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <BookingCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && bookings.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No search results' : 'No bookings found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No bookings match "${searchQuery}". Try adjusting your search terms.`
                  : 'Get started by creating your first car wash booking.'
                }
              </p>
              {!searchQuery && (
                <Link to="/add-booking" className="btn btn-primary">
                  Create First Booking
                </Link>
              )}
            </div>
          )}

          {/* Bookings Grid */}
          {!loading && !error && bookings.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onDelete={handleDeleteBooking}
                  />
                ))}
              </div>

              {/* Pagination - Only show if not in search mode */}
              {!searchQuery && pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.current}
                  totalPages={pagination.pages}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;