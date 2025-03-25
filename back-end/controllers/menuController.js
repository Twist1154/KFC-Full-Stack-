import pool from '../db.js';

export const getMenuItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
