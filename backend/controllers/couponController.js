

import couponModel from "../models/couponModel.js";

// Validate coupon code
export const validateCoupon = async (req, res) => {
    try {
        const { code, userId, orderAmount } = req.body;
        
        // Find active coupon
        const coupon = await couponModel.findOne({ 
            code: code.toUpperCase(), 
            isActive: true 
        });

        if (!coupon) {
            return res.json({ 
                success: false, 
                message: "Invalid coupon code" 
            });
        }

        // Check validity period
        const currentDate = new Date();
        if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
            return res.json({ 
                success: false, 
                message: "Coupon has expired" 
            });
        }

        // Check minimum order amount
        if (orderAmount < coupon.minOrderAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
            });
        }

        // Check total usage limit
        if (coupon.usedBy.length >= coupon.totalUsageLimit) {
            return res.json({ 
                success: false, 
                message: "Coupon usage limit reached" 
            });
        }

        // Check per user usage limit
        const userUsageCount = coupon.usedBy.filter(id => id === userId).length;
        if (userUsageCount >= coupon.usageLimit) {
            return res.json({ 
                success: false, 
                message: "You have already used this coupon" 
            });
        }

        // Calculate discount
        let discountAmount = (orderAmount * coupon.discountPercent) / 100;
        
        // Apply maximum discount limit
        if (discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }

        const finalAmount = orderAmount - discountAmount;

        res.json({
            success: true,
            message: "Coupon applied successfully",
            coupon: {
                code: coupon.code,
                discountPercent: coupon.discountPercent,
                discountAmount: discountAmount,
                finalAmount: finalAmount,
                maxDiscount: coupon.maxDiscount
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error validating coupon" });
    }
}

// Create new coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discountPercent, maxDiscount, minOrderAmount, validFrom, validUntil, usageLimit, totalUsageLimit } = req.body;

        // Check if coupon code already exists
        const existingCoupon = await couponModel.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.json({ success: false, message: "Coupon code already exists" });
        }

        const coupon = new couponModel({
            code: code.toUpperCase(),
            discountPercent,
            maxDiscount: maxDiscount || 100,
            minOrderAmount: minOrderAmount || 0,
            validFrom: validFrom ? new Date(validFrom) : new Date(),
            validUntil: new Date(validUntil),
            usageLimit: usageLimit || 1,
            totalUsageLimit: totalUsageLimit || 1000
        });

        await coupon.save();
        res.json({ success: true, message: "Coupon created successfully", coupon });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating coupon" });
    }
}

// Get all coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching coupons" });
    }
}

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.validUntil) {
            updateData.validUntil = new Date(updateData.validUntil);
        }

        const coupon = await couponModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }

        res.json({ success: true, message: "Coupon updated successfully", coupon });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating coupon" });
    }
}

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await couponModel.findByIdAndDelete(id);

        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }

        res.json({ success: true, message: "Coupon deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting coupon" });
    }
}

// Toggle coupon status (active/inactive)
export const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await couponModel.findById(id);
        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({ 
            success: true, 
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
            coupon 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating coupon status" });
    }
}