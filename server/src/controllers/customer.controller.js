import prisma from '../config/database.js';
import { validationResult } from 'express-validator';

export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, address, notes } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email?.toLowerCase(),
        phone,
        address,
        notes
      }
    });

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(notes !== undefined && { notes })
      }
    });

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    // Check if customer has purchases
    const salesCount = await prisma.sale.count({
      where: { customerId: req.params.id }
    });

    if (salesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete customer with purchase history'
      });
    }

    await prisma.customer.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCustomerPurchases = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { customerId: req.params.id },
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
        soldBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { saleDate: 'desc' }
    });

    res.json({ success: true, data: sales });
  } catch (error) {
    console.error('Get customer purchases error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

