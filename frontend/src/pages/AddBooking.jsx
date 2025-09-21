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
        <div className="absolute -top-10 -right-10 w-32 h-32 sm:-top-20 sm:-right-20 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-8 w-24 h-24 sm:-left-16 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-indigo-100 rounded-full opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-5 right-1/4 w-20 h-20 sm:bottom-10 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 bg-cyan-100 rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Enhanced Header with Breadcrumb */}
        <div className="relative">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">New Booking</span>
          </div>
          
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="group p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0 mt-1"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                      Create New Booking
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      <span>Schedule a premium car wash service</span>
                    </div>
                  </p>
                </div>
              </div>

              {/* Quick Stats Card - Hidden on mobile, visible on medium+ screens */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 lg:px-6 py-3 lg:py-4 border border-white/20 shadow-lg">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
                    <div>
                      <p className="text-xs lg:text-sm text-gray-500">Today</p>
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">
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

            {/* Mobile Quick Stats - Only visible on mobile */}
            <div className="md:hidden">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Today's Date</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Plus className="h-3 w-3" />
                    <span className="text-xs font-medium">New</span>
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
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8">
              <BookingForm
                onSubmit={handleSubmit}
                loading={loading}
                submitText={
                  <span className="flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Booking</span>
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom spacing for mobile FAB */}
    
      </div>

      {/* Floating Action Button - More prominent on mobile */}
      {!loading && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
          <div className="bg-blue-600 text-white p-3 sm:p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors animate-bounce">
            <Calendar className="h-5 w-5 sm:h-5 sm:w-5" />
          </div>
        </div>
      )}

      {/* Loading State Floating Indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
          <div className="bg-blue-600 text-white p-3 sm:p-3 rounded-full shadow-lg animate-pulse">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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