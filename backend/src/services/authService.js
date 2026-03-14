import User from '../models/User.js';

class AuthService {
  async registerUser(username, email, password, role = 'customer') {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();
    return user;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async getAllUsers() {
    return await User.find().select('-password');
  }
}

export default new AuthService();
