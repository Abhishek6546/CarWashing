import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Clock, Car, DollarSign, 
  User, MapPin, Star, Package, CheckCircle, AlertCircle 
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
      toast.success('Booking deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Pending': 'status-badge status-pending',
      'Confirmed': 'status-badge status-confirmed',
      'Completed': 'status-badge status-completed',
      'Cancelled': 'status-badge status-cancelled'
    };
    return statusClasses[status] || 'status-badge bg-gray-100 text-gray-800';
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
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return <Loading message="Loading booking details..." />;
  }

  if (error) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={fetchBooking} className="btn btn-primary">
            Try Again
          </button>
          <Link to="/" className="btn btn-secondary">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
        <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600">ID: {booking._id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/edit-booking/${booking._id}`}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Car Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h2>
                <div className="flex items-center space-x-2 text-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{booking.customerName}</span>
                </div>
              </div>
              <div className={getStatusClass(booking.status)}>
                {booking.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Vehicle Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    Type: <span className="capitalize font-medium">{booking.carDetails.type}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Service Details</h3>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{booking.serviceType}</div>
                  <div className="text-sm text-gray-600">
                    Duration: {booking.duration} minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Schedule */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{formatDate(booking.date)}</div>
                  <div className="text-sm text-gray-600">Service Date</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{booking.timeSlot}</div>
                  <div className="text-sm text-gray-600">Time Slot</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          {booking.addOns && booking.addOns.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Add-on Services</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {booking.addOns.map((addOn, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {addOn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {booking.rating && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Rating</h2>
              {renderRating(booking.rating)}
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

          {/* Booking Timeline */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Booking Created</div>
                  <div className="text-xs text-gray-600">{formatDateTime(booking.createdAt)}</div>
                </div>
              </div>
              
              {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Last Updated</div>
                    <div className="text-xs text-gray-600">{formatDateTime(booking.updatedAt)}</div>
                  </div>
                </div>
              )}

              {booking.status === 'Completed' && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Service Completed</div>
                    <div className="text-xs text-gray-600">Status updated to completed</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to={`/edit-booking/${booking._id}`}
                className="block w-full text-center btn btn-primary"
              >
                Edit Booking
              </Link>
              
              {booking.status === 'Pending' && (
                <button className="block w-full text-center btn btn-secondary">
                  Mark as Confirmed
                </button>
              )}
              
              {booking.status === 'Confirmed' && (
                <button className="block w-full text-center btn btn-secondary">
                  Mark as Completed
                </button>
              )}
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="block w-full text-center btn btn-danger"
              >
                {deleting ? 'Deleting...' : 'Delete Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;