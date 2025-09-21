import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, AlertCircle, User, Car, Calendar, Clock, Save } from 'lucide-react';
import { bookingAPI, formatAPIError } from '../services/api';
import BookingForm from '../components/BookingForm';
import Loading from '../components/Loading';

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const response = await bookingAPI.updateBooking(id, formData);
      
      toast.success('Booking updated successfully!', {
        duration: 4000,
        icon: '✨',
      });
      navigate(`/bookings/${response.data._id}`);
    } catch (error) {
      const errorMessage = formatAPIError(error);
      toast.error(errorMessage);
      console.error('Update booking error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <Loading message="Loading booking details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="p-4 bg-red-100 rounded-full inline-flex mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={fetchBooking} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Not Found</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The booking you're trying to edit doesn't exist or may have been deleted.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-100 rounded-full opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-pink-100 rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header with Breadcrumb */}
        <div className="relative">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span>Bookings</span>
            <span>/</span>
            <span className="text-purple-600 font-medium">Edit</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/bookings/${id}`)}
                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-900 bg-clip-text text-transparent">
                    Edit Booking
                  </h1>
                </div>
                <p className="text-gray-600 text-lg flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span>Updating booking for <strong>{booking.customerName}</strong></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Booking Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <span>Current Booking Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Vehicle</p>
                <p className="text-gray-900 font-semibold">
                  {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 font-medium">Scheduled</p>
                <p className="text-gray-900 font-semibold">
                  {formatDate(booking.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700 font-medium">Service</p>
                <p className="text-gray-900 font-semibold">{booking.serviceType}</p>
              </div>
            </div>
          </div>
        </div>

      
        {/* Enhanced Form Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-1">
            <div className="bg-white rounded-xl p-8">
              <BookingForm
                initialData={booking}
                onSubmit={handleSubmit}
                loading={submitting}
                submitText={
                  <span className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Update Booking</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>

      
      </div>

      {/* Floating Save Indicator */}
      {submitting && (
        <div className="fixed bottom-8 right-8">
          <div className="bg-purple-600 text-white p-4 rounded-full shadow-lg animate-pulse">
            <Save className="h-6 w-6" />
          </div>
        </div>
      )}

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

export default EditBooking;