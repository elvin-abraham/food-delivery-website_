import express from 'express';
import { addReview, getFoodReviews, getUserReview,deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, addReview);
reviewRouter.get("/food/:foodId", getFoodReviews);
reviewRouter.get("/user/:foodId/:userId", getUserReview);
reviewRouter.delete("/delete/:reviewId", authMiddleware, deleteReview);

export default reviewRouter;