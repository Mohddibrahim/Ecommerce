import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { comment, rating, productId } = req.body;
    const media = req.file?.path || null;

    const newReview = new Review({
      productId,
      userId: req.user._id,
      comment,
      rating,
      media
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("❌ Failed to create review:", err);
    res.status(500).json({ error: 'Review creation failed' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    console.error("❌ Failed to fetch reviews:", err);
    res.status(500).json({ error: 'Fetching reviews failed' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ msg: 'Review not found or unauthorized' });
    }

    res.json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete review failed' });
  }
};

export const updateReview = async (req, res) => {
  try {
    console.log('➡️ Incoming PUT review request for ID:', req.params.id);
    const review = await Review.findById(req.params.id);

    if (!review) {
      console.log('❌ Review not found');
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      console.log('🚫 Unauthorized user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    review.comment = req.body.comment ?? review.comment;
    review.rating = req.body.rating ?? review.rating;

    if (req.file) {
      review.media = req.file.path; // ✅ media update
    }

    await review.save();
    console.log('✅ Review updated:', review);
    res.json(review);
  } catch (err) {
    console.error('🔥 Server error while updating review:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
