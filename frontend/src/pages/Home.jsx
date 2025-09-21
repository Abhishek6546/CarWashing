import { useState, useEffect, useRef } from 'react';
import { Plus, Filter, AlertCircle, TrendingUp, Calendar, Users, DollarSign, Activity, Sparkles } from 'lucide-react';
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

  // Use ref to track if we need to fetch data
  const shouldFetch = useRef(true);
  const lastFiltersRef = useRef(null);
  // Keep the latest filters in a ref to avoid stale closures in async code
  const latestFiltersRef = useRef(filters);
  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

  // Update stats based on current page data
  const updateStats = (currentBookings, totalCount) => {
    setAllStats({
      total: totalCount,
      pending: currentBookings.filter(b => b.status === 'Pending').length,
      confirmed: currentBookings.filter(b => b.status === 'Confirmed').length,
      completed: currentBookings.filter(b => b.status === 'Completed').length,
      revenue: currentBookings.reduce((sum, b) => sum + (b.price || 0), 0)
    });
  };

  // Fetch all bookings (frontend pagination)
  const fetchBookings = async (params = {}) => {
    try {
      setLoading(true);
      // Merge with the latest filters (not the closed-over value)
      const merged = { ...latestFiltersRef.current, ...params };
      const { page: pageParam, limit: limitParam, ...nonPaginationFilters } = merged;

      // We'll fetch all pages from the backend (in case backend enforces pagination)
      const serverLimit = 100; // batch size per request to accumulate all
      let page = 1;
      let all = [];
      let pagesFromServer = 1;
      let hasNext = false;
      let safetyCounter = 0;

      do {
        const resp = await bookingAPI.getBookings({
          ...nonPaginationFilters,
          page,
          limit: serverLimit,
        });
        const chunk = Array.isArray(resp?.data) ? resp.data : [];
        all = all.concat(chunk);
        const pag = resp?.pagination || {};
        pagesFromServer = parseInt(pag.pages) || pagesFromServer;
        hasNext = Boolean(pag.hasNext) || (pagesFromServer > page);
        page += 1;
        safetyCounter += 1;
       
        if (!chunk.length) break;
      } while (hasNext && safetyCounter < 50);

      setAllBookings(all);

      // Use the latest filters at the time the response arrives to decide which page to show (client-side)
      const latest = latestFiltersRef.current;
      const uiLimit = parseInt(latest?.limit ?? limitParam) || 9;
      const requestedPage = parseInt(latest?.page) || 1;

      const totalPages = Math.max(1, Math.ceil(all.length / uiLimit));
      const current = Math.min(Math.max(1, requestedPage), totalPages);

      // Update pagination
      setPagination({
        current,
        pages: totalPages,
        total: all.length,
        hasNext: current < totalPages,
        hasPrev: current > 1
      });

      // Update current page slice
      updateCurrentPageData(current, all, uiLimit);

      // Update stats from all results
      updateStats(all, all.length);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Slice the allBookings for current page
  const updateCurrentPageData = (page, all, limit = 9) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setBookings(all.slice(startIndex, endIndex));
  };

  // Check if filters have actually changed
  const filtersChanged = (newFilters, oldFilters) => {
    if (!oldFilters) return true;

    const keys = Object.keys(newFilters);
    return keys.some(key => newFilters[key] !== oldFilters[key]);
  };

  // State to store all bookings for client-side pagination
  const [allBookings, setAllBookings] = useState([]);

  // Main effect for initial load and filter changes
  useEffect(() => {
    // Skip search query results
    if (searchQuery) return;

    // Build clean filters with defaults
    const cleanFilters = {
      page: parseInt(filters.page) || 1,
      limit: parseInt(filters.limit) || 9,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
      serviceType: filters.serviceType || '',
      carType: filters.carType || '',
      status: filters.status || '',
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || ''
    };

    // Remove pagination from comparison (fetch only when non-page filters change)
    const { page, limit, ...filtersForComparison } = cleanFilters;
    const currentFilters = JSON.stringify(filtersForComparison);

    // If only the page changed, just slice the existing data (avoid doing this while data hasn't loaded)
    if (lastFiltersRef.current === currentFilters) {
      if (allBookings.length === 0) {
        // Data still loading; let fetchBookings handle slicing when it finishes
        return;
      }
      const totalPages = Math.max(1, Math.ceil(allBookings.length / cleanFilters.limit));
      const current = Math.min(Math.max(1, cleanFilters.page), totalPages);

      updateCurrentPageData(current, allBookings, cleanFilters.limit);
      setPagination({
        current,
        pages: totalPages,
        total: allBookings.length,
        hasNext: current < totalPages,
        hasPrev: current > 1
      });
      return;
    }

    // Non-pagination filters changed: fetch all again
    lastFiltersRef.current = currentFilters;
    fetchBookings({ page: cleanFilters.page });
  }, [filters, searchQuery]);

  // Search bookings
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilters(prev => ({ ...prev, page: 1 }));
      return;
    }

    try {
      setSearchLoading(true);
      const response = await bookingAPI.searchBookings(query);
      setBookings(response.data);

      setPagination({
        current: 1,
        pages: 1,
        total: response.data.length,
        hasNext: false,
        hasPrev: false
      });

      // Update stats for search results
      updateStats(response.data, response.data.length);
    } catch (err) {
      toast.error('Search failed');
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Clear search when filters change
    if (searchQuery) {
      setSearchQuery('');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (searchQuery) {
      return; // Don't paginate search results
    }

    const pageNum = parseInt(page);

    // Only update if the page is different
    if (pageNum !== filters.page) {
      console.log('Page changed to:', pageNum);
      console.log('Current filters:', filters);

      // Update filters which will trigger the effect
      setFilters(prev => ({
        ...prev,
        page: pageNum
      }));

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      toast.success('Booking deleted successfully');

      if (searchQuery) {
        await handleSearch(searchQuery);
      } else {
        // Check if we need to go back a page
        const currentPageBookings = bookings.length;
        if (currentPageBookings === 1 && pagination.current > 1) {
          setFilters(prev => ({ ...prev, page: pagination.current - 1 }));
        } else {
          // Refresh current page
          await fetchBookings(filters);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking');
    }
  };

  // Stats state
  const [allStats, setAllStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    revenue: 0
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-indigo-200 rounded-full opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{getGreeting()}</p>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-lg flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>Manage and track all your car wash appointments</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/add-booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 justify-center group"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>New Booking</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allStats.total}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{allStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{allStats.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{allStats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${allStats.revenue}</div>
                <div className="text-sm text-emerald-100">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by customer name, car make, or model..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 lg:hidden flex items-center space-x-2 ${showFilters
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>



        {/* Main Content */}
        <div className="flex gap-6  ">
          {/* Filter Sidebar */}
          <div className='sticky top-0'>
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Bookings Grid */}
          <div className="flex-1 min-w-0">
            {/* Search Query Display */}
            {searchQuery && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Search Results</p>
                    <p className="text-sm text-blue-700">
                      Found <span className="font-semibold">{bookings.length} result{bookings.length !== 1 ? 's' : ''}</span> for "{searchQuery}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-red-200 shadow-lg p-8 text-center">
                <div className="p-4 bg-red-100 rounded-full inline-flex mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Something went wrong</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => fetchBookings(filters)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all shadow-lg"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && bookings.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-12 text-center">
                <div className="text-6xl mb-6">
                  {searchQuery ? '🔍' : '🚗'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {searchQuery ? 'No search results' : 'No bookings found'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any bookings matching "${searchQuery}". Try adjusting your search terms or filters.`
                    : 'Ready to get started? Create your first car wash booking and begin managing your appointments.'
                  }
                </p>
                {!searchQuery && (
                  <Link
                    to="/add-booking"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create First Booking</span>
                  </Link>
                )}
              </div>
            )}

            {/* Bookings Grid */}
            {!loading && !error && bookings.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bookings.map((booking, index) => (
                    <div
                      key={booking._id}
                      className="transform transition-all duration-200 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <BookingCard
                        booking={booking}
                        onDelete={handleDeleteBooking}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {!searchQuery && pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.current}
                    totalPages={pagination.pages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Floating Menu */}
        {!loading && bookings.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <div className="flex flex-col space-y-2">
              <Link
                to="/add-booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all group"
                title="New Booking"
              >
                <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;