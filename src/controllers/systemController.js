const pool = require('../database/db');

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users')
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const editRole = async (req, res) => {
    try {
        const { id } = req.params
        const { is_admin } = req.body
        await pool.query(
            'UPDATE users SET is_admin = ? WHERE id = ?',
            [is_admin, id]
        )
        res.status(201).json({ message: '更新用户角色成功' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = { getUsers, editRole };
