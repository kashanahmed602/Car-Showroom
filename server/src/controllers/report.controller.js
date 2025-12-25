import prisma from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.saleDate = {};
      if (startDate) dateFilter.saleDate.gte = new Date(startDate);
      if (endDate) dateFilter.saleDate.lte = new Date(endDate);
    }

    // Total cars
    const totalCars = await prisma.car.count();

    // Cars sold
    const carsSold = await prisma.sale.count({ where: dateFilter });

    // Monthly revenue
    const sales = await prisma.sale.findMany({
      where: dateFilter,
      select: { salePrice: true, discount: true }
    });
    const monthlyRevenue = sales.reduce((sum, sale) => sum + sale.salePrice - sale.discount, 0);

    // Monthly expenses
    const expenses = await prisma.expense.findMany({
      where: dateFilter.expenseDate ? {
        expenseDate: dateFilter.expenseDate
      } : {}
    });
    const monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Employee commissions
    const salesWithEmployees = await prisma.sale.findMany({
      where: dateFilter,
      include: {
        soldBy: {
          select: { commission: true }
        }
      }
    });
    const totalCommission = salesWithEmployees.reduce((sum, sale) => {
      if (sale.soldBy.commission) {
        return sum + (sale.salePrice * sale.soldBy.commission / 100);
      }
      return sum;
    }, 0);

    const monthlyProfit = monthlyRevenue - monthlyExpenses - totalCommission;

    // Top selling cars
    const topSellingCars = await prisma.sale.groupBy({
      by: ['carId'],
      where: dateFilter,
      _count: { carId: true },
      orderBy: { _count: { carId: 'desc' } },
      take: 5
    });

    const topCarsWithDetails = await Promise.all(
      topSellingCars.map(async (item) => {
        const car = await prisma.car.findUnique({
          where: { id: item.carId },
          select: { id: true, make: true, model: true, year: true }
        });
        return { ...car, salesCount: item._count.carId };
      })
    );

    // Best performing employees
    const employeeSales = await prisma.sale.groupBy({
      by: ['soldById'],
      where: dateFilter,
      _count: { soldById: true },
      _sum: { salePrice: true },
      orderBy: { _count: { soldById: 'desc' } },
      take: 5
    });

    const bestEmployees = await Promise.all(
      employeeSales.map(async (item) => {
        const employee = await prisma.user.findUnique({
          where: { id: item.soldById },
          select: { id: true, name: true, email: true }
        });
        return {
          ...employee,
          salesCount: item._count.soldById,
          totalRevenue: item._sum.salePrice || 0
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalCars,
        carsSold,
        monthlyRevenue,
        monthlyProfit,
        monthlyExpenses,
        totalCommission,
        topSellingCars: topCarsWithDetails,
        bestEmployees
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        car: {
          select: { make: true, model: true, year: true }
        },
        customer: {
          select: { name: true, phone: true }
        },
        soldBy: {
          select: { name: true }
        }
      },
      orderBy: { saleDate: 'desc' }
    });

    // Group by date
    const grouped = {};
    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      let key;
      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, sales: [], total: 0, count: 0 };
      }
      grouped[key].sales.push(sale);
      grouped[key].total += sale.salePrice - sale.discount;
      grouped[key].count += 1;
    });

    res.json({
      success: true,
      data: Object.values(grouped),
      summary: {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, s) => sum + s.salePrice - s.discount, 0)
      }
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProfitReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        car: {
          select: { make: true, model: true, year: true, price: true }
        },
        soldBy: {
          select: { commission: true }
        }
      }
    });

    const expenses = await prisma.expense.findMany({
      where: where.expenseDate ? {
        expenseDate: where.expenseDate
      } : {}
    });

    const carProfits = sales.map(sale => {
      const cost = sale.car.price; // Assuming cost is the original price
      const revenue = sale.salePrice - sale.discount;
      const commission = sale.soldBy.commission
        ? (sale.salePrice * sale.soldBy.commission / 100)
        : 0;
      const profit = revenue - cost - commission;

      return {
        car: sale.car,
        salePrice: sale.salePrice,
        discount: sale.discount,
        revenue,
        cost,
        commission,
        profit
      };
    });

    const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice - s.discount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCommission = sales.reduce((sum, sale) => {
      if (sale.soldBy.commission) {
        return sum + (sale.salePrice * sale.soldBy.commission / 100);
      }
      return sum;
    }, 0);
    const totalCost = sales.reduce((sum, sale) => sum + sale.car.price, 0);
    const netProfit = totalRevenue - totalCost - totalExpenses - totalCommission;

    res.json({
      success: true,
      data: {
        carProfits,
        summary: {
          totalRevenue,
          totalCost,
          totalExpenses,
          totalCommission,
          netProfit
        }
      }
    });
  } catch (error) {
    console.error('Get profit report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEmployeePerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const employeeSales = await prisma.sale.groupBy({
      by: ['soldById'],
      where,
      _count: { soldById: true },
      _sum: { salePrice: true },
      _avg: { salePrice: true }
    });

    const employees = await Promise.all(
      employeeSales.map(async (item) => {
        const employee = await prisma.user.findUnique({
          where: { id: item.soldById },
          select: { id: true, name: true, email: true, commission: true }
        });

        const totalCommission = employee.commission
          ? (item._sum.salePrice * employee.commission / 100)
          : 0;

        return {
          employee,
          salesCount: item._count.soldById,
          totalRevenue: item._sum.salePrice || 0,
          averageSale: item._avg.salePrice || 0,
          totalCommission
        };
      })
    );

    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Get employee performance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const exportSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        car: {
          select: { make: true, model: true, year: true }
        },
        customer: {
          select: { name: true, phone: true }
        },
        soldBy: {
          select: { name: true }
        }
      },
      orderBy: { saleDate: 'desc' }
    });

    // Convert to CSV format
    const csvHeader = 'Invoice Number,Date,Car,Customer,Phone,Sold By,Price,Discount,Total\n';
    const csvRows = sales.map(sale => {
      const car = `${sale.car.year} ${sale.car.make} ${sale.car.model}`;
      const total = sale.salePrice - sale.discount;
      return `"${sale.invoiceNumber}","${sale.saleDate.toISOString().split('T')[0]}","${car}","${sale.customer.name}","${sale.customer.phone}","${sale.soldBy.name}","${sale.salePrice}","${sale.discount}","${total}"`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export sales report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


