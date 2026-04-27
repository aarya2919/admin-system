const pool = require('../db');

/*
  FUNCTION: updateMentorStatus

  LOGIC:
  1. Check if user is authorized (admin OR validator) → using SINGLE JOIN query
  2. If authorized → update based on action (approve/reject)
  3. If not authorized → force update as rejected (false)
  4. Always update DB so status is visible
*/

const updateMentorStatus = async (req, res) => {
  try {
    const { user_id , mentor_profile_id, action } = req.body;

    // 🔹 Step 0: Validate action input
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: "Action must be approve or reject"
      });
    }

    /*
      Step 1: SINGLE QUERY to check:
      - if user is admin (role = 'admin')
      - OR user exists in validators table

      Using LEFT JOIN to combine both checks
    */
    const userCheck = await pool.query(
      `SELECT 
         u.id,
         u.role,
         v.user_id AS validator_id
       FROM users u
       LEFT JOIN validators v ON u.id = v.user_id
       WHERE u.id = $1`,
      [user_id]
    );

    const user = userCheck.rows[0];

    //  Check conditions
    const isAdmin = user && user.role === 'admin';
    const isValidator = user && user.validator_id !== null;

    let newStatus;

    /*
      Step 2: Authorization Logic

      IF (admin OR validator)
          → allow approve/reject based on action
      ELSE
          → reject + set false
    */
    if (isAdmin || isValidator) {
      // ✔ Authorized → follow action
      newStatus = action === 'approve';
    } else {
      // Not authorized → force reject
      newStatus = false;
    }

    /*
      🔹 Step 3: SINGLE UPDATE QUERY

      This updates:
      - true (approved)
      - false (rejected / unauthorized)

      Always updates DB so status is visible
    */
    const updated = await pool.query(
      `UPDATE mentor_profiles
       SET is_approved = $1
       WHERE id = $2
       RETURNING id, user_id, is_approved`,
      [newStatus, mentor_profile_id]
    );

    // 🔹 Step 4: Handle case where mentor ID does not exist
    if (updated.rows.length === 0) {
      return res.status(404).json({
        message: "Mentor not found"
      });
    }

    /*
      🔹 Step 5: Response

      If not authorized → 403
      If authorized → 200
    */
    if (!isAdmin && !isValidator) {
      return res.status(403).json({
        message: "Rejected: Not authorized",
        data: updated.rows[0]
      });
    }

    return res.status(200).json({
      message: `Mentor ${action}d successfully`,
      data: updated.rows[0]
    });

  } catch (err) {
    //Handle unexpected errors
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = { updateMentorStatus };