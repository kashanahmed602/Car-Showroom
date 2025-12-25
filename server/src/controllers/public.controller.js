import prisma from '../config/database.js';
import { validationResult } from 'express-validator';

export const getPublicCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'AVAILABLE',
      make,
      model,
      year,
      fuelType,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { status };

    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (year) where.year = parseInt(year);
    if (fuelType) where.fuelType = fuelType;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: {
          images: {
            orderBy: { isPrimary: 'desc' },
            take: 1
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.car.count({ where })
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get public cars error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPublicCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: {
        images: {
          orderBy: { isPrimary: 'desc' }
        }
      }
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Get public car error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { carId, customerEmail } = req.body;

    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        carId_customerEmail: {
          carId,
          customerEmail: customerEmail.toLowerCase()
        }
      },
      update: {},
      create: {
        carId,
        customerEmail: customerEmail.toLowerCase()
      }
    });

    res.json({ success: true, data: wishlistItem });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { email } = req.query;

    await prisma.wishlist.deleteMany({
      where: {
        carId: req.params.carId,
        customerEmail: email?.toLowerCase()
      }
    });

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        customerEmail: req.params.email.toLowerCase()
      },
      include: {
        car: {
          include: {
            images: {
              orderBy: { isPrimary: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { carId, name, email, phone, message } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        carId: carId || null,
        name,
        email: email.toLowerCase(),
        phone,
        message
      }
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


