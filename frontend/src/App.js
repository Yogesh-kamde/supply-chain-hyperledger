import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // 4 state variables here
  // createForm, transferForm, searchId, productData
  const [createForm, setCreateForm] = useState({
    productId: '', productName: '', category: '', manufacturingDate: ''
  });

  const [transferForm, setTransferForm] = useState({
    productId: '', newOwner: '', newStatus: ''
  });
  const [searchId, setSearchId] = useState('');
  const [productData, setProductData] = useState('');


  async function handleCreate() {
    try {
      const result = await axios.post('http://localhost:5000/api/product/create', createForm);
      alert('Product created: ' + result.data.message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  async function handleTransfer() {
    try {
      const result = await axios.post('http://localhost:5000/api/product/transfer', transferForm);
      alert('Transfer successful: ' + result.data.message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  async function handleSearch() {
    try {
      const result = await axios.get(`http://localhost:5000/api/product/${searchId}`);
      setProductData(result.data);
    } catch (error) {
      alert('Product not found');
    }
  }
  return (
    <div>
         <h1>Supply Chain Tracker</h1>

        {/* Create Product */}
        <h2>Create Product</h2>
        <input placeholder="Product ID" value={createForm.productId}
            onChange={(e) => setCreateForm({ ...createForm, productId: e.target.value })} />
        <input placeholder="Product Name" value={createForm.productName}
            onChange={(e) => setCreateForm({ ...createForm, productName: e.target.value })} />
        <input placeholder="Category" value={createForm.category}
            onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })} />
        <input placeholder="Manufacturing Date" value={createForm.manufacturingDate}
            onChange={(e) => setCreateForm({ ...createForm, manufacturingDate: e.target.value })} />
        <button onClick={handleCreate}>Create Product</button>

        <hr />

        {/* Transfer Product */}
        <h2>Transfer Product</h2>
        <input placeholder="Product ID" value={transferForm.productId}
            onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })} />
        <input placeholder="New Owner" value={transferForm.newOwner}
            onChange={(e) => setTransferForm({ ...transferForm, newOwner: e.target.value })} />
        <input placeholder="New Status" value={transferForm.newStatus}
            onChange={(e) => setTransferForm({ ...transferForm, newStatus: e.target.value })} />
        <button onClick={handleTransfer}>Transfer Product</button>

        <hr />

        {/* Track Product */}
        <h2>Track Product</h2>
        <input placeholder="Enter Product ID" value={searchId}
            onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>

        {/* Display Result */}
        {productData && (
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                <h3>Product Details</h3>
                <p><b>Product ID:</b> {productData.productId}</p>
                <p><b>Name:</b> {productData.productName}</p>
                <p><b>Category:</b> {productData.productCategory}</p>
                <p><b>Current Owner:</b> {productData.currentOwner}</p>
                <p><b>Status:</b> {productData.status}</p>
                <p><b>Timestamp:</b> {productData.timestamp}</p>
            </div>
        )}
    </div>
  );
}

export default App;