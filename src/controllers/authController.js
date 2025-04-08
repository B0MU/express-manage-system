const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 注册控制器
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 检查邮箱是否已存在
        const [emailRows] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (emailRows.length > 0) {
            return res.status(409).json({ message: '邮箱已被注册' });
        }

        // 检查用户名是否已存在
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (userRows.length > 0) {
            return res.status(409).json({ message: '用户名已被使用' });
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?,?)',
            [username, email, hashedPassword, 0]
        );

        res.status(201).json({ message: '注册成功，请登录' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 登录控制器
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查找用户
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: '用户名不存在' });
        }

        const user = rows[0];

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '密码错误' });
        }

        // 生成 JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                password: user.password,
                email: user.email,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };