import prisma from '../config/database.js';

export const getInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
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
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.inquiry.count({ where })
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id },
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            images: {
              take: 1,
              orderBy: { isPrimary: 'desc' }
            }
          }
        }
      }
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Update inquiry error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    await prisma.inquiry.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getInquiryStats = async (req, res) => {
  try {
    const [total, pending, contacted, resolved] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'pending' } }),
      prisma.inquiry.count({ where: { status: 'contacted' } }),
      prisma.inquiry.count({ where: { status: 'resolved' } })
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        contacted,
        resolved
      }
    });
  } catch (error) {
    console.error('Get inquiry stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

