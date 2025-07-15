import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

// ✅ Get current user profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, age },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Profile update failed' });
  }
};

// ✅ Wishlist
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
};

// ✅ Add review with media support
export const addReview = async (req, res) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;
  const media = req.file?.filename;

  try {
    const review = new Review({
      productId,
      userId: req.user._id,
      comment,
      rating,
      media,
    });
    await review.save();
    res.status(201).json({ msg: 'Review added with media', review });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get current user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id }).populate('productId', 'title image');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch reviews' });
  }
};

// ✅ Addresses
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ msg: 'Address is required' });
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (err) {
    console.error('❌ Failed to add address:', err);
    res.status(500).json({ msg: 'Failed to add address' });
  }
};

export const updateUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!Array.isArray(req.body.addresses)) {
      return res.status(400).json({ msg: 'Addresses should be an array' });
    }

    user.addresses = req.body.addresses;
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    console.error("❌ Failed to update addresses:", err);
    res.status(500).json({ msg: 'Failed to update addresses' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const index = req.params.index;

    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ msg: 'Invalid address index' });
    }

    user.addresses.splice(index, 1);
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    console.error('❌ Failed to delete address:', err);
    res.status(500).json({ msg: 'Address deletion failed' });
  }
};

// ✅ Delete review by user
export const deleteReviewByUser = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!review) return res.status(404).json({ msg: 'Review not found or unauthorized' });
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete review' });
  }
};

// ✅ Update review by user with media
export const updateReviewByUser = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const media = req.file?.filename;

    const updatedFields = { comment, rating };
    if (media) updatedFields.media = media;

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updatedFields,
      { new: true }
    );

    if (!review) return res.status(404).json({ msg: 'Review not found or unauthorized' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update review' });
  }
};

// ✅ Update Seller Address
export const updateSellerAddress = async (req, res) => {
  try {
    const { street, city, state, pincode } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ msg: 'Only sellers can update shipping address' });
    }

    user.address = { street, city, state, pincode };
    await user.save();

    res.json({ msg: '✅ Address saved', address: user.address });
  } catch (err) {
    console.error('❌ Failed to update seller address:', err);
    res.status(500).json({ msg: 'Failed to update address' });
  }
};
