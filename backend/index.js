console.log('Starting application');
var waitTill = new Date(new Date().getTime() + 1500);
while (waitTill > new Date()) {}

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const qrcode = require('qrcode');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const port = '30000';

const baseDBOptions = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    waitForConnections: true,
};

const mysqlRootDB = mysql.createConnection(baseDBOptions);
const db = mysql.createConnection({...baseDBOptions, database: "userdb"})

mysqlRootDB.connect((err) => {
    if (err) throw err;

    mysqlRootDB.query('CREATE DATABASE IF NOT EXISTS userdb', function (err) {
        if (err) throw err;

        db.connect((err) => {
            if (err) throw err;
            console.log('Database connected!');

            db.query(
                `CREATE TABLE IF NOT EXISTS user (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(64) NOT NULL,
                password VARCHAR(128) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE (username)
                )`,
                function (err) {
                    if (err) throw err;
                }
            );
        });
    });
});



// mysqlRootDB.connect((err) => {
//     if (err) throw err;

//     mysqlRootDB.query('CREATE DATABASE IF NOT EXISTS userdb', function (err) {
//         if (err) throw err;

//         db.connect((err) => {
//             if (err) throw err;
//             console.log('Database connected!');

//             db.query(
//                 `CREATE TABLE IF NOT EXISTS user (
//                 id INT NOT NULL AUTO_INCREMENT,
//                 username VARCHAR(64) NOT NULL,
//                 password VARCHAR(128) NOT NULL,
//                 PRIMARY KEY (id),
//                 UNIQUE (username)
//                 )`,
//                 function (err) {
//                     if (err) throw err;
//                     db.query(
//                         `CREATE TABLE IF NOT EXISTS timer (
//                         id INT NOT NULL AUTO_INCREMENT,
//                         scan_datang TIME,
//                         scan_pulang TIME,
//                         PRIMARY KEY (id),
//                         )`,
//                         function(err) {
//                             if (err) throw err;
//                         }
//                     )
//                 }
//             );
//         });
//     });
// });


// mysqlRootDB.connect(()=>{
//     return new Promise((resolve, reject) =>{
//         if (reject) throw reject;
//         console.log("database connected!");
//     }).then(mysqlRootDB.query('CREATE DATABASE IF NOT EXISTS'))
//     .then(db.connect())
//     .then(db.query(
//         `CREATE TABLE IF NOT EXISTS user (
//         id INT NOT NULL AUTO_INCREMENT,
//         nama VARCHAR(21) NOT NULL,
//         password VARCHAR(128) NOT NULL,
//         PRIMARY KEY (id),
//         )`
//     )).then(db.query(
//         `CREATE TABLE IF NOT EXISTS timer (
//         id INT NOT NULL AUTO_INCREMENT,
//         scan_datang TIME,
//         scan_pulang TIME,
//         PRIMARY KEY (id),
//         )`
//     )).catch(reject => {throw reject});
// })

// class Database {
//     constructor(config) {
//         this.connection = mysql.createConnection(config);
//     }
//     connect() {
//         return new Promise( (resolve, reject) => {
//             this.connection.connect((err) => {
//                 if (err) {
//                     return reject(err)
//                 }
//                 resolve()
//             })
//         })
//     }
//     query( sql, args ) {
//         return new Promise( ( resolve, reject ) => {
//             this.connection.query( sql, args, ( err, rows ) => {
//                 if ( err )
//                     return reject( err );
//                 resolve( rows );
//             } );
//         } );
//     }
//     close() {
//         return new Promise( ( resolve, reject ) => {
//             this.connection.end( err => {
//                 if ( err )
//                     return reject( err );
//                 resolve();
//             } );
//         } );
//     }
// }

// const mysqlRootDB = new Database(baseDBOptions);
// const db = new Database({...baseDBOptions, database: 'userdb'});

// mysqlRootDB.connect()
//     .then(mysqlRootDB.query('CREATE DATABASE IF NOT EXISTS'))
//     .then(db.connect())
//     .then(db.query(
//         `CREATE TABLE IF NOT EXISTS user (
//         id INT NOT NULL AUTO_INCREMENT,
//         nama VARCHAR(21) NOT NULL,
//         password VARCHAR(128) NOT NULL,
//         PRIMARY KEY (id),
//         )`
//     )).then(db.query(
//         `CREATE TABLE IF NOT EXISTS timer (
//         id INT NOT NULL AUTO_INCREMENT,
//         scan_datang TIME,
//         scan_pulang TIME,
//         PRIMARY KEY (id),
//         )`
//     )).catch(err => {throw err});

app.post('/', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const url = hashedPassword;
    db.query(
        'INSERT INTO user (username, password) VALUES (?,?)',
        [username, hashedPassword],
        function (err) {
            if (err) {
                res.status(400).json({ status: 'error', user: {}, error: err.sqlMessage });
                return;
            }
            qr.toDataURL(url,(err, src) => {
                if (err) throw err;

                res.render("scan", {src});
            })
        }
    );
});  

app.listen(port, () => {
    console.log(`Starting application on port ${port}`);
});
