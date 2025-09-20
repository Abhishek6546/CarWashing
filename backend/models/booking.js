import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  carDetails: {
    make: {
      type: String,
      required: [true, 'Car make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Car year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    type: {
      type: String,
      required: [true, 'Car type is required'],
      enum: ['sedan', 'suv', 'hatchback', 'luxury', 'pickup', 'convertible']
    }
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['Basic Wash', 'Deluxe Wash', 'Full Detailing']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ]
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null
  },
  addOns: [{
    type: String,
    enum: ['Interior Cleaning', 'Polishing', 'Wax Protection', 'Tire Shine', 'Air Freshener']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ customerName: 'text', 'carDetails.make': 'text', 'carDetails.model': 'text' });
bookingSchema.index({ serviceType: 1 });
bookingSchema.index({ 'carDetails.type': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Static method to get service pricing
bookingSchema.statics.getServicePrice = function(serviceType, addOns = []) {
  const basePrices = {
    'Basic Wash': 25,
    'Deluxe Wash': 50,
    'Full Detailing': 100
  };
  
  const addOnPrices = {
    'Interior Cleaning': 20,
    'Polishing': 30,
    'Wax Protection': 25,
    'Tire Shine': 10,
    'Air Freshener': 5
  };
  
  let total = basePrices[serviceType] || 0;
  addOns.forEach(addOn => {
    total += addOnPrices[addOn] || 0;
  });
  
  return total;
};

// Instance method to calculate duration
bookingSchema.methods.calculateDuration = function() {
  const baseDurations = {
    'Basic Wash': 45,
    'Deluxe Wash': 90,
    'Full Detailing': 180
  };
  
  let duration = baseDurations[this.serviceType] || 45;
  if (this.addOns && this.addOns.length > 0) {
    duration += this.addOns.length * 15;
  }
  
  return duration;
};

export default mongoose.model('Booking', bookingSchema);