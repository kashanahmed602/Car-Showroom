import prisma from '../config/database.js';
import { validationResult } from 'express-validator';
import { generateInvoice } from '../utils/invoice.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoiceNumber = () => {
  return 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

export const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      soldById,
      customerId
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }
    if (soldById) where.soldById = soldById;
    if (customerId) where.customerId = customerId;

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              images: {
                take: 1,
                orderBy: { isPrimary: 'desc' }
              }
            }
          },
          customer: true,
          soldBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { saleDate: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.sale.count({ where })
    ]);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: {
        car: {
          include: {
            images: {
              orderBy: { isPrimary: 'desc' }
            }
          }
        },
        customer: true,
        soldBy: {
          select: {
            id: true,
            name: true,
            email: true,
            commission: true
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      carId,
      customerId,
      salePrice,
      discount = 0,
      paymentMethod,
      saleDate,
      notes
    } = req.body;

    // Check if car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.status === 'SOLD') {
      return res.status(400).json({ success: false, message: 'Car is already sold' });
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const soldById = req.user.role === 'ADMIN' ? (req.body.soldById || req.user.id) : req.user.id;

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        carId,
        customerId,
        soldById,
        salePrice: parseFloat(salePrice),
        discount: parseFloat(discount),
        paymentMethod,
        saleDate: saleDate ? new Date(saleDate) : new Date(),
        invoiceNumber: generateInvoiceNumber(),
        notes
      },
      include: {
        car: true,
        customer: true,
        soldBy: true
      }
    });

    // Update car status
    await prisma.car.update({
      where: { id: carId },
      data: { status: 'SOLD' }
    });

    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { salePrice, discount, paymentMethod, saleDate, notes } = req.body;

    const sale = await prisma.sale.update({
      where: { id: req.params.id },
      data: {
        ...(salePrice && { salePrice: parseFloat(salePrice) }),
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(paymentMethod && { paymentMethod }),
        ...(saleDate && { saleDate: new Date(saleDate) }),
        ...(notes !== undefined && { notes })
      },
      include: {
        car: true,
        customer: true,
        soldBy: true
      }
    });

    res.json({ success: true, data: sale });
  } catch (error) {
    console.error('Update sale error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: { car: true }
    });

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }

    await prisma.sale.delete({
      where: { id: req.params.id }
    });

    // Update car status back to available
    await prisma.car.update({
      where: { id: sale.carId },
      data: { status: 'AVAILABLE' }
    });

    res.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Delete sale error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSaleInvoice = async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: {
        car: true,
        customer: true,
        soldBy: true
      }
    });

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }

    // Get settings
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = {
        showroomName: 'Showroom',
        taxPercentage: 0,
        currency: 'PKR'
      };
    }

    const invoicePath = await generateInvoice(sale, sale.car, sale.customer, sale.soldBy, settings);

    res.download(invoicePath, `invoice-${sale.invoiceNumber}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ success: false, message: 'Error downloading invoice' });
      }
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


