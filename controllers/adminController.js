const {
  getUserWithValidator,
  updateMentor
} = require('../services/adminService');

const updateMentorStatus = async (req, res) => {
  try {
    const { user_id, mentor_profile_id, action } = req.body;

    // ✅ basic validation
    if (!user_id || !mentor_profile_id || !action) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: "Action must be approve or reject"
      });
    }

    // ✅ get user
    const user = await getUserWithValidator(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ✅ STRICT AUTH CHECK (FIXED)
    const isAdmin = user?.role === 'admin';

    const isValidator =
      user?.validator_id !== null &&
      user?.validator_id !== undefined;

    // 🔴 DEBUG (keep for now)
    console.log("USER:", user);
    console.log("isAdmin:", isAdmin);
    console.log("isValidator:", isValidator);

    // ❌ block unauthorized users
    if (!isAdmin && !isValidator) {
      return res.status(403).json({
        message: "Rejected: Not authorized"
      });
    }

    // ✅ update mentor
    const updated = await updateMentor(
      mentor_profile_id,
      action === 'approve'
    );

    if (!updated) {
      return res.status(404).json({
        message: "Mentor not found"
      });
    }

    return res.status(200).json({
      message: `Mentor ${action}d successfully`,
      data: updated
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = { updateMentorStatus };