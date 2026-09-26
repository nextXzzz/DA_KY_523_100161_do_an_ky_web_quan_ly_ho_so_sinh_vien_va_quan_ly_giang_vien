const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Tên đăng nhập không được để trống'], unique: true, trim: true },
  password: { type: String, required: [true, 'Mật khẩu không được để trống'] },
  hoTen: { type: String, required: [true, 'Họ tên không được để trống'], trim: true },
  role: { type: String, enum: ['manager'], default: 'manager' },
  avatar: { type: String, default: '' }
});

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
