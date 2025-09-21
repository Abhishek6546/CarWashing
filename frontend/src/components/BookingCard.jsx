import { Link } from "react-router-dom";
import { Calendar, Clock, Car, DollarSign, Edit, Trash2, Star } from "lucide-react";

const BookingCard = ({ booking, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center";
    const styles = {
      Pending: `${base} bg-yellow-100 text-yellow-700 border border-yellow-200`,
      Confirmed: `${base} bg-blue-100 text-blue-700 border border-blue-200`,
      Completed: `${base} bg-green-100 text-green-700 border border-green-200`,
      Cancelled: `${base} bg-red-100 text-red-700 border border-red-200`,
    };
    return styles[status] || `${base} bg-gray-100 text-gray-600 border`;
  };

  const renderRating = (rating) => {
    if (!rating) return null;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.customerName}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Car className="h-4 w-4 text-primary-500" />
            <span>
              {booking.carDetails.year} {booking.carDetails.make}{" "}
              {booking.carDetails.model}
            </span>
          </div>
        </div>
        <span className={getStatusClass(booking.status)}>
          {booking.status}
        </span>
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
                className="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-100"
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
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-gray-900 font-semibold">
            ${booking.price}
          </span>
        </div>
        <div className="flex justify-end">{renderRating(booking.rating)}</div>
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
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            title="Edit booking"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(booking._id)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
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
