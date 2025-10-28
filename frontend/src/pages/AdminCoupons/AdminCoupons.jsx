import React, { useState, useEffect } from 'react';
import './AdminCoupons.css';
import { assets } from '../../assets/assets';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        discountPercent: 20,
        maxDiscount: 100,
        minOrderAmount: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        usageLimit: 1,
        totalUsageLimit: 100,
        isActive: true
    });

    const url = "http://localhost:4000";

    // Fetch all coupons
    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${url}/api/coupon/list`);
            const data = await response.json();
            if (data.success) {
                setCoupons(data.data);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountPercent: 20,
            maxDiscount: 100,
            minOrderAmount: 0,
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            usageLimit: 1,
            totalUsageLimit: 100,
            isActive: true
        });
        setEditingCoupon(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const endpoint = editingCoupon 
                ? `${url}/api/coupon/update/${editingCoupon._id}`
                : `${url}/api/coupon/create`;
            
            const method = editingCoupon ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
                fetchCoupons();
                setShowForm(false);
                resetForm();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error saving coupon');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            maxDiscount: coupon.maxDiscount,
            minOrderAmount: coupon.minOrderAmount,
            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
            validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
            usageLimit: coupon.usageLimit,
            totalUsageLimit: coupon.totalUsageLimit,
            isActive: coupon.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                const response = await fetch(`${url}/api/coupon/delete/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                
                if (data.success) {
                    setMessage('Coupon deleted successfully!');
                    fetchCoupons();
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                setMessage('Error deleting coupon');
                console.error('Error:', error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await fetch(`${url}/api/coupon/toggle-status/${id}`, {
                method: 'PATCH'
            });
            const data = await response.json();
            
            if (data.success) {
                setMessage(`Coupon ${data.coupon.isActive ? 'activated' : 'deactivated'} successfully!`);
                fetchCoupons();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error updating coupon status');
            console.error('Error:', error);
        }
    };

    const isCouponExpired = (validUntil) => {
        return new Date(validUntil) < new Date();
    };

    const getUsagePercentage = (coupon) => {
        return Math.round((coupon.usedBy.length / coupon.totalUsageLimit) * 100);
    };

    return (
        <div className="admin-coupons">
            <div className="admin-coupons-header">
                <h1>Coupon Management</h1>
                <button 
                    className="btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    + Create New Coupon
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Coupon Form */}
            {showForm && (
                <div className="coupon-form-overlay">
                    <div className="coupon-form">
                        <div className="form-header">
                            <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                            >
                                <img src={assets.cross_icon} alt="Close" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Coupon Code *</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!editingCoupon}
                                        placeholder="e.g., WELCOME20"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Discount Percentage *</label>
                                    <input
                                        type="number"
                                        name="discountPercent"
                                        value={formData.discountPercent}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Maximum Discount (₹) *</label>
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={formData.maxDiscount}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Minimum Order Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={formData.minOrderAmount}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Valid From</label>
                                    <input
                                        type="date"
                                        name="validFrom"
                                        value={formData.validFrom}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Valid Until *</label>
                                    <input
                                        type="date"
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Usage Limit Per User</label>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={formData.usageLimit}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Total Usage Limit</label>
                                    <input
                                        type="number"
                                        name="totalUsageLimit"
                                        value={formData.totalUsageLimit}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    Active
                                </label>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Coupons List */}
            <div className="coupons-list">
                {coupons.length === 0 ? (
                    <div className="no-coupons">
                        <p>No coupons found. Create your first coupon!</p>
                    </div>
                ) : (
                    <div className="coupons-grid">
                        {coupons.map(coupon => (
                            <div key={coupon._id} className={`coupon-card ${!coupon.isActive ? 'inactive' : ''} ${isCouponExpired(coupon.validUntil) ? 'expired' : ''}`}>
                                <div className="coupon-header">
                                    <h3>{coupon.code}</h3>
                                    <div className="coupon-status">
                                        <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        {isCouponExpired(coupon.validUntil) && (
                                            <span className="status-badge expired">Expired</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="coupon-details">
                                    <div className="discount-info">
                                        <span className="discount-percent">{coupon.discountPercent}% OFF</span>
                                        <span className="max-discount">Up to ₹{coupon.maxDiscount}</span>
                                    </div>
                                    
                                    <div className="coupon-meta">
                                        <p><strong>Min Order:</strong> ₹{coupon.minOrderAmount}</p>
                                        <p><strong>Valid Until:</strong> {new Date(coupon.validUntil).toLocaleDateString()}</p>
                                        <p><strong>Usage:</strong> {coupon.usedBy.length} / {coupon.totalUsageLimit}</p>
                                    </div>

                                    <div className="usage-bar">
                                        <div 
                                            className="usage-progress" 
                                            style={{ width: `${getUsagePercentage(coupon)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="coupon-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => handleEdit(coupon)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={`btn-toggle ${coupon.isActive ? 'deactivate' : 'activate'}`}
                                        onClick={() => handleToggleStatus(coupon._id)}
                                    >
                                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(coupon._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;