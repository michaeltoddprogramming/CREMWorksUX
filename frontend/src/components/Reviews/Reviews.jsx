import React, { useState, useEffect } from 'react';
import styles from './Reviews.module.css';

function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        username: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/products/${productId}/reviews`);
            const data = await response.json();
            
            if (response.ok) {
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || 0);
                setReviewCount(data.reviewCount || 0);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newReview.username,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Review added successfully!');
                setNewReview({ rating: 5, comment: '', username: '' });
                setShowReviewForm(false);
                fetchReviews();
            } else {
                alert(data.message || 'Error adding review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? styles.starFilled : styles.starEmpty}>
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.reviewsHeader}>
                <h3>Customer Reviews</h3>
                <div className={styles.ratingOverview}>
                    <div className={styles.averageRating}>
                        {renderStars(Math.round(averageRating))}
                        <span className={styles.ratingNumber}>
                            {averageRating.toFixed(1)} out of 5
                        </span>
                        <span className={styles.reviewCount}>
                            ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.addReviewSection}>
                {!showReviewForm ? (
                    <button 
                        onClick={() => setShowReviewForm(true)}
                        className={styles.addReviewBtn}
                    >
                        Write a Review
                    </button>
                ) : (
                    <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                        <h4>Write Your Review</h4>
                        
                        <div className={styles.usernameInput}>
                            <label>Your Name:</label>
                            <input
                                type="text"
                                value={newReview.username}
                                onChange={e => setNewReview({...newReview, username: e.target.value})}
                                placeholder="Enter your name..."
                                required
                            />
                        </div>

                        <div className={styles.ratingInput}>
                            <label>Rating:</label>
                            <select 
                                value={newReview.rating}
                                onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                required
                            >
                                <option value={5}>5 Stars - Excellent</option>
                                <option value={4}>4 Stars - Very Good</option>
                                <option value={3}>3 Stars - Good</option>
                                <option value={2}>2 Stars - Fair</option>
                                <option value={1}>1 Star - Poor</option>
                            </select>
                        </div>

                        <div className={styles.commentInput}>
                            <label>Comment:</label>
                            <textarea
                                value={newReview.comment}
                                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                                placeholder="Share your thoughts about this product..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className={styles.formButtons}>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={styles.submitBtn}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowReviewForm(false)}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className={styles.reviewsList}>
                {reviews.length === 0 ? (
                    <p className={styles.noReviews}>No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewerInfo}>
                                    <strong>{review.username}</strong>
                                    <span className={styles.reviewDate}>
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                                <div className={styles.reviewRating}>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <p className={styles.reviewComment}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Reviews;