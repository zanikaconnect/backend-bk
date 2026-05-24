const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/authMiddleware');
const { isValidCoordinates, isValidDate, isValidTime, isValidMobileNumber } = require('../utils/validators');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/schedule', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, wasteTypes, pickupDate, pickupTime, mobileNumber } = req.body;
    const { id: userId, email: userEmail } = req.user;

    // Validation
    if (!latitude || !longitude || !wasteTypes || !pickupDate || !pickupTime || !mobileNumber) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!isValidCoordinates(latitude, longitude)) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates' });
    }

    if (!Array.isArray(wasteTypes) || wasteTypes.length === 0) {
      return res.status(400).json({ success: false, error: 'Waste types must be a non-empty array' });
    }

    if (!isValidDate(pickupDate)) {
      return res.status(400).json({ success: false, error: 'Pickup date must be today or in the future' });
    }

    if (!isValidTime(pickupTime)) {
      return res.status(400).json({ success: false, error: 'Invalid time format (use HH:MM)' });
    }

    if (!isValidMobileNumber(mobileNumber)) {
      return res.status(400).json({ success: false, error: 'Mobile number must be 10 digits' });
    }

    // Insert order into Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        user_email: userEmail,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        waste_types: wasteTypes,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        mobile_number: mobileNumber
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        latitude: order.latitude,
        longitude: order.longitude,
        wasteTypes: order.waste_types,
        pickupDate: order.pickup_date,
        pickupTime: order.pickup_time,
        mobileNumber: order.mobile_number,
        created_at: order.created_at
      }
    });
  } catch (err) {
    console.error('Schedule order error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formattedOrders = orders.map(order => ({
      id: order.id,
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
    console.error('Fetch orders error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
