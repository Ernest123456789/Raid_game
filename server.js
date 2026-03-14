const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const db = new sqlite3.Database("game.db")

db.run(`
CREATE TABLE IF NOT EXISTS players(
id INTEGER PRIMARY KEY,
tg_id TEXT UNIQUE,
energy INTEGER,
metal INTEGER,
wood INTEGER
)
`)

app.post("/login",(req,res)=>{

let tg_id=req.body.tg_id

db.get("SELECT * FROM players WHERE tg_id=?",[tg_id],(err,row)=>{

if(row){

res.json(row)

}else{

db.run(
"INSERT INTO players(tg_id,energy,metal,wood) VALUES(?,?,?,?)",
[tg_id,0,0,0],
function(){

res.json({
tg_id,
energy:0,
metal:0,
wood:0
})

})

}

})

})

app.post("/update",(req,res)=>{

let {tg_id,energy,metal,wood}=req.body

db.run(
"UPDATE players SET energy=?,metal=?,wood=? WHERE tg_id=?",
[energy,metal,wood,tg_id]
)

res.json({ok:true})

})

app.get("/", (req,res)=>{
res.sendFile(__dirname + "/public/index.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`Server started on ${PORT}`))