import Order from '../models/Order.js';
import Product from '../models/Product.js';

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No products in the order' });
    }

    const validProducts = [];
    const invalidProductIds = [];

    for (const item of items) {
      const productId = item.productId || item._id || item.product;
      if (!productId) {
        invalidProductIds.push('undefined');
        continue;
      }

      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`⛔ Product not found: ${productId}`);
        invalidProductIds.push(productId);
        continue;
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.title}"`,
        });
      }

      product.quantity -= item.quantity;
      await product.save();

      validProducts.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        seller: product.seller, // ✅ Now pulling seller from DB
      });
    }

    if (validProducts.length === 0) {
      return res.status(400).json({
        message: 'No valid products to order',
        skipped: invalidProductIds,
      });
    }

    const newOrder = new Order({
      user: userId,
      products: validProducts,
      shippingAddress: address,
      status: 'Pending',
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('❌ Order creation error:', err.message);
    res.status(500).json({ message: err.message || 'Order failed' });
  }
};

// USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'products.productId',
        select: 'title price seller', // populate title/price/seller from live product
        populate: { path: 'seller', select: 'email' },
      })
      .sort({ createdAt: -1 });

    const ordersWithMergedData = orders.map(order => ({
      ...order.toObject(),
      products: order.products.map(item => {
        const product = item.productId;
        return {
          _id: product?._id || item.productId,  // fallback to saved ID
          title: product?.title || item.title,
          price: product?.price || item.price,
          seller: product?.seller || null,
          image: item.image,                   // ✅ this is already stored in the DB
          quantity: item.quantity,
        };
      }),
    }));

    res.json(ordersWithMergedData);
  } catch (err) {
    console.error('❌ Fetch order error:', err.message);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};




// CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};
