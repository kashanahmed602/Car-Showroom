import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { showSuccess, showError, showDeleteConfirm, showLoading, closeLoading } from '../../utils/swal';

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    color: '',
    engineCapacity: '',
    condition: 'USED',
    vin: '',
    chassisNumber: '',
    status: 'AVAILABLE',
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cars/${id}`);
      const carData = response.data.data;
      setFormData(carData);
      setImages(carData.images || []);
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading('Saving car...');

    try {
      let carId = id;
      if (!id) {
        // Create new car first
        const createResponse = await axios.post(`${import.meta.env.VITE_API_URL}/cars`, formData);
        carId = createResponse.data.data.id;
        closeLoading();
        await showSuccess('Car created successfully!', 'Success');
      } else {
        // Update existing car
        await axios.put(`${import.meta.env.VITE_API_URL}/cars/${id}`, formData);
        closeLoading();
        await showSuccess('Car updated successfully!', 'Success');
      }

      // Upload images if any selected
      if (selectedFiles.length > 0 && carId) {
        showLoading('Uploading images...');
        await uploadImages(carId);
        closeLoading();
        await showSuccess(`${selectedFiles.length} image(s) uploaded successfully!`, 'Images Uploaded');
      }

      navigate('/admin/cars');
    } catch (error) {
      console.error('Error saving car:', error);
      closeLoading();
      showError(error.response?.data?.message || 'Failed to save car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const uploadImages = async (carId) => {
    setUploadingImages(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/cars/${carId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh car data to get updated images
      if (id) {
        await fetchCar();
      }
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      showError(error.response?.data?.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    const result = await showDeleteConfirm(
      'This image will be permanently deleted.',
      'Delete Image?'
    );

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/cars/images/${imageId}`);
        setImages(images.filter(img => img.id !== imageId));
        showSuccess('Image deleted successfully!', 'Deleted');
      } catch (error) {
        console.error('Error deleting image:', error);
        showError('Failed to delete image. Please try again.');
      }
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      // Set new primary (backend will handle unsetting others)
      await axios.put(`${import.meta.env.VITE_API_URL}/cars/${id}/images/${imageId}`, { isPrimary: true });

      // Update local state
      setImages(images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
      showSuccess('Primary image updated successfully!', 'Updated');
    } catch (error) {
      console.error('Error setting primary image:', error);
      showError('Failed to set primary image. Please try again.');
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Edit Car' : 'Add New Car'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make *
            </label>
            <input
              type="text"
              required
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <input
              type="text"
              value={formData.variant}
              onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (PKR) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage (km)
            </label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type *
            </label>
            <select
              required
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ELECTRIC">Electric</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission *
            </label>
            <select
              required
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="CVT">CVT</option>
              <option value="AMT">AMT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine Capacity (CC) *
            </label>
            <input
              type="number"
              required
              value={formData.engineCapacity}
              onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              required
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="NEW">New</option>
              <option value="USED">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VIN
            </label>
            <input
              type="text"
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chassis Number
            </label>
            <input
              type="text"
              value={formData.chassisNumber}
              onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Car Images</h2>

          {/* Existing Images */}
          {images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all">
                      <img
                        src={`http://localhost:5000${image.imageUrl}`}
                        alt="Car"
                        className="w-full h-full object-cover"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(image.id)}
                          className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          title="Set as primary"
                        >
                          {image.isPrimary ? '✓ Primary' : 'Set Primary'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          title="Delete image"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {id ? 'Add More Images' : 'Upload Images'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Click to upload images or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB (max 10 images)
                </span>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({selectedFiles.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
                {id && (
                  <button
                    type="button"
                    onClick={() => uploadImages(id)}
                    disabled={uploadingImages}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Images Now'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-smooth"
          >
            {loading ? 'Saving...' : id ? 'Update Car' : 'Create Car'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/cars')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-smooth"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;


