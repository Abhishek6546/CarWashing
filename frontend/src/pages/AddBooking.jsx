import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, Sparkles, Calendar } from 'lucide-react';
import { bookingAPI, formatAPIError } from '../services/api';
import BookingForm from '../components/BookingForm';

const AddBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await bookingAPI.createBooking(formData);
      
      toast.success('Booking created successfully!', {
        duration: 4000,
        icon: '🎉',
      });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-indigo-100 rounded-full opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-cyan-100 rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header with Breadcrumb */}
        <div className="relative">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">New Booking</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                 
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                    Create New Booking
                  </h1>
                </div>
                <p className="text-gray-600 text-lg flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Schedule a premium car wash service</span>
                </p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        {/* Enhanced Form Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-1">
            <div className="bg-white rounded-xl p-8">
              <BookingForm
                onSubmit={handleSubmit}
                loading={loading}
                submitText="Create Booking"
              />
            </div>
          </div>
        </div>

        
      </div>

      {/* Floating Action Hint */}
      {!loading && (
        <div className="fixed bottom-8 right-8 animate-bounce">
          <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
            <Calendar className="h-5 w-5" />
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

export default AddBooking;