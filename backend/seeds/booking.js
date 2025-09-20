import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/booking.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carwash')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const sampleBookings = [
  {
    customerName: 'John Doe',
    carDetails: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      type: 'sedan'
    },
    serviceType: 'Deluxe Wash',
    date: new Date('2025-09-25'),
    timeSlot: '10:00',
    duration: 90,
    price: 70,
    status: 'Confirmed',
    rating: 5,
    addOns: ['Interior Cleaning', 'Tire Shine']
  },
  {
    customerName: 'Sarah Johnson',
    carDetails: {
      make: 'BMW',
      model: 'X5',
      year: 2023,
      type: 'suv'
    },
    serviceType: 'Full Detailing',
    date: new Date('2025-09-22'),
    timeSlot: '14:00',
    duration: 210,
    price: 155,
    status: 'Completed',
    rating: 4,
    addOns: ['Polishing', 'Wax Protection', 'Air Freshener']
  },
  {
    customerName: 'Michael Chen',
    carDetails: {
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      type: 'hatchback'
    },
    serviceType: 'Basic Wash',
    date: new Date('2025-09-28'),
    timeSlot: '09:00',
    duration: 45,
    price: 25,
    status: 'Pending',
    addOns: []
  },
  {
    customerName: 'Emily Davis',
    carDetails: {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      type: 'luxury'
    },
    serviceType: 'Full Detailing',
    date: new Date('2025-09-18'),
    timeSlot: '11:00',
    duration: 195,
    price: 130,
    status: 'Completed',
    rating: 5,
    addOns: ['Polishing', 'Wax Protection']
  },
  {
    customerName: 'Robert Wilson',
    carDetails: {
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      type: 'pickup'
    },
    serviceType: 'Deluxe Wash',
    date: new Date('2025-09-30'),
    timeSlot: '15:00',
    duration: 105,
    price: 60,
    status: 'Confirmed',
    addOns: ['Tire Shine']
  },
  {
    customerName: 'Lisa Anderson',
    carDetails: {
      make: 'Audi',
      model: 'A4',
      year: 2023,
      type: 'sedan'
    },
    serviceType: 'Basic Wash',
    date: new Date('2025-09-15'),
    timeSlot: '08:00',
    duration: 60,
    price: 30,
    status: 'Cancelled',
    addOns: ['Air Freshener']
  },
  {
    customerName: 'David Martinez',
    carDetails: {
      make: 'Jeep',
      model: 'Wrangler',
      year: 2022,
      type: 'suv'
    },
    serviceType: 'Deluxe Wash',
    date: new Date('2025-10-02'),
    timeSlot: '13:00',
    duration: 90,
    price: 50,
    status: 'Pending',
    addOns: []
  },
  {
    customerName: 'Jessica Brown',
    carDetails: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      type: 'sedan'
    },
    serviceType: 'Full Detailing',
    date: new Date('2025-09-20'),
    timeSlot: '16:00',
    duration: 180,
    price: 100,
    status: 'Completed',
    rating: 4,
    addOns: []
  }
];

async function seedBookings() {
  try {
    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Existing bookings cleared');

    // Insert sample bookings
    await Booking.insertMany(sampleBookings);
    console.log('Sample bookings inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedBookings();