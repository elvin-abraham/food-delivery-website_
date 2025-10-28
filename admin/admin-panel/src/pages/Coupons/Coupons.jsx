import React, { useState, useEffect } from 'react'
import './Coupons.css'
import { toast } from 'react-toastify'
import axios from 'axios'

const Coupons = ({ url }) => {
    const [coupons, setCoupons] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)

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
    })

    // Fetch all coupons
    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${url}/api/coupon/list`)
            if (response.data.success) {
                setCoupons(response.data.data)
            } else {
                toast.error('Failed to fetch coupons')
            }
        } catch (error) {
            toast.error('Error fetching coupons')
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

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
        })
        setEditingCoupon(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            let response
            if (editingCoupon) {
                // Update existing coupon
                response = await axios.put(`${url}/api/coupon/update/${editingCoupon._id}`, formData)
            } else {
                // Create new coupon
                response = await axios.post(`${url}/api/coupon/create`, formData)
            }

            if (response.data.success) {
                toast.success(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!')
                fetchCoupons()
                setShowForm(false)
                resetForm()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error saving coupon')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon)
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
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                const response = await axios.delete(`${url}/api/coupon/delete/${id}`)
                if (response.data.success) {
                    toast.success('Coupon deleted successfully!')
                    fetchCoupons()
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                toast.error('Error deleting coupon')
                console.error(error)
            }
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.patch(`${url}/api/coupon/toggle-status/${id}`)
            if (response.data.success) {
                toast.success(`Coupon ${response.data.coupon.isActive ? 'activated' : 'deactivated'} successfully!`)
                fetchCoupons()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error updating coupon status')
            console.error(error)
        }
    }

    const isCouponExpired = (validUntil) => {
        return new Date(validUntil) < new Date()
    }

    const getUsagePercentage = (coupon) => {
        return Math.round((coupon.usedBy.length / coupon.totalUsageLimit) * 100)
    }

    return (
        <div className='coupons add'>
            <div className="coupons-header">
                <h3>Coupon Management</h3>
                <button 
                    className="add-btn"
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                >
                    + Create New Coupon
                </button>
            </div>

            {/* Coupon Form Modal */}
            {showForm && (
                <div className="form-modal-overlay">
                    <div className="form-modal">
                        <div className="form-header">
                            <h4>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h4>
                            <button 
                                className="close-btn"
                                onClick={() => {
                                    setShowForm(false)
                                    resetForm()
                                }}
                            >
                                ✕
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
                                    <label>Max Discount (₹) *</label>
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
                                    <label>Min Order Amount (₹)</label>
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
                                    Active Coupon
                                </label>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowForm(false)
                                        resetForm()
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="submit-btn"
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
                    <div className="coupons-table">
                        <div className="coupons-table-format title">
                            <b>Code</b>
                            <b>Discount</b>
                            <b>Min Order</b>
                            <b>Valid Until</b>
                            <b>Usage</b>
                            <b>Status</b>
                            <b>Actions</b>
                        </div>
                        {coupons.map(coupon => (
                            <div key={coupon._id} className={`coupons-table-format ${!coupon.isActive ? 'inactive' : ''} ${isCouponExpired(coupon.validUntil) ? 'expired' : ''}`}>
                                <p className="coupon-code">{coupon.code}</p>
                                <p>{coupon.discountPercent}% (Max ₹{coupon.maxDiscount})</p>
                                <p>₹{coupon.minOrderAmount}</p>
                                <p>{new Date(coupon.validUntil).toLocaleDateString()}</p>
                                <p>{coupon.usedBy.length}/{coupon.totalUsageLimit}</p>
                                <p>
                                    <span className={`status ${coupon.isActive ? 'active' : 'inactive'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {isCouponExpired(coupon.validUntil) && (
                                        <span className="status expired">Expired</span>
                                    )}
                                </p>
                                <div className="actions">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEdit(coupon)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={`status-btn ${coupon.isActive ? 'deactivate' : 'activate'}`}
                                        onClick={() => handleToggleStatus(coupon._id)}
                                    >
                                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button 
                                        className="delete-btn"
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
    )
}

export default Coupons