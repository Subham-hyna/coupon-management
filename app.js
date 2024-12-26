import express from 'express';
import moment from 'moment';

const app = express();
app.use(express.json());

let mockDatabase = {
    users: [
        { "id": 1, "name": "John Doe" },
        { "id": 2, "name": "Jane Smith" },
        { "id": 3, "name": "Alice Johnson" },
        { "id": 4, "name": "Bob Brown" },
        { "id": 5, "name": "Emily Davis" }
      ],
    products: [
        { "id": 101, "name": "Product A" },
        { "id": 102, "name": "Product B" },
        { "id": 103, "name": "Product C" },
        { "id": 104, "name": "Product D" },
        { "id": 105, "name": "Product E" }
      ],
  coupons: []
};

// Helper function to generate a 6-character alphanumeric coupon ID
function generateCouponId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let couponId = '';
  for (let i = 0; i < 6; i++) {
    couponId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return couponId;
}

// Create coupon
app.post('/generate-coupon', (req, res) => {
  const { productId, userId } = req.body;

  // Validate product ID and user ID
  const product = mockDatabase.products.find(p => p.id === productId);
  const user = mockDatabase.users.find(u => u.id === userId);
  if (!product || !user) {
    return res.status(400).json({ error: 'Invalid product or user ID' });
  }

  // Check if a coupon for the same product-user combination already exists and is not expired
  const existingCoupon = mockDatabase.coupons.find(coupon => 
    coupon.productId === productId && 
    coupon.userId === userId && 
    moment().isBefore(coupon.expirationDate)
  );

  if (existingCoupon) {
    return res.status(200).json({ couponId: existingCoupon.couponId });
  }

  // Generate a new coupon
  const couponId = generateCouponId();
  const expirationDate = moment().add(1, 'days').toISOString(); // 24 hours expiry

  const coupon = {
    couponId,
    productId,
    userId,
    discount: 10, // For example, a 10% discount
    expirationDate
  };

  mockDatabase.coupons.push(coupon);

  return res.status(201).json({ couponId });
});

// Validate coupon
app.post('/validate-coupon', (req, res) => {
  const { couponId, productId, userId } = req.body;

  // Find the coupon from the mock database
  const coupon = mockDatabase.coupons.find(c => c.couponId === couponId);

  if (!coupon) {
    return res.status(400).json({ error: 'Invalid coupon' });
  }

  // Validate if the coupon is expired
  if (moment().isAfter(coupon.expirationDate)) {
    return res.status(400).json({ error: 'Coupon has expired' });
  }

  // Validate product and user
  if (coupon.productId !== productId || coupon.userId !== userId) {
    return res.status(400).json({ error: 'Coupon is not valid for this product or user' });
  }

  return res.status(200).json({ message: 'Coupon is valid', discount: coupon.discount });
});

// Mock database logging (for demonstration)
app.get('/mock-database', (req, res) => {
  res.json(mockDatabase);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
