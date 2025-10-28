


import express from 'express';
import { 
    validateCoupon, 
    createCoupon, 
    getAllCoupons, 
    updateCoupon, 
    deleteCoupon, 
    toggleCouponStatus 
} from '../controllers/couponController.js';
import authMiddleware from '../middleware/auth.js';

const couponRouter = express.Router();

couponRouter.post("/validate", authMiddleware, validateCoupon);
couponRouter.post("/create", createCoupon);
couponRouter.get("/list", getAllCoupons);
couponRouter.put("/update/:id", updateCoupon);
couponRouter.delete("/delete/:id", deleteCoupon);
couponRouter.patch("/toggle-status/:id", toggleCouponStatus);

export default couponRouter;