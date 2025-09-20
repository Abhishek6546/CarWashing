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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
        </div>
        
        <div>
          <label className="form-label">Customer Name *</label>
          <input
            type="text"
            className={`form-input ${errors.customerName ? 'border-red-500' : ''}`}
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

      {/* Vehicle Details */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Car className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Make *</label>
            <input
              type="text"
              className={`form-input ${errors.carDetails?.make ? 'border-red-500' : ''}`}
              {...register('carDetails.make', { required: 'Car make is required' })}
              placeholder="e.g., Toyota, BMW"
            />
            {errors.carDetails?.make && (
              <p className="mt-1 text-sm text-red-600">{errors.carDetails.make.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Model *</label>
            <input
              type="text"
              className={`form-input ${errors.carDetails?.model ? 'border-red-500' : ''}`}
              {...register('carDetails.model', { required: 'Car model is required' })}
              placeholder="e.g., Camry, X5"
            />
            {errors.carDetails?.model && (
              <p className="mt-1 text-sm text-red-600">{errors.carDetails.model.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Year *</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              className={`form-input ${errors.carDetails?.year ? 'border-red-500' : ''}`}
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

          <div>
            <label className="form-label">Type *</label>
            <select
              className={`form-select ${errors.carDetails?.type ? 'border-red-500' : ''}`}
              {...register('carDetails.type', { required: 'Car type is required' })}
            >
              {carTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.carDetails?.type && (
              <p className="mt-1 text-sm text-red-600">{errors.carDetails.type.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Service Type *</label>
            <select
              className="form-select"
              {...register('serviceType', { required: 'Service type is required' })}
            >
              <option value="Basic Wash">Basic Wash - $25 (45 min)</option>
              <option value="Deluxe Wash">Deluxe Wash - $50 (90 min)</option>
              <option value="Full Detailing">Full Detailing - $100 (3 hours)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Add-on Services</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <Controller
                name="addOns"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {availableAddOns.map(addOn => (
                      <label key={addOn} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value?.includes(addOn) || false}
                          onChange={(e) => {
                            const newAddOns = handleAddOnToggle(addOn, value || []);
                            onChange(newAddOns);
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          {addOn} (+${addOnPrices[addOn]})
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
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Date *</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className={`form-input ${errors.date ? 'border-red-500' : ''}`}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Time Slot *</label>
            <select
              className="form-select"
              {...register('timeSlot', { required: 'Time slot is required' })}
            >
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status and Rating (for editing existing bookings) */}
      {initialData && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Rating</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Status</label>
              <select className="form-select" {...register('status')}>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Rating (1-5)</label>
              <select className="form-select" {...register('rating')}>
                <option value="">No rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="card p-6 bg-gray-50">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Price Summary</h2>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>{watchedServiceType}</span>
            <span>${basePrices[watchedServiceType] || 0}</span>
          </div>
          
          {watchedAddOns && watchedAddOns.map(addOn => (
            <div key={addOn} className="flex justify-between text-gray-600 text-sm">
              <span>{addOn}</span>
              <span>+${addOnPrices[addOn]}</span>
            </div>
          ))}
          
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${calculatedPrice}</span>
            </div>
            <div className="text-sm text-gray-600">
              Estimated duration: {estimatedDuration} minutes
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;