import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showDeleteConfirm, showError, showSuccess } from '../../utils/swal';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    make: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.make) params.append('make', filters.make);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cars?${params}`);
      setCars(response.data.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showDeleteConfirm(
      'This car will be permanently deleted. This action cannot be undone.',
      'Delete Car?'
    );

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/cars/${id}`);
        await showSuccess('Car deleted successfully!', 'Deleted');
        fetchCars();
      } catch (error) {
        showError(error.response?.data?.message || 'Failed to delete car. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cars</h1>
        <Link
          to="/admin/cars/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Car
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="RESERVED">Reserved</option>
          </select>
          <input
            type="text"
            placeholder="Search by make..."
            value={filters.make}
            onChange={(e) => setFilters({ ...filters, make: e.target.value, page: 1 })}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Car Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${car.images[0].imageUrl}`}
                      alt={car.model}
                      className="h-16 w-24 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-24 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {car.year} {car.make} {car.model}
                  </div>
                  <div className="text-sm text-gray-500">
                    {car.fuelType} • {car.transmission} • {car.mileage} km
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">PKR {car.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${car.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : car.status === 'SOLD'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/admin/cars/${car.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;


