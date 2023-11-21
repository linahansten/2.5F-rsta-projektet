const express = require("express")
const path = require("path")
const server = express()
const fs = require("fs")

server.use(express.static(path.resolve("../client")))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const userPath = path.resolve("users.json")
function saveUser(user) {
    const users = getUsers()
    users.push(user)
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2))
}

function getUsers() {
    const data = fs.readFileSync(userPath, "utf8")
    return JSON.parse(data)
}

server.get("/signup", (req, res) => {
    res.sendFile(path.resolve("../client/signup.html"))
})

server.post("/signup", (req, res) => {
    console.log(req.body)
    const newUser = {
        username: req.body.user,
        password: req.body.password
    }
    saveUser(newUser)

    res.redirect("/login")
})

server.get("/login", (req, res) => {
    res.sendFile(path.resolve("../client/login.html"))
})

server.post('/login', (req, res) => {
    const username = req.body.user
    const password = req.body.password

    const users = getUsers()

    const user = users.find(user => user.username === username)

    if (!user) {
        return res.send("user not found")
    }

    if (user.password === password) {
        return res.redirect("/home")
    } else {
        return res.send("invalid password")
    }

})

server.get("/home", (req, res) => {
    res.sendFile(path.resolve("../client/home.html"))
})

server.listen(3000, () => {
    console.log("Server is running")
})

//npm init -y
//cd server -- node app.js to open da server
// CTRL + C to close da server
//localhost:3000
