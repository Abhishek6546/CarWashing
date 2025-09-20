import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { bookingAPI, formatAPIError } from '../services/api';
import BookingForm from '../components/BookingForm';

const AddBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await bookingAPI.createBooking(formData);
      
      toast.success('Booking created successfully!');
      navigate(`/bookings/${response.data._id}`);
    } catch (error) {
      const errorMessage = formatAPIError(error);
      toast.error(errorMessage);
      console.error('Create booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Plus className="h-6 w-6 text-primary-600" />
            <span>New Booking</span>
          </h1>
          <p className="text-gray-600 mt-1">Create a new car wash booking</p>
        </div>
      </div>

      {/* Form */}
      <BookingForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Booking"
      />
    </div>
  );
};

export default AddBooking;