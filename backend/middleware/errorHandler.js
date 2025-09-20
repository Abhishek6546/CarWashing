export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry found'
      });
    }
  
    // Mongoose cast error
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
  
    // Default server error
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  };