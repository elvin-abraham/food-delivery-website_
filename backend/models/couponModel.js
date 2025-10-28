import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    maxDiscount: { type: Number, default: 100 },
    minOrderAmount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedBy: [{ type: String }], // array of user IDs who used this coupon
    usageLimit: { type: Number, default: 1 }, // how many times it can be used per user
    totalUsageLimit: { type: Number, default: 1000 } // overall usage limit
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;