import React, { useState } from 'react';
import Modal from './components/modal';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';

const AddProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

interface AddProductEvent extends React.FormEvent<HTMLFormElement> {}

const handleAddProduct = (e: AddProductEvent): void => {
    e.preventDefault();
    // Handle form submission here
    alert('Product added!');
    setIsModalOpen(false);
};

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <Navbar />
        <div className="flex justify-center items-center mt-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome MTS</h1>
            <p className="text-xl mb-4">Get started by adding a new product</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add New Product
            </button>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProduct}
        />
      </div>
    </div>
  );
};

export default AddProductPage;
