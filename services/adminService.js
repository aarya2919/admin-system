const pool = require('../config/db');

// get user + validator
const getUserWithValidator = async (user_id) => {
  const result = await pool.query(
    `SELECT 
        u.id,
        u.role,
        v.user_id AS validator_id
     FROM users u
     LEFT JOIN validators v
     ON u.id = v.user_id
     WHERE u.id = $1`,
    [user_id]
  );

  return result.rows[0];
};

// update mentor using mentor_profile_id
const updateMentor = async (mentor_profile_id, status) => {
  const result = await pool.query(
    `UPDATE mentor_profiles
     SET is_approved = $1
     WHERE id = $2
     RETURNING id, user_id, is_approved`,
    [status, mentor_profile_id]
  );

  return result.rows[0];
};

module.exports = {
  getUserWithValidator,
  updateMentor
};