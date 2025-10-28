import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";


// Add review
export const addReview = async (req, res) => {
    try {
        const { foodId, userId, userName, rating, comment } = req.body;

        // Create new review
        const newReview = new reviewModel({
            foodId,
            userId,
            userName,
            rating: Number(rating),
            comment
        });

        await newReview.save();

        // Calculate average rating for the food item
        const reviews = await reviewModel.find({ foodId });
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        const totalReviews = reviews.length;

        // Update food item with new average rating and total reviews
        await foodModel.findByIdAndUpdate(foodId, {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews
        });

        res.json({
            success: true,
            message: "Review added successfully",
            review: newReview
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding review" });
    }
}

// Get reviews for a food item
export const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.params;

        const reviews = await reviewModel.find({ foodId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching reviews" });
    }
}

// Get user's review for a food item
export const getUserReview = async (req, res) => {
    try {
        const { foodId, userId } = req.params;

        const review = await reviewModel.findOne({ foodId, userId });

        res.json({
            success: true,
            data: review
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user review" });
    }
}


// Delete review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body;

        const review = await reviewModel.findById(reviewId);
        
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }

        // Check if the user owns the review
        if (review.userId !== userId) {
            return res.json({ success: false, message: "You can only delete your own reviews" });
        }

        await reviewModel.findByIdAndDelete(reviewId);

        res.json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting review" });
    }
}