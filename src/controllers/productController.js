const pool = require('../database/db');

//创建商品
const postProduct = async (req, res) => {
    try {
        const { name, price } = req.body
        const [result] = await pool.query(
            'INSERT INTO products (name, price) VALUES (?, ?)',
            [name, price]
        )
        res.status(200).json({ id: result.insertId })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
//获取商品
const getProduct = async (req, res) => {
    try {
        const { search } = req.query
        let query = 'SELECT * FROM products'
        const params = []

        if (search) {
            query += ' WHERE name LIKE ?'
            params.push(`%${search}%`)
        }

        const [rows] = await pool.query(query, params)
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
//更新商品
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price } = req.body
        await pool.query(
            'UPDATE products SET name = ?, price = ?WHERE id = ?',
            [name, price, id]
        )
        res.status(201).json({ message: '更新商品成功' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
//删除商品
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM products WHERE id = ?', [id])
        res.status(200).json({ message: '删除商品成功' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { postProduct, getProduct, updateProduct, deleteProduct }