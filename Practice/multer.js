const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // Updated path

const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.render("multer");
});

app.post('/practice/upload', upload.single('image'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    return res.redirect("/");
});

app.listen(5000, () => { console.log("Server started at port:", 5000); });
