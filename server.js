// require
const express = require("express");
const bodyParser = require("body-parser");
const getConnection = require("./config/db");

// init
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const conn = getConnection();

// middleware
app.use((req, res, next)=>{
    req.conn = conn;
    next();
})

app.get("/", (req, res)=>{
    // res.send("Hello World");
    // res.render("index");
    req.conn.query("SELECT * FROM todo", (error, result)=>{
        if(error){
            res.status(500).send("Error occurred");
        }
        res.render("index", {items: result.rows, editTodo: null});
    });
});

app.post("/add-todo", (req, res)=>{

    req.conn.query("INSERT INTO todo (id, title, iscompleted) values($1, $2, $3)", [Math.floor(Math.random(5) * 1000), req.body.todo, false], (error, result)=>{
        if(error){
            res.status(500).send("Error occurred");
        }
        res.redirect("/");
    })
});

app.post("/delete-todo/:id", (req, res)=>{
    const todoId = req.params.id;
    req.conn.query("DELETE FROM todo WHERE id = $1", [todoId],(error, result)=>{
        if(error){
            res.status(200).send("Error Occurred");
        }
        res.redirect("/");
    })
});

app.get("/edit-todo/:id", (req, res)=>{
    const todoId = req.params.id;
    req.conn.query("SELECT * FROM todo WHERE id = $1", [todoId], (error, result)=>{
        if(error){
            res.status(500).send("Error occurred");
        }
        res.render("index", {items: result.rows, editTodo: result.rows[0]});
    });
});

app.post("/update-todo", (req, res)=>{
    const todoId = req.body.todoId;
    const updateTitle = req.body.updateTodo

    req.conn.query("UPDATE todo SET title = $1 WHERE id = $2", [updateTitle, todoId], (error, result)=>{
        if(error){
            res.status(500).send("Error Occurred");
        }
        res.redirect("/");
    })
});

// server activation
app.listen(8000, () =>{
    console.log("Server listening to port 8000");
})