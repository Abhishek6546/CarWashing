import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, DollarSign, Edit, Trash2, Star } from 'lucide-react';

const BookingCard = ({ booking, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const renderRating = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.customerName}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Car className="h-4 w-4" />
            <span>
              {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
            </span>
          </div>
        </div>
        <div className={getStatusClass(booking.status)}>
          {booking.status}
        </div>
      </div>

      {/* Service Info */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">
          {booking.serviceType}
        </div>
        {booking.addOns && booking.addOns.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {booking.addOns.map((addOn, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {addOn}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{booking.timeSlot}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium">${booking.price}</span>
        </div>
        <div className="flex items-center justify-end">
          {renderRating(booking.rating)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/bookings/${booking._id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          View Details
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/edit-booking/${booking._id}`}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit booking"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(booking._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete booking"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;