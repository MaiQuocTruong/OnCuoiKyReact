const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/oncuoikyreact', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Định nghĩa Schema và Model cho MongoDB
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    birthday: { type: Date, required: true },
    avatar: { type: String },
    id: { type: Number, unique: true, default: null },
});
const User = mongoose.model('User', userSchema);

// Định nghĩa Schema và Model cho category
const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
});
const Category = mongoose.model('Category', categorySchema);

// Định nghĩa Schema và Model cho location
const locationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    image: { type: String, required: true },
});
const Location = mongoose.model('Location', locationSchema);

// Setup multer cho file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Endpoint hiển thị danh sách users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Endpoint hiển thị danh sách category
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Endpoint hiển thị danh sách location
app.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ email và mật khẩu.' });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        res.json({
            message: 'Đăng nhập thành công',
            user,
            role: user.role,
        });
    } catch (err) {
        console.error('Lỗi khi xử lý đăng nhập:', err);
        res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
});

app.put('/forgetpassword', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Vui lòng cung cấp email và mật khẩu mới.' });
    }

    try {
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Email không tồn tại trong hệ thống.' });
        }

        // Cập nhật mật khẩu mới
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Cập nhật mật khẩu thành công.' });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi máy chủ.' });
    }
});

// Endpoint để thêm user
app.post('/users/add', upload.single('avatar'), async (req, res) => {
    const { username, password, email, role, birthday } = req.body;
    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    if (!username || !password || !email || !role || !birthday) {
        return res.status(400).send({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        // Kiểm tra username hoặc email đã tồn tại
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.error(`Trùng lặp username hoặc email: ${existingUser}`);
            return res.status(409).send({ error: 'Username hoặc email đã tồn tại.' });
        }

        // Lấy giá trị `id` mới nhất
        const lastUser = await User.findOne().sort({ id: -1 });
        const newId = lastUser ? lastUser.id + 1 : 1;

        const newUser = new User({ username, password, email, role, birthday, avatar, id: newId });
        await newUser.save();
        res.status(201).send({ message: 'User được thêm thành công!' });
    } catch (err) {
        console.error('Lỗi thêm user:', err);
        res.status(500).send({ error: 'Lỗi máy chủ.' });
    }
});

// Endpoint để xóa tài khoản
app.delete('/delete-user', async (req, res) => {
    const { username } = req.body;

    try {
        const deletedUser = await User.findOneAndDelete({ username });
        if (!deletedUser) {
            return res.status(404).json({ message: 'Username không tồn tại' });
        }
        res.json({ message: 'Xóa user thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

// Endpoint to update user
app.put('/update-user', upload.single('avatar'), async (req, res) => {
    const { _id, username, email, password, role, birthday } = req.body;
    const avatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : req.body.avatar;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { username, email, password, role, birthday, avatar },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ error: 'User không tìm thấy' });
        }

        res.status(200).json({ message: 'Cập nhật user thành công', updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
