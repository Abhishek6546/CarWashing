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
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-7 w-7 transition-all duration-300 ${i < rating
                    ? 'text-yellow-400 fill-current drop-shadow-md transform scale-110'
                    : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-20 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Loading Booking Details</h3>
            <p className="text-gray-600">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full inline-flex">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={fetchBooking}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Try Again</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white hidden group-active:block"></div>
                </span>
              </button>
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all text-center"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 text-center">
            <div className="text-8xl mb-8 animate-bounce">🔍</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              The booking you're looking for doesn't exist or may have been removed from the system.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-5 w-5" />
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-30 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Premium Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="group relative p-4 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-indigo-200 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
              </button>

              <div>
                <div className="flex items-center space-x-4 mb-3">
                 
                  <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      Booking Overview
                    </h1>
                  
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 rounded-lg px-3 py-1">
                    <span className="text-xs font-medium text-gray-600">ID</span>
                  </div>
                  <code className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-lg font-mono text-sm text-gray-800 border">
                    {booking._id}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
        <div className={`bg-gradient-to-r ${statusConfig.bg} border ${statusConfig.border} rounded-2xl p-6 ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 bg-gradient-to-r ${statusConfig.gradient} rounded-xl shadow-lg`}>
                <StatusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${statusConfig.text}`}>
                  Current Status: {booking.status}
                </h3>
                <p className={`${statusConfig.text} opacity-80`}>
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
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Confirm
                </button>
              )}
              {booking.status === 'Confirmed' && (
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Primary Information */}
          <div className="xl:col-span-2 space-y-8">
            {/* Customer & Vehicle Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{booking.customerName}</h2>
                      <p className="text-gray-600">Customer Information</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Full Name</p>
                          <p className="font-semibold text-blue-900">{booking.customerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                      <p className="text-gray-600">Car Information</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🚗</span>
                        <div>
                          <p className="font-bold text-green-900 text-lg">
                            {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
                          </p>
                          <p className="text-green-700 capitalize text-sm">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Service Package</h3>
                    <p className="text-gray-600">Selected service</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="space-y-3">
                    <h4 className="font-bold text-purple-900 text-lg">{booking.serviceType}</h4>
                    <div className="flex items-center space-x-2 text-purple-700">
                      <Timer className="h-4 w-4" />
                      <span className="font-medium">{booking.duration} minutes duration</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Appointment</h3>
                    <p className="text-gray-600">Date & time</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-bold text-orange-900">{formatDate(booking.date)}</p>
                        <p className="text-orange-700 text-sm">Service date</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-bold text-blue-900">{booking.timeSlot}</p>
                        <p className="text-blue-700 text-sm">Time slot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {booking.addOns && booking.addOns.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Additional Services</h3>
                    <p className="text-gray-600">{booking.addOns.length} add-on{booking.addOns.length > 1 ? 's' : ''} selected</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {booking.addOns.map((addOn, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                        <span className="font-semibold text-indigo-900">{addOn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Section */}
            {booking.rating && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Customer Rating</h3>
                    <p className="text-gray-600">Service feedback</p>
                  </div>
                </div>

                {renderRating(booking.rating)}
              </div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-8">
            {/* Price Summary */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Price Breakdown</h3>
              </div>

              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{booking.serviceType}</span>
                    <span className="font-bold text-gray-900">
                      ${booking.price - (booking.addOns ? booking.addOns.length * 15 : 0)}
                    </span>
                  </div>
                </div>


                {/* Add-ons */}
                {booking.addOns && booking.addOns.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Add-on Services</h3>
                        </div>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                          {booking.addOns.length} {booking.addOns.length === 1 ? 'Service' : 'Services'}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
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
                            <div 
                              key={index}
                              className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 transition-all duration-200 hover:shadow-md hover:border-indigo-200 hover:scale-[1.01]"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100 group-hover:bg-indigo-50 transition-colors">
                                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                                    {addOn}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    +{price} minutes to service time
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="font-bold text-indigo-700">+${price}</span>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="pt-4 mt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Total Add-ons:</span>
                            <span className="font-semibold text-gray-900">
                              ${booking.addOns.reduce((total, addOn) => {
                                const addOnPrices = {
                                  'Interior Cleaning': 20,
                                  'Polishing': 30,
                                  'Wax Protection': 25,
                                  'Tire Shine': 10,
                                  'Air Freshener': 5
                                };
                                return total + (addOnPrices[addOn] || 15);
                              }, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

               
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Price Summary</span>
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>{booking.serviceType}</span>
                      <span>${booking.price - (booking.addOns ? booking.addOns.length * 15 : 0)}</span>
                    </div>

                    {booking.addOns && booking.addOns.map((addOn, index) => {
                      const addOnPrices = {
                        'Interior Cleaning': 20,
                        'Polishing': 30,
                        'Wax Protection': 25,
                        'Tire Shine': 10,
                        'Air Freshener': 5
                      };
                      return (
                        <div key={index} className="flex justify-between text-gray-600 text-sm">
                          <span>{addOn}</span>
                          <span>${addOnPrices[addOn] || 15}</span>
                        </div>
                      );
                    })}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${booking.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

            
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetail;