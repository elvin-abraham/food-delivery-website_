


import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './FoodDetail.css';

const FoodDetail = () => {
    const { foodId } = useParams();
    const navigate = useNavigate();
    const { food_list, cartItems, addToCart, removeFromCart, url, token, addReview, getFoodReviews, getUserReview, deleteReview } = useContext(StoreContext);
    
    const [food, setFood] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);

    // Find food item
    useEffect(() => {
        const foundFood = food_list.find(item => item._id === foodId);
        setFood(foundFood);
    }, [food_list, foodId]);

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            if (foodId) {
                const reviewsData = await getFoodReviews(foodId);
                setReviews(reviewsData);
                
                if (token) {
                    const userReviewData = await getUserReview(foodId);
                    setUserReview(userReviewData);
                }
            }
        };
        loadReviews();
    }, [foodId, token]);

    const handleAddToCart = () => {
        addToCart(foodId);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(foodId);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to submit a review');
            return;
        }

        setLoading(true);
        const result = await addReview(foodId, reviewData.rating, reviewData.comment);
        
        if (result.success) {
            // Refresh reviews
            const reviewsData = await getFoodReviews(foodId);
            setReviews(reviewsData);
            const userReviewData = await getUserReview(foodId);
            setUserReview(userReviewData);
            
            setReviewData({ rating: 5, comment: '' });
            setShowReviewForm(false);
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const result = await deleteReview(reviewId);
            if (result.success) {
                // Refresh reviews
                const reviewsData = await getFoodReviews(foodId);
                setReviews(reviewsData);
                const userReviewData = await getUserReview(foodId);
                setUserReview(userReviewData);
            } else {
                alert(result.message);
            }
        }
    };

    if (!food) {
        return (
            <div className="food-detail loading">
                <p>Food item not found</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="food-detail">
            <div className="food-detail-container">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {/* Food Information */}
                <div className="food-detail-main">
                    <div className="food-detail-image">
                        <img src={`${url}/images/${food.image}`} alt={food.name} />
                    </div>
                    
                    <div className="food-detail-info">
                        <h1>{food.name}</h1>
                        <p className="food-detail-description">{food.description}</p>
                        <p className="food-detail-price">₹{food.price}</p>
                        
                        {/* Add to Cart Section */}
                        <div className="food-detail-cart">
                            {!cartItems[foodId] ? (
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    <img src={assets.add_icon_white} alt="Add" />
                                    Add to Cart
                                </button>
                            ) : (
                                <div className="cart-controls">
                                    <button onClick={handleRemoveFromCart}>
                                        <img src={assets.remove_icon_red} alt="Remove" />
                                    </button>
                                    <span>{cartItems[foodId]}</span>
                                    <button onClick={handleAddToCart}>
                                        <img src={assets.add_icon_green} alt="Add" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Category */}
                        <div className="food-detail-category">
                            <strong>Category:</strong> {food.category}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="food-reviews">
                    <div className="reviews-header">
                        <h2>Customer Reviews ({reviews.length})</h2>
                        {!userReview && token && (
                            <button 
                                className="add-review-btn"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? 'Cancel Review' : 'Add Review'}
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="review-form">
                            <h3>Write Your Review</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="rating-input">
                                    <label>Rating:</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                className={`star ${star <= reviewData.rating ? 'selected' : ''}`}
                                                onClick={() => setReviewData({...reviewData, rating: star})}
                                                onMouseEnter={() => {
                                                    if (!loading) {
                                                        const stars = document.querySelectorAll('.star-rating .star');
                                                        stars.forEach((s, index) => {
                                                            if (index < star) {
                                                                s.classList.add('hover');
                                                            } else {
                                                                s.classList.remove('hover');
                                                            }
                                                        });
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    const stars = document.querySelectorAll('.star-rating .star');
                                                    stars.forEach(s => s.classList.remove('hover'));
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="rating-value">{reviewData.rating} out of 5 stars</span>
                                </div>
                                <div className="comment-input">
                                    <label>Your Review:</label>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                        placeholder="Share your experience with this food..."
                                        rows="4"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* User's Review - Single section with delete button */}
                    {userReview && (
                        <div className="user-review">
                            <h3>Your Review</h3>
                            <div className="review-item">
                                <div className="review-header">
                                    <div className="review-user-info">
                                        <strong>{userReview.userName}</strong>
                                        <div className="review-rating">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <span 
                                                    key={index} 
                                                    className={`star ${index < userReview.rating ? 'selected' : ''}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        className="delete-review-btn"
                                        onClick={() => handleDeleteReview(userReview._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="review-comment">{userReview.comment}</p>
                                <span className="review-date">
                                    {new Date(userReview.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Other Reviews */}
                    <div className="other-reviews">
                        <h3>All Reviews</h3>
                        {reviews.filter(r => r._id !== userReview?._id).length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews
                                .filter(review => review._id !== userReview?._id)
                                .map(review => (
                                    <div key={review._id} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.userName}</strong>
                                            <div className="review-rating">
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`star ${index < review.rating ? 'selected' : ''}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;