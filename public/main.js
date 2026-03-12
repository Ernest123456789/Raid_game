let tg = window.Telegram.WebApp

tg.expand()

let tg_id = tg.initDataUnsafe.user.id

let energy = 0
let metal = 0
let wood = 0

let workers = [
"generator",
"mine",
"mine"
]

fetch("/login",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({tg_id})
})
.then(res=>res.json())
.then(data=>{

energy=data.energy
metal=data.metal
wood=data.wood

updateResources()

})

function updateResources(){

document.getElementById("energy").innerText=energy
document.getElementById("metal").innerText=metal
document.getElementById("wood").innerText=wood

}

function save(){

fetch("/update",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
tg_id,
energy,
metal,
wood
})
})

}

function renderWorkers(){

document.getElementById("generatorWorkers").innerHTML=""
document.getElementById("mineWorkers").innerHTML=""
document.getElementById("storageWorkers").innerHTML=""

workers.forEach(room=>{

let w=document.createElement("div")

w.className="worker"

document
.getElementById(room+"Workers")
.appendChild(w)

})

}

renderWorkers()

setInterval(()=>{

energy+=workers.filter(w=>w=="generator").length

metal+=workers.filter(w=>w=="mine").length

updateResources()

save()

},5000)

let exploring=false

document.getElementById("exploreBtn").onclick=()=>{

if(exploring) return

exploring=true

let time=60

let timer=setInterval(()=>{

time--

document.getElementById("exploreTimer").innerText=
"Поиск "+time

if(time<=0){

clearInterval(timer)

exploring=false

wood+=Math.floor(Math.random()*10)+5

updateResources()

save()

document.getElementById("exploreTimer").innerText=
"Ресурсы найдены"

}

},1000)

}

document.querySelectorAll("#menu button").forEach(btn=>{

btn.onclick=()=>{

document
.querySelectorAll(".screen")
.forEach(s=>s.classList.remove("active"))

document
.getElementById(btn.dataset.screen)
.classList.add("active")

}

})