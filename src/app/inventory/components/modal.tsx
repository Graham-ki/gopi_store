import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-1/2 mx-auto mt-20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4">Add New Product</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="SKU"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            required
          />
          <div className="flex justify-between">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
