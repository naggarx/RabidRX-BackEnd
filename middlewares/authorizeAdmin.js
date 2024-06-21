// middlewares/authorizeAdmin.js
function authorizeAdmin(req, res, next) {
  if (req.admin.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  next();
}

module.exports = authorizeAdmin;
