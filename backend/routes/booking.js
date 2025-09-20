import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Booking from '../models/booking.js';

const router = express.Router();

// Validation middleware for creating a booking
const validateCreateBooking = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('carDetails.make').trim().notEmpty().withMessage('Car make is required'),
  body('carDetails.model').trim().notEmpty().withMessage('Car model is required'),
  body('carDetails.year').isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid car year is required'),
  body('carDetails.type').isIn(['sedan', 'suv', 'hatchback', 'luxury', 'pickup', 'convertible'])
    .withMessage('Valid car type is required'),
  body('serviceType').isIn(['Basic Wash', 'Deluxe Wash', 'Full Detailing'])
    .withMessage('Valid service type is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').isIn(['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'])
    .withMessage('Valid time slot is required'),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Valid status is required'),
  body('addOns').optional().isArray().withMessage('Add-ons must be an array')
];

// Validation middleware for updating a booking (includes rating)
const validateUpdateBooking = [
  body('customerName').optional().trim().notEmpty().withMessage('Customer name cannot be empty'),
  body('carDetails.make').optional().trim().notEmpty().withMessage('Car make cannot be empty'),
  body('carDetails.model').optional().trim().notEmpty().withMessage('Car model cannot be empty'),
  body('carDetails.year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid car year is required'),
  body('carDetails.type').optional().isIn(['sedan', 'suv', 'hatchback', 'luxury', 'pickup', 'convertible'])
    .withMessage('Valid car type is required'),
  body('serviceType').optional().isIn(['Basic Wash', 'Deluxe Wash', 'Full Detailing'])
    .withMessage('Valid service type is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('timeSlot').optional().isIn(['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'])
    .withMessage('Valid time slot is required'),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Valid status is required'),
  body('rating')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1-5 if provided'),
  body('addOns').optional().isArray().withMessage('Add-ons must be an array')
];

// GET /api/bookings - List all bookings with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.serviceType) {
      filter.serviceType = req.query.serviceType;
    }
    
    if (req.query.carType) {
      filter['carDetails.type'] = req.query.carType;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) {
        filter.date.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.date.$lte = new Date(req.query.dateTo);
      }
    }

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    
    // Get bookings with sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const bookings = await Booking.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// GET /api/bookings/search - Search bookings
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        data: []
      });
    }

    const bookings = await Booking.find({
      $or: [
        { customerName: { $regex: q, $options: 'i' } },
        { 'carDetails.make': { $regex: q, $options: 'i' } },
        { 'carDetails.model': { $regex: q, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
});

// POST /api/bookings - Create new booking
router.post('/', validateCreateBooking, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Calculate price and duration
    const price = Booking.getServicePrice(req.body.serviceType, req.body.addOns);
    const booking = new Booking({
      ...req.body,
      price,
      duration: req.body.duration || new Booking(req.body).calculateDuration()
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', validateUpdateBooking, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Calculate new price if service type or addOns changed
    if (req.body.serviceType || req.body.addOns) {
      req.body.price = Booking.getServicePrice(req.body.serviceType, req.body.addOns);
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
});

export default router;