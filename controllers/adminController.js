const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminUsername = process.env.ADMIN_USERNAME;
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
const secretKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username !== adminUsername) {
    return res.status(400).send('Invalid username or password.');
  }

  const validPassword = await bcrypt.compare(password, adminPasswordHash);
  if (!validPassword) {
    return res.status(400).send('Invalid username or password.');
  }

  const token = jwt.sign({ username: adminUsername, role: 'admin' }, secretKey, { expiresIn: '1h' });
  res.send({ token });
};
