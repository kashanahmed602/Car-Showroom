import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { showSuccess, showError, showLoading, closeLoading } from '../../utils/swal';

const Reports = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [profitReport, setProfitReport] = useState(null);
  const [employeePerformance, setEmployeePerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [salesRes, profitRes, employeeRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/reports/sales`),
        axios.get(`${import.meta.env.VITE_API_URL}/reports/profit`),
        axios.get(`${import.meta.env.VITE_API_URL}/reports/employees`)
      ]);
      setSalesReport(salesRes.data);
      setProfitReport(profitRes.data);
      setEmployeePerformance(employeeRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    showLoading('Generating report...');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/export/sales`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      closeLoading();
      await showSuccess('Report exported successfully!', 'Exported');
    } catch (error) {
      closeLoading();
      showError(error.response?.data?.message || 'Failed to export report. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Sales Report
        </button>
      </div>

      {/* Sales Report */}
      {salesReport && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
          <div className="mb-4">
            <p className="text-gray-600">
              Total Sales: {salesReport.summary.totalSales} | Total Revenue: PKR{' '}
              {salesReport.summary.totalRevenue.toLocaleString()}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesReport.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Profit Report */}
      {profitReport && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Profit Report</h2>
          <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold">
                PKR {profitReport.data.summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Cost</p>
              <p className="text-xl font-bold">
                PKR {profitReport.data.summary.totalCost.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Expenses</p>
              <p className="text-xl font-bold">
                PKR {profitReport.data.summary.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Net Profit</p>
              <p className="text-xl font-bold text-green-600">
                PKR {profitReport.data.summary.netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Employee Performance */}
      {employeePerformance && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Employee Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeePerformance.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="employee.name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salesCount" fill="#8884d8" />
              <Bar dataKey="totalRevenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Reports;


