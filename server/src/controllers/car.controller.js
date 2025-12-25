import prisma from '../config/database.js';
import { validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
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
    const where = {};

    if (status) where.status = status;
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
            orderBy: { isPrimary: 'desc' }
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
    console.error('Get cars error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: {
        images: {
          orderBy: { isPrimary: 'desc' }
        },
        sale: {
          include: {
            customer: true,
            soldBy: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Get car by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      make,
      model,
      variant,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      color,
      engineCapacity,
      condition,
      vin,
      chassisNumber,
      status,
      description
    } = req.body;

    const car = await prisma.car.create({
      data: {
        make,
        model,
        variant,
        year: parseInt(year),
        price: parseFloat(price),
        mileage: mileage ? parseFloat(mileage) : null,
        fuelType,
        transmission,
        color,
        engineCapacity: parseFloat(engineCapacity),
        condition,
        vin,
        chassisNumber,
        status: status || 'AVAILABLE',
        description
      },
      include: {
        images: true
      }
    });

    res.status(201).json({ success: true, data: car });
  } catch (error) {
    console.error('Create car error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'VIN already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      make,
      model,
      variant,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      color,
      engineCapacity,
      condition,
      vin,
      chassisNumber,
      status,
      description
    } = req.body;

    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: {
        ...(make && { make }),
        ...(model && { model }),
        ...(variant !== undefined && { variant }),
        ...(year && { year: parseInt(year) }),
        ...(price && { price: parseFloat(price) }),
        ...(mileage !== undefined && { mileage: mileage ? parseFloat(mileage) : null }),
        ...(fuelType && { fuelType }),
        ...(transmission && { transmission }),
        ...(color && { color }),
        ...(engineCapacity && { engineCapacity: parseFloat(engineCapacity) }),
        ...(condition && { condition }),
        ...(vin && { vin }),
        ...(chassisNumber !== undefined && { chassisNumber }),
        ...(status && { status }),
        ...(description !== undefined && { description })
      },
      include: {
        images: {
          orderBy: { isPrimary: 'desc' }
        }
      }
    });

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Update car error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCar = async (req, res) => {
  try {
    // Check if car is sold
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: { sale: true }
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.sale) {
      return res.status(400).json({ success: false, message: 'Cannot delete a car that has been sold' });
    }

    // Delete images
    const images = await prisma.carImage.findMany({
      where: { carId: req.params.id }
    });

    for (const image of images) {
      const imagePath = path.join(__dirname, '../../uploads', path.basename(image.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.car.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const uploadCarImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const car = await prisma.car.findUnique({
      where: { id: req.params.id }
    });

    if (!car) {
      // Delete uploaded files
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const existingImages = await prisma.carImage.count({
      where: { carId: req.params.id }
    });

    const images = await Promise.all(
      req.files.map((file, index) => {
        return prisma.carImage.create({
          data: {
            carId: req.params.id,
            imageUrl: `/uploads/${file.filename}`,
            isPrimary: existingImages === 0 && index === 0
          }
        });
      })
    );

    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Upload images error:', error);
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCarImage = async (req, res) => {
  try {
    const { isPrimary } = req.body;
    const { imageId } = req.params;

    const image = await prisma.carImage.findUnique({
      where: { id: imageId },
      include: { car: true }
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // If setting as primary, unset all other primary images for this car
    if (isPrimary) {
      await prisma.carImage.updateMany({
        where: {
          carId: image.carId,
          isPrimary: true
        },
        data: {
          isPrimary: false
        }
      });
    }

    const updatedImage = await prisma.carImage.update({
      where: { id: imageId },
      data: {
        isPrimary: isPrimary !== undefined ? isPrimary : image.isPrimary
      }
    });

    res.json({ success: true, data: updatedImage });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCarImage = async (req, res) => {
  try {
    const image = await prisma.carImage.findUnique({
      where: { id: req.params.imageId }
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete file
    const imagePath = path.join(__dirname, '../../uploads', path.basename(image.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await prisma.carImage.delete({
      where: { id: req.params.imageId }
    });

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const bulkUploadCars = async (req, res) => {
  try {
    // This is a simplified version - in production, you'd parse CSV file
    const { cars } = req.body;

    if (!Array.isArray(cars) || cars.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid cars data' });
    }

    const createdCars = await Promise.all(
      cars.map(carData => {
        return prisma.car.create({
          data: {
            make: carData.make,
            model: carData.model,
            variant: carData.variant,
            year: parseInt(carData.year),
            price: parseFloat(carData.price),
            mileage: carData.mileage ? parseFloat(carData.mileage) : null,
            fuelType: carData.fuelType,
            transmission: carData.transmission,
            color: carData.color,
            engineCapacity: parseFloat(carData.engineCapacity),
            condition: carData.condition,
            vin: carData.vin,
            chassisNumber: carData.chassisNumber,
            status: carData.status || 'AVAILABLE',
            description: carData.description
          }
        });
      })
    );

    res.status(201).json({
      success: true,
      message: `${createdCars.length} cars created successfully`,
      data: createdCars
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


