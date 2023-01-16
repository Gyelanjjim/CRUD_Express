/* ES6 모듈 사용 시 */
// import "./env.js"
// import { db_host, db_user, db_pass, port, db_connection, typeorm_db } from "./db.js";

// import http from "http";
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import { appendFile } from "fs";

// import { DataSource } from "typeorm";

// const myDataSource = new DataSource({
//     type: db_connection,
//     host: db_host,
//     port,
//     username: db_user,
//     password: db_pass,
//     database: typeorm_db
// })


/* CommonJS 사용 시 */
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const { appendFile } =  require("fs")

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    myDataSource.destroy()
    })

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());

// health check
app.get("/ping", (req,res) => {
    res.status(200).json({ message : "pong" });
})

// create a book
app.post("/books", async (req, res, next) => {
    const { title, description, coverImage } = req.body

    await myDataSource.query(
        `INSERT INTO books(
            title, 
            description,
            cover_image
        ) VALUES (?, ?, ?);
        `,
        [ title, description, coverImage ]
    );

    res.status(201).json({ message : "successfullty created" });
})

// Get all books
app.get('/books', async (req, res) => {
    await myDataSource.manager.query(
        `SELECT
                b.id,
                b.title,
                b.description,
                b.cover_image
            FROM books b`
        , (err, rows) => {
            res.status(200).json(rows);
        })
});

// Get all books along with authors
app.get('/books-with-authors', async (req, res) => {
    await myDataSource.manager.query(
        `SELECT
                books.id,
                books.title,
                books.description,
                books.cover_image,
                authors.first_name,
                authors.last_name,
                authors.age
            FROM books_authors ba
            INNER JOIN authors ON ba.author_id = authors.id
            INNER JOIN books ON ba.book_id = books.id`
        , (err, rows) => {
                res.status(200).json(rows);
        })
});

// Update a single book by its primary key
app.patch('/books', async(req, res) => {
    const { title, description, coverImage, bookId } = req.body

    await myDataSource.query(
        `UPDATE books
        SET
            title = ?,
            description = ?,
            cover_image = ?
        WHERE id = ?
        `,
        [ title, description, coverImage, bookId ]
    );
        res.status(201).json({ message : "successfully updated" })
});

// Delete a book
app.delete('/books/:bookId', async(req,res)=>{
    const { bookId } = req.params; 

    await myDataSource.query(
        `DELETE FROM books
        WHERE books.id = ${bookId}
        `);
        res.status(204).json(); 
    }); 

const server = http.createServer(app);

const start = async () => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
}
start();