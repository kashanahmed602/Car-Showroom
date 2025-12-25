import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { validationResult } from 'express-validator';

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'EMPLOYEE'] }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        commission: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        commission: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, name, role, commission, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || 'EMPLOYEE',
        commission: commission ? parseFloat(commission) : null,
        isActive: isActive !== undefined ? isActive : true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        commission: true
      }
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { name, role, commission, isActive, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (commission !== undefined) updateData.commission = commission ? parseFloat(commission) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const employee = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        commission: true
      }
    });

    res.json({ success: true, data: employee });
  } catch (error) {
    console.error('Update employee error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    // Don't allow deleting if employee has sales
    const salesCount = await prisma.sale.count({
      where: { soldById: req.params.id }
    });

    if (salesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete employee with sales records. Deactivate instead.'
      });
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEmployeeSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { soldById: req.params.id };
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: { saleDate: 'desc' }
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const totalCommission = sales.reduce((sum, sale) => {
      const employee = sale.soldBy;
      if (employee && employee.commission) {
        return sum + (sale.salePrice * employee.commission / 100);
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        sales,
        summary: {
          totalSales: sales.length,
          totalRevenue: totalSales,
          totalCommission
        }
      }
    });
  } catch (error) {
    console.error('Get employee sales error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


