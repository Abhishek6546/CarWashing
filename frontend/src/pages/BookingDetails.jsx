import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, Edit, Trash2, Calendar, Clock, Car, DollarSign,
  User, Star, Package, CheckCircle, AlertCircle, Eye,
  Activity, Timer, CreditCard, Sparkles, Award, Shield,
  Phone, Mail, MapPin, Camera, Download, Share2, Bell
} from 'lucide-react';
import { bookingAPI } from '../services/api';
import Loading from '../components/Loading';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingAPI.getBooking(id);
      setBooking(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await bookingAPI.deleteBooking(id);
      toast.success('Booking deleted successfully', {
        icon: '🗑️',
        duration: 4000
      });
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await bookingAPI.updateBooking(id, { status: newStatus });
      setBooking(prev => ({ ...prev, status: newStatus }));
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`, {
        icon: newStatus === 'Confirmed' ? '✅' : '🎉'
      });
    } catch (err) {
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Pending': {
        gradient: 'from-amber-400 to-orange-500',
        bg: 'from-amber-50 to-orange-50',
        text: 'text-amber-900',
        border: 'border-amber-200',
        icon: Timer,
        pulse: true
      },
      'Confirmed': {
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'from-blue-50 to-indigo-50',
        text: 'text-blue-900',
        border: 'border-blue-200',
        icon: CheckCircle,
        pulse: false
      },
      'Completed': {
        gradient: 'from-emerald-500 to-green-600',
        bg: 'from-emerald-50 to-green-50',
        text: 'text-emerald-900',
        border: 'border-emerald-200',
        icon: Award,
        pulse: false
      },
      'Cancelled': {
        gradient: 'from-red-500 to-rose-600',
        bg: 'from-red-50 to-rose-50',
        text: 'text-red-900',
        border: 'border-red-200',
        icon: AlertCircle,
        pulse: false
      }
    };
    return configs[status] || configs['Pending'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderRating = (rating) => {
    if (!rating) return (
      <div className="text-sm text-gray-500 italic">No rating provided</div>
    );

    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300 ${i < rating
                    ? 'text-yellow-400 fill-current drop-shadow-md transform scale-110'
                    : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg">
            <span className="font-bold text-sm">{rating}/5 Excellent</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium">
            Customer satisfaction rating for this service
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-20 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Loading Booking Details</h3>
            <p className="text-sm sm:text-base text-gray-600">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm sm:max-w-lg w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 text-center">
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="relative p-4 sm:p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full inline-flex">
                <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Oops! Something went wrong</h2>
            <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">{error}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={fetchBooking}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Try Again</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white hidden group-active:block"></div>
                </span>
              </button>
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 transition-all text-center"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm sm:max-w-lg w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 text-center">
            <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 animate-bounce">🔍</div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Booking Not Found</h2>
            <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              The booking you're looking for doesn't exist or may have been removed from the system.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-30 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Premium Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => navigate('/')}
                className="group relative p-3 sm:p-4 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      Booking Overview
                    </h1>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="bg-gray-100 rounded-lg px-3 py-1 w-fit">
                    <span className="text-xs font-medium text-gray-600">ID</span>
                  </div>
                  <code className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 sm:px-4 py-2 rounded-lg font-mono text-xs sm:text-sm text-gray-800 border break-all">
                    {booking._id}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:hidden">
              <Link
                to={`/edit-booking/${booking._id}`}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm sm:text-base">Edit Details</span>
                </div>
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 ${deleting ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                  <span className="text-sm sm:text-base">{deleting ? 'Deleting...' : 'Delete'}</span>
                </div>
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to={`/edit-booking/${booking._id}`}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Edit className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span>Edit Details</span>
                </div>
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Trash2 className={`h-5 w-5 ${deleting ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`bg-gradient-to-r ${statusConfig.bg} border ${statusConfig.border} rounded-2xl p-4 sm:p-6 ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`p-2 sm:p-3 bg-gradient-to-r ${statusConfig.gradient} rounded-xl shadow-lg flex-shrink-0`}>
                <StatusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-lg sm:text-xl font-bold ${statusConfig.text}`}>
                  Current Status: {booking.status}
                </h3>
                <p className={`text-sm sm:text-base ${statusConfig.text} opacity-80`}>
                  {booking.status === 'Pending' && 'Awaiting confirmation'}
                  {booking.status === 'Confirmed' && 'Ready for service'}
                  {booking.status === 'Completed' && 'Service finished successfully'}
                  {booking.status === 'Cancelled' && 'Booking has been cancelled'}
                </p>
              </div>
            </div>

            {/* Quick Status Actions */}
            <div className="flex space-x-2">
              {booking.status === 'Pending' && (
                <button
                  onClick={() => handleStatusUpdate('Confirmed')}
                  disabled={updating}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-70"
                >
                  {updating ? 'Updating...' : 'Confirm'}
                </button>
              )}
              {booking.status === 'Confirmed' && (
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-70"
                >
                  {updating ? 'Updating...' : 'Complete'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Primary Information */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            {/* Customer & Vehicle Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Customer Info */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex-shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{booking.customerName}</h2>
                      <p className="text-sm sm:text-base text-gray-600">Customer Information</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-blue-700 font-medium">Full Name</p>
                          <p className="text-sm sm:text-base font-semibold text-blue-900 truncate">{booking.customerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg flex-shrink-0">
                      <Car className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Vehicle Details</h2>
                      <p className="text-sm sm:text-base text-gray-600">Car Information</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl sm:text-3xl flex-shrink-0">🚗</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-base sm:text-lg font-bold text-green-900">
                            {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
                          </p>
                          <p className="text-sm text-green-700 capitalize">
                            {booking.carDetails.type} Vehicle
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Service Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex-shrink-0">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Service Package</h3>
                    <p className="text-sm sm:text-base text-gray-600">Selected service</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                  <div className="space-y-3">
                    <h4 className="text-base sm:text-lg font-bold text-purple-900">{booking.serviceType}</h4>
                    <div className="flex items-center space-x-2 text-purple-700">
                      <Timer className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium">{booking.duration} minutes duration</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Appointment</h3>
                    <p className="text-sm sm:text-base text-gray-600">Date & time</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 sm:p-4 border border-orange-100">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-bold text-orange-900">{formatDate(booking.date)}</p>
                        <p className="text-xs sm:text-sm text-orange-700">Service date</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-bold text-blue-900">{booking.timeSlot}</p>
                        <p className="text-xs sm:text-sm text-blue-700">Time slot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {booking.addOns && booking.addOns.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Additional Services</h3>
                    <p className="text-sm sm:text-base text-gray-600">{booking.addOns.length} add-on{booking.addOns.length > 1 ? 's' : ''} selected</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booking.addOns.map((addOn, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-100 transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base font-semibold text-indigo-900 truncate">{addOn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Section */}
            {booking.rating && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg flex-shrink-0">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Customer Rating</h3>
                    <p className="text-sm sm:text-base text-gray-600">Service feedback</p>
                  </div>
                </div>

                {renderRating(booking.rating)}
              </div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Price Summary */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md flex-shrink-0">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Price Breakdown</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Main Service */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-700 font-medium truncate pr-2">{booking.serviceType}</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900 flex-shrink-0">
                      ${booking.price - (booking.addOns ? booking.addOns.reduce((total, addOn) => {
                        const addOnPrices = {
                          'Interior Cleaning': 20,
                          'Polishing': 30,
                          'Wax Protection': 25,
                          'Tire Shine': 10,
                          'Air Freshener': 5
                        };
                        return total + (addOnPrices[addOn] || 15);
                      }, 0) : 0)}
                    </span>
                  </div>
                </div>

                {/* Add-ons Pricing */}
                {booking.addOns && booking.addOns.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>Add-on Services</span>
                    </div>
                    
                    {booking.addOns.map((addOn, index) => {
                      const addOnPrices = {
                        'Interior Cleaning': 20,
                        'Polishing': 30,
                        'Wax Protection': 25,
                        'Tire Shine': 10,
                        'Air Freshener': 5
                      };
                      const price = addOnPrices[addOn] || 15;
                      
                      return (
                        <div key={index} className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-indigo-700 font-medium truncate">{addOn}</span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-indigo-900 flex-shrink-0 ml-2">+${price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-green-600">${booking.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Actions - Mobile Only */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 p-4">
          <div className="flex space-x-3">
            <Link
              to={`/edit-booking/${booking._id}`}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold text-center text-sm shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </div>
            </Link>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl font-semibold text-center text-sm shadow-lg disabled:opacity-70 hover:from-red-600 hover:to-rose-700 transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <Trash2 className={`h-4 w-4 ${deleting ? 'animate-pulse' : ''}`} />
                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default BookingDetail;