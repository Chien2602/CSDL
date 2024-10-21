const express = require('express');
const { connectMainDB, connectNorthDB, connectCentralDB, connectSouthDB } = require('./db');
const sql = require('mssql');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Phân tán dữ liệu từ cơ sở dữ liệu chính sang các cơ sở dữ liệu con
app.post('/distribute', async (req, res) => {
    let mainPool, northPool, centralPool, southPool;

    try {
        // Kết nối cơ sở dữ liệu
        mainPool = await connectMainDB();
        northPool = await connectNorthDB();
        centralPool = await connectCentralDB();
        southPool = await connectSouthDB();

        // Lấy dữ liệu từ cơ sở dữ liệu chính (QUANLYCUAHANG)
        const query = `SELECT * FROM Orders`;
        const result = await mainPool.request().query(query);
        const orders = result.recordset;

        // Phân loại dữ liệu và chuyển sang các cơ sở dữ liệu con
        for (const order of orders) {
            let pool;
            switch (order.Region) {
                case 'north':
                    pool = northPool;
                    break;
                case 'central':
                    pool = centralPool;
                    break;
                case 'south':
                    pool = southPool;
                    break;
                default:
                    continue; // Bỏ qua nếu không thuộc vùng miền nào
            }

            // Chuyển dữ liệu sang cơ sở dữ liệu con
            const insertQuery = `
                INSERT INTO Orders (OrderID, CustomerName, OrderDate, Total)
                VALUES (@OrderID, @CustomerName, @OrderDate, @Total)
            `;
            let request = pool.request();
            request.input('OrderID', sql.Int, order.OrderID);
            request.input('CustomerName', sql.VarChar, order.CustomerName);
            request.input('OrderDate', sql.DateTime, order.OrderDate);
            request.input('Total', sql.Float, order.Total);

            await request.query(insertQuery);
        }

        res.send('Data distributed successfully');
    } catch (err) {
        res.status(500).send('Error distributing data: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
