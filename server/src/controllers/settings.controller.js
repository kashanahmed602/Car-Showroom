import prisma from '../config/database.js';
import { validationResult } from 'express-validator';

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.settings.create({
        data: {
          showroomName: 'My Showroom',
          taxPercentage: 0,
          currency: 'PKR'
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { showroomName, address, phone, email, taxPercentage, currency } = req.body;

    let settings = await prisma.settings.findFirst();

    const updateData = {};
    if (showroomName) updateData.showroomName = showroomName;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (taxPercentage !== undefined) updateData.taxPercentage = parseFloat(taxPercentage);
    if (currency !== undefined) updateData.currency = currency;
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          showroomName: showroomName || 'My Showroom',
          ...updateData
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


