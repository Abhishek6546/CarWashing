import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react';
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
      
      toast.success('Booking updated successfully!');
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
    return <Loading message="Loading booking details..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={fetchBooking} className="btn btn-primary">
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">The booking you're trying to edit doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/bookings/${id}`)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Edit className="h-6 w-6 text-primary-600" />
            <span>Edit Booking</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Update booking for {booking.customerName}
          </p>
        </div>
      </div>

      {/* Form */}
      <BookingForm
        initialData={booking}
        onSubmit={handleSubmit}
        loading={submitting}
        submitText="Update Booking"
      />
    </div>
  );
};

export default EditBooking;