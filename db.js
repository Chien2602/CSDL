const sql = require('mssql');
require('dotenv').config();

// Cấu hình cơ sở dữ liệu chính
const mainConfig = {
    server: process.env.DB_MAIN_SERVER,
    database: process.env.DB_MAIN_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Cấu hình cho miền Bắc
const northConfig = {
    user: process.env.DB_NORTH_USER,
    password: process.env.DB_NORTH_PASSWORD,
    server: process.env.DB_NORTH_SERVER,
    database: process.env.DB_NORTH_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Cấu hình cho miền Trung
const centralConfig = {
    user: process.env.DB_CENTRAL_USER,
    password: process.env.DB_CENTRAL_PASSWORD,
    server: process.env.DB_CENTRAL_SERVER,
    database: process.env.DB_CENTRAL_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Cấu hình cho miền Nam
const southConfig = {
    user: process.env.DB_SOUTH_USER,
    password: process.env.DB_SOUTH_PASSWORD,
    server: process.env.DB_SOUTH_SERVER,
    database: process.env.DB_SOUTH_DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Kết nối cơ sở dữ liệu
const connectDB = async (config) => {
    try {
        let pool = await sql.connect(config);
        console.log('Database connected successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
    }
};

module.exports = {
    connectMainDB: () => connectDB(mainConfig),
    connectNorthDB: () => connectDB(northConfig),
    connectCentralDB: () => connectDB(centralConfig),
    connectSouthDB: () => connectDB(southConfig)
};
