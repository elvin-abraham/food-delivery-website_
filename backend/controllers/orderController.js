


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order & create Stripe Checkout Session
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    
    try {
        const { userId, items, amount, address, couponCode, discountAmount, finalAmount } = req.body;

        // ✅ Minimum charge check (₹50) - use finalAmount if coupon applied
        const orderAmount = finalAmount || amount;
        if (orderAmount < 50) {
            return res.status(400).json({ 
                success: false, 
                message: "Minimum order amount after discount is ₹50." 
            });
        }

        // Save order in DB
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            couponCode: couponCode || "",
            discountAmount: discountAmount || 0,
            finalAmount: orderAmount
        });
        await newOrder.save();

        // If coupon was used, update coupon usage
        if (couponCode) {
            await couponModel.findOneAndUpdate(
                { code: couponCode },
                { $push: { usedBy: userId } }
            );
        }

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Stripe line items
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100), // rupees → paise
            },
            quantity: item.quantity,
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 100, // ₹2 → paise
            },
            quantity: 1,
        });

        // Add discount item if coupon applied
        if (discountAmount > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: { 
                        name: `Discount (${couponCode})`
                    },
                    unit_amount: -Math.round(discountAmount * 100), // negative amount for discount
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Stripe/Order Error:", error);
        res.status(500).json({ success: false, message: "Error creating payment session." });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// API for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };