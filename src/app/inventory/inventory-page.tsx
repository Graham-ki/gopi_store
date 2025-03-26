'use client';
import React, { useState } from 'react';
import Navbar from '../inventory/components/navbar';
import Sidebar from '../inventory/components/sidebar';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
}

interface StockOutRecord {
  id: number;
  productName: string;
  quantity: number;
  takenBy: string;
  issuedBy: string;
  date: string;
}

const InventoryModule = () => {
  // Dummy product data for Stock In
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Product A', sku: 'SKU001', category: 'Electronics', stock: 10, price: 100 },
    { id: 2, name: 'Product B', sku: 'SKU002', category: 'Clothing', stock: 5, price: 50 },
    { id: 3, name: 'Product C', sku: 'SKU003', category: 'Home Goods', stock: 20, price: 75 },
  ]);

  // Dummy data for Stock Out
  const [stockOutRecords, setStockOutRecords] = useState<StockOutRecord[]>([
    { id: 1, productName: 'Product D', quantity: 5, takenBy: 'John Doe', issuedBy: 'Jane Smith', date: '2025-03-20' },
    { id: 2, productName: 'Product E', quantity: 3, takenBy: 'Bob Johnson', issuedBy: 'Jane Smith', date: '2025-03-22' },
  ]);

  // Selected product for details view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Product to edit
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Low stock threshold
  const lowStockThreshold = 10;

  // Modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddStockOutModalOpen, setIsAddStockOutModalOpen] = useState(false);

  // Toggle between Stock In and Stock Out
  const [activeTab, setActiveTab] = useState<'stockIn' | 'stockOut'>('stockIn');

  // Filter state
  const [stockInFilter, setStockInFilter] = useState('all');
  const [stockOutFilter, setStockOutFilter] = useState('all');

  // Add new product
  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    setIsAddProductModalOpen(false);
  };

  // Edit product
  const editProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditProductModalOpen(false);
  };

  // Delete product
  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Add stock out record
  const addStockOutRecord = (record: StockOutRecord) => {
    setStockOutRecords([...stockOutRecords, record]);
    setIsAddStockOutModalOpen(false);
  };

  // Open add product modal
  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  // Open edit product modal
  const openEditProductModal = (product: Product) => {
    setProductToEdit(product);
    setIsEditProductModalOpen(true);
  };

  // Open details modal
  const openDetailsModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  // Open add stock out modal
  const openAddStockOutModal = () => {
    setIsAddStockOutModalOpen(true);
  };

  // Handle download
  const handleDownload = (type: 'stockIn' | 'stockOut') => {
    // In a real app, this would generate a CSV or Excel file
    alert(`Downloading ${type} data...`);
  };

  // Filter products based on date filter
  const getFilteredData = (data: any[], filter: string) => {
    if (filter === 'all') return data;
    
    const today = new Date();
    const filterDate = new Date();
    
    switch(filter) {
      case 'daily':
        return data; // For demo purposes, return all data
      case 'weekly':
        filterDate.setDate(today.getDate() - 7);
        return data; // For demo purposes, return all data
      case 'monthly':
        filterDate.setMonth(today.getMonth() - 1);
        return data; // For demo purposes, return all data
      case 'yearly':
        filterDate.setFullYear(today.getFullYear() - 1);
        return data; // For demo purposes, return all data
      default:
        return data;
    }
  };

  return (
    <div className="flex text-black">
      <Sidebar />
      <div className="flex-1 ml-16 p-6">
        <Navbar />
        <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
          {/* Add New Product Button */}
          <button
          onClick={() => openAddProductModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
        >
          Add New 
        </button>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">LPO</th>
                  <th className="py-3 px-4 text-left">Stock remaining</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) => product.stock < lowStockThreshold)
                  .map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 px-4 text-orange-500">{product.name}</td>
                      <td className="py-3 px-4 text-orange-500">{product.sku}</td>
                      <td className="py-3 px-4 text-orange-500">{product.stock}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* View Full List Button */}
          <div className="mt-4 text-right">
            <button 
              className="text-blue-500 hover:text-blue-700 font-medium"
              onClick={() => setActiveTab('stockIn')}
            >
              View Full List →
            </button>
          </div>
        </div>

        {/* Toggle Buttons for Stock In and Stock Out */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('stockIn')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'stockIn'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Stock In
          </button>
          <button
            onClick={() => setActiveTab('stockOut')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'stockOut'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Stock Out
          </button>
        </div>

        {/* Stock In List */}
        {activeTab === 'stockIn' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Stock In</h2>
              <div className="flex space-x-2">
                {/* Filter Dropdown */}
                <select 
                  className="border rounded-lg px-3 py-1"
                  value={stockInFilter}
                  onChange={(e) => setStockInFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {/* Download Button */}
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  onClick={() => handleDownload('stockIn')}
                >
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">LPO</th>
                    <th className="py-3 px-4 text-left">GRN</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Cost</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData(products, stockInFilter).map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.sku}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">UGX {product.price}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openEditProductModal(product)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700 mr-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => openDetailsModal(product)}
                          className="text-green-500 hover:text-green-700"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stock Out List */}
        {activeTab === 'stockOut' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Stock Out</h2>
              <div className="flex space-x-2">
                {/* Filter Dropdown */}
                <select 
                  className="border rounded-lg px-3 py-1"
                  value={stockOutFilter}
                  onChange={(e) => setStockOutFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {/* Download Button */}
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  onClick={() => handleDownload('stockOut')}
                >
                  Download
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Taken By</th>
                    <th className="py-3 px-4 text-left">Issued By</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData(stockOutRecords, stockOutFilter).map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="py-3 px-4">{record.productName}</td>
                      <td className="py-3 px-4">{record.quantity}</td>
                      <td className="py-3 px-4">{record.takenBy}</td>
                      <td className="py-3 px-4">{record.issuedBy}</td>
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-green-500 hover:text-green-700 mr-2">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700 mr-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Add Stock Out Button */}
            <div className="mt-4">
              <button
                onClick={() => openAddStockOutModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Stock Out
              </button>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add New LPO</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newProduct = {
                    id: products.length + 1,
                    name: e.currentTarget.productName.value,
                    sku: e.currentTarget.sku.value,
                    category: e.currentTarget.category.value,
                    stock: parseInt(e.currentTarget.stock.value),
                    price: parseFloat(e.currentTarget.price.value),
                  };
                  addProduct(newProduct);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditProductModalOpen && productToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedProduct = {
                    ...productToEdit,
                    name: e.currentTarget.productName.value,
                    sku: e.currentTarget.sku.value,
                    category: e.currentTarget.category.value,
                    stock: parseInt(e.currentTarget.stock.value),
                    price: parseFloat(e.currentTarget.price.value),
                  };
                  editProduct(updatedProduct);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="productName"
                    defaultValue={productToEdit.name}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="sku"
                    defaultValue={productToEdit.sku}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    defaultValue={productToEdit.category}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    defaultValue={productToEdit.stock}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    defaultValue={productToEdit.price}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditProductModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {isDetailsModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-4">
                <p>
                  <strong>Product Name:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>SKU:</strong> {selectedProduct.sku}
                </p>
                <p>
                  <strong>Category:</strong> {selectedProduct.category}
                </p>
                <p>
                  <strong>Stock Quantity:</strong> {selectedProduct.stock}
                </p>
                <p>
                  <strong>Price:</strong> UGX {selectedProduct.price}
                </p>
                <h3 className="text-lg font-semibold mt-4">Sales History</h3>
                <p>No sales history available.</p>
                <h3 className="text-lg font-semibold mt-4">Stock Movements</h3>
                <p>No stock movements available.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Stock Out Modal */}
        {isAddStockOutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add Stock Out Record</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newRecord = {
                    id: stockOutRecords.length + 1,
                    productName: e.currentTarget.productName.value,
                    quantity: parseInt(e.currentTarget.quantity.value),
                    takenBy: e.currentTarget.takenBy.value,
                    issuedBy: e.currentTarget.issuedBy.value,
                    date: e.currentTarget.date.value,
                  };
                  addStockOutRecord(newRecord);
                }}
              >
                <div className="space-y-4">
                  <select
                    name="productName"
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="takenBy"
                    placeholder="Taken By"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="issuedBy"
                    placeholder="Issued By"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddStockOutModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryModule;