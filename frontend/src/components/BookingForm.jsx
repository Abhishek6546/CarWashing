import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, Clock, Car, DollarSign, Package, User } from 'lucide-react';

const BookingForm = ({ initialData, onSubmit, loading, submitText = "Create Booking" }) => {
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customerName: initialData?.customerName || '',
      carDetails: {
        make: initialData?.carDetails?.make || '',
        model: initialData?.carDetails?.model || '',
        year: initialData?.carDetails?.year || new Date().getFullYear(),
        type: initialData?.carDetails?.type || 'sedan'
      },
      serviceType: initialData?.serviceType || 'Basic Wash',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
      timeSlot: initialData?.timeSlot || '09:00',
      status: initialData?.status || 'Pending',
      rating: initialData?.rating || '',
      addOns: initialData?.addOns || []
    }
  });

  // Watch form values for price calculation
  const watchedServiceType = watch('serviceType');
  const watchedAddOns = watch('addOns');

  // Service and add-on pricing
  const basePrices = {
    'Basic Wash': 25,
    'Deluxe Wash': 50,
    'Full Detailing': 100
  };

  const baseDurations = {
    'Basic Wash': 45,
    'Deluxe Wash': 90,
    'Full Detailing': 180
  };

  const addOnPrices = {
    'Interior Cleaning': 20,
    'Polishing': 30,
    'Wax Protection': 25,
    'Tire Shine': 10,
    'Air Freshener': 5
  };

  const availableAddOns = Object.keys(addOnPrices);
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const carTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'pickup', label: 'Pickup Truck' },
    { value: 'convertible', label: 'Convertible' }
  ];

  const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  // Calculate price and duration when service type or add-ons change
  useEffect(() => {
    const basePrice = basePrices[watchedServiceType] || 0;
    const baseDuration = baseDurations[watchedServiceType] || 45;
    
    let totalAddOnPrice = 0;
    let additionalDuration = 0;

    if (watchedAddOns && Array.isArray(watchedAddOns)) {
      watchedAddOns.forEach(addOn => {
        totalAddOnPrice += addOnPrices[addOn] || 0;
        additionalDuration += 15; // Each add-on adds 15 minutes
      });
    }

    const totalPrice = basePrice + totalAddOnPrice;
    const totalDuration = baseDuration + additionalDuration;

    setCalculatedPrice(totalPrice);
    setEstimatedDuration(totalDuration);
    
    // Update form values
    setValue('price', totalPrice);
    setValue('duration', totalDuration);
  }, [watchedServiceType, watchedAddOns, setValue]);

  // Handle add-on toggle
  const handleAddOnToggle = (addOn, currentAddOns) => {
    const newAddOns = currentAddOns.includes(addOn)
      ? currentAddOns.filter(item => item !== addOn)
      : [...currentAddOns, addOn];
    
    return newAddOns;
  };

  // Form submission
  const onFormSubmit = (data) => {
    // Format the data before submission
    const formattedData = {
      ...data,
      price: calculatedPrice,
      duration: estimatedDuration,
      rating: data.rating ? parseInt(data.rating) : null
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-4xl mx-auto">
      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Customer Information</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.customerName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
              {...register('customerName', {
                required: 'Customer name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Vehicle Details</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Make <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.carDetails?.make ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                {...register('carDetails.make', { required: 'Car make is required' })}
                placeholder="e.g., Toyota, BMW"
              />
              {errors.carDetails?.make && (
                <p className="mt-1 text-sm text-red-600">{errors.carDetails.make.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Model <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.carDetails?.model ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                {...register('carDetails.model', { required: 'Car model is required' })}
                placeholder="e.g., Camry, X5"
              />
              {errors.carDetails?.model && (
                <p className="mt-1 text-sm text-red-600">{errors.carDetails.model.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.carDetails?.year ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                {...register('carDetails.year', {
                  required: 'Car year is required',
                  min: { value: 1900, message: 'Year must be after 1900' },
                  max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
                })}
              />
              {errors.carDetails?.year && (
                <p className="mt-1 text-sm text-red-600">{errors.carDetails.year.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.carDetails?.type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-gray-700 bg-white`}
                {...register('carDetails.type', { required: 'Car type is required' })}
              >
                {carTypes.map(type => (
                  <option key={type.value} value={type.value} className="py-2">{type.label}</option>
                ))}
              </select>
              {errors.carDetails?.type && (
                <p className="mt-1 text-sm text-red-600">{errors.carDetails.type.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Service Details</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 focus:outline-none transition-colors text-gray-700 bg-white"
              {...register('serviceType', { required: 'Service type is required' })}
            >
              <option value="Basic Wash" className="py-2">Basic Wash - $25 (45 min)</option>
              <option value="Deluxe Wash" className="py-2">Deluxe Wash - $50 (90 min)</option>
              <option value="Full Detailing" className="py-2">Full Detailing - $100 (3 hours)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Add-on Services</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="addOns"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {availableAddOns.map(addOn => (
                      <label 
                        key={addOn} 
                        className={`flex items-center p-3 rounded-lg border-2 transition-colors cursor-pointer ${value?.includes(addOn) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="checkbox"
                          checked={value?.includes(addOn) || false}
                          onChange={(e) => {
                            const newAddOns = handleAddOnToggle(addOn, value || []);
                            onChange(newAddOns);
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {addOn} <span className="text-blue-600">(+${addOnPrices[addOn]})</span>
                        </span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Schedule</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot <span className="text-red-500">*</span></label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 focus:outline-none transition-colors text-gray-700 bg-white"
                {...register('timeSlot', { required: 'Time slot is required' })}
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot} className="py-2">{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Rating (for editing existing bookings) */}
      {initialData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Status & Rating</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 focus:outline-none transition-colors text-gray-700 bg-white"
                  {...register('status')}
                >
                  {statuses.map(status => (
                    <option key={status} value={status} className="py-2">{status}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-opacity-50 focus:outline-none transition-colors text-gray-700 bg-white"
                  {...register('rating')}
                >
                  <option value="" className="py-2">No rating</option>
                  <option value="1" className="py-2">⭐ 1 Star</option>
                  <option value="2" className="py-2">⭐⭐ 2 Stars</option>
                  <option value="3" className="py-2">⭐⭐⭐ 3 Stars</option>
                  <option value="4" className="py-2">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="5" className="py-2">⭐⭐⭐⭐⭐ 5 Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-white/50 backdrop-blur-sm px-6 py-4 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-semibold text-blue-800">Price Summary</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">{watchedServiceType}</span>
              <span className="font-medium">${basePrices[watchedServiceType] || 0}</span>
            </div>
            
            {watchedAddOns && watchedAddOns.length > 0 && (
              <div className="space-y-2 mt-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Add-ons</div>
                {watchedAddOns.map(addOn => (
                  <div key={addOn} className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-blue-200">
                    <span>• {addOn}</span>
                    <span className="font-medium">+${addOnPrices[addOn]}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-blue-200 pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold text-blue-900 mb-1">
                <span>Total</span>
                <span>${calculatedPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-sm text-blue-700 mt-2">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>Estimated duration: <span className="font-medium">{Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
            loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;