const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/all-orders', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formattedOrders = orders.map(order => ({
      id: order.id,
      user_email: order.user_email,
      latitude: order.latitude,
      longitude: order.longitude,
      wasteTypes: order.waste_types,
      pickupDate: order.pickup_date,
      pickupTime: order.pickup_time,
      mobileNumber: order.mobile_number,
      created_at: order.created_at
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
