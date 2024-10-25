let nivel = 0
let carnada = 0
let anzuelo = false
let dinero = 50
let empleados = 0
let peluche = 0

const pezTable = document.querySelector('#pezTable')
const dineroHTML = document.querySelector('#dinero')
const carnadaHTML = document.querySelector('#carnada')
const alertaDinero = document.querySelector('#alertaDinero')
const nivelTotal = document.querySelector('#nivelTotal')
const empleadosHTML = document.querySelector('#empleados')

const pecesNombres = []
async function conseguirPeces(){
    try{
        const fishlistJSON = await fetch('../Js/fishlist.json')
        const fishlist = await fishlistJSON.json()
        fishlist.sort((a,b)=>{
            return  b.nivel - a.nivel
        })
        fishlist.forEach(e=>{
            pecesNombres.unshift(e)
        })
    }catch(error){
        console.warn(error)
}}
conseguirPeces()

const tienda = [
    {id: 0, nombre: 'Caña basica', precio: 50},
    {id: 1, nombre: 'Carnada', precio: 200},
    {id: 2, nombre: 'Anzuelo', precio: 1000},
    {id: 3, nombre: 'Contratar pescadores', precio: 5000},
    {id: 4, nombre: 'Peluche', precio: 99999}
]

const pecesAtrapados = []

class Pez{
    constructor (id, nombre, peso, precio, nivelPez){
    this.id = id
    this.nombre = nombre
    this.peso = peso
    this.precio = precio
    this.nivelPez = nivelPez
    }
    pezcar(){
        pecesAtrapados.push(this)
    }
}

if(localStorage.getItem('nivel') !== null){
    nivel = JSON.parse(localStorage.getItem('nivel'))
}
if(localStorage.getItem('carnada') !== null){
    carnada = JSON.parse(localStorage.getItem('carnada'))
}
if(localStorage.getItem('anzuelo') !== null){
    anzuelo = JSON.parse(localStorage.getItem('anzuelo'))
}
if(localStorage.getItem('dinero') !== null){
    dinero = JSON.parse(localStorage.getItem('dinero'))
}
if(localStorage.getItem('empleados') !== null){
    peluche = JSON.parse(localStorage.getItem('empleados'))
}
if(localStorage.getItem('peluche') !== null){
    peluche = JSON.parse(localStorage.getItem('peluche'))
}


if(nivel > 0){
    tienda[0].nombre = ('Caña nivel ' + (nivel + 1))
    tienda[0].precio = (250 * nivel)
}

dineroHTML.innerText = ('Dinero: ' + dinero + '$')
carnadaHTML.innerText = ('Carnada: ' + carnada)
empleadosHTML.innerText = ('Empleados: ' + empleados)
function actualizarNivel(){
if(anzuelo == true){
    nivelTotal.innerText = ('Nivel total: ' + (nivel + 1))
}else{
    nivelTotal.innerText = ('Nivel total: ' + nivel)
}}actualizarNivel()

let botones = document.querySelectorAll(".vender")
function addVender(){
    botones = document.querySelectorAll(".vender")
    botones.forEach(boton => {
        boton.addEventListener('click', ()=>{
            let idVenta = parseInt((boton.parentElement.parentElement.querySelector('.id')).innerText)
            dinero = dinero + pecesAtrapados[(idVenta - 1)].precio
            dineroHTML.innerText = ('Dinero: ' + dinero + '$')
            pecesAtrapados.splice((idVenta) - 1,1)
            boton.parentElement.parentElement.parentElement.remove()
            let idBoton = pezTable.querySelectorAll('.id')
            for(let i = 0; i < idBoton.length;i++){
                idBoton[i].innerText = (i + 1 + '')}
            for(let i = 0; i < pecesAtrapados.length;i++){
                pecesAtrapados[i].id = i}
            alertaDinero.hidden = true
    })})
}

for(let i = 0; localStorage.getItem(('pez' + i)) !== null; i++){
    let pezGuardado = JSON.parse(localStorage.getItem(('pez' + i)))
    let pezAtrapado = new Pez(pezGuardado.id, pezGuardado.nombre, pezGuardado.peso, pezGuardado.precio, pezGuardado.nivelPez)
    pezAtrapado.pezcar()
    pezTable.innerHTML +=
    ('<tr><th class="id">' + (pezAtrapado.id + 1) + '</th><th>' + pezAtrapado.nombre + '</th><th>' + pezAtrapado.peso + '</th><th class="precio">' + pezAtrapado.precio + '$</th>')
    + ('<th><button class="vender">💰</button></th></tr>')
    addVender()
}

function pezGenerador(carnadaCantidad){
    let generarNivel = (Math.floor(Math.random() * nivel))
    if(anzuelo == true){
        generarNivel++
    }
    if(generarNivel >= pecesNombres.length){
        generarNivel = (pecesNombres.length - 1)
    }
    let generarVariacion = (Math.floor(Math.random() * 11))
    let generarPrecio = ((generarNivel + 1) * 45) + (Math.floor(Math.random() * 10))
    if(carnadaCantidad > 0){
        generarPrecio = generarPrecio * 2
        generarVariacion = generarVariacion * (-1)
        carnada = (carnada - 1)
    }
    let pezAtrapado = new Pez(
        pecesAtrapados.length,
        pecesNombres[generarNivel].nombre,
        ((pecesNombres[generarNivel].peso) - generarVariacion),
        generarPrecio,
        generarNivel
    )
    if(generarNivel >= pecesNombres.length){pezAtrapado.nombre = pecesNombres[pecesNombres.length - 1]}
    pezAtrapado.pezcar()
    alertaDinero.hidden = true
}

const btnPescar = document.querySelector('#btnPescar')
const alertaNivel = document.querySelector('#alertaNivel')

function atraparPez(carnadaCantidad){
    if(nivel == 0){
        alertaNivel.hidden = false
    }else{
        pezGenerador(carnadaCantidad)
        let ultimoPez = pecesAtrapados[pecesAtrapados.length - 1]
        pezTable.innerHTML +=
        ('<tr><th class="id">' + (ultimoPez.id + 1) + '</th><th>' + ultimoPez.nombre + '</th><th>' + ultimoPez.peso + '</th><th class="precio">' + ultimoPez.precio + '$</th>')
        + ('<th><button class="vender">💰</button></th></tr>')
        addVender()
        alertaNivel.hidden = true

}}

btnPescar.addEventListener('click',()=>{
    if(carnada>0){
        atraparPez(true)
    }else{
        atraparPez(false)
    }
})

const venderTodo = document.querySelector('#venderTodo')
venderTodo.addEventListener('click',()=>{
    pecesAtrapados.forEach(e=>{
        dinero = dinero + e.precio
    })
    dineroHTML.innerText = ('Dinero: ' + dinero + '$')
    pezTable.innerHTML = '<tr><th>Id</th><th>Nombre</th><th>Peso</th><th>Precio</th><th>Vender?</th></tr>'
    pecesAtrapados.splice(0,pecesAtrapados.length)
})

const tiendaTable = document.querySelector('#tiendaTable')

for(let e of tienda){
    tiendaTable.innerHTML += 
    ('<tr><th id="nombre'+e.id+'">' + e.nombre + '</th><th id="precio'+e.id+'">' + e.precio + '</th>')
    + ('<th><button id="comprar' + e.id + '">💸</button></th></tr>')
    alertaDinero.hidden = true
}


let comprar0 = document.querySelector('#comprar0')
let comprar1 = document.querySelector('#comprar1')
let comprar2 = document.querySelector('#comprar2')
let comprar3 = document.querySelector('#comprar3')
let comprar4 = document.querySelector('#comprar4')

if(anzuelo == true){
    comprar2.parentElement.parentElement.parentElement.hidden = true
    
}

comprar0.addEventListener('click',()=>{
    if (dinero < tienda[0].precio){
        alertaDinero.hidden = false
    }else{
        dinero = (dinero - tienda[0].precio);
        dineroHTML.innerText = ('Dinero: ' + dinero + '$');
        nivel++
        actualizarNivel()
        tienda[0].precio = (250 * nivel);
        tienda[0].nombre = ('Caña nivel ' + (nivel + 1));
        (document.querySelector('#nombre0')).innerText = tienda[0].nombre;
        (document.querySelector('#precio0')).innerText = tienda[0].precio
        alertaDinero.hidden = true
        alertaNivel.hidden = true
    }
})

comprar1.addEventListener('click',()=>{
    if (dinero < tienda[1].precio){
        alertaDinero.hidden = false
    }else{
        dinero = (dinero - tienda[1].precio)
        dineroHTML.innerText = ('Dinero: ' + dinero + '$')
        carnada++
        carnadaHTML.innerText = ('Carnada: ' + carnada)
        alertaDinero.hidden = true
    }
})

comprar2.addEventListener('click',()=>{
    if (dinero < tienda[2].precio){
        alertaDinero.hidden = false
    }else{
        dinero = (dinero - tienda[2].precio)
        dineroHTML.innerText = ('Dinero: ' + dinero + '$')
        anzuelo = true
        actualizarNivel()
        comprar2.parentElement.parentElement.parentElement.hidden = true
        alertaDinero.hidden = true
    }
})

const timerArray = []

comprar3.addEventListener('click',()=>{ 
    if (dinero < tienda[3].precio){
        alertaDinero.hidden = false
    }else{
        if(empleados>0){
            clearInterval(timerArray[0])
            timerArray.splice(0,1)
            atraparPez()
        }
        dinero = (dinero - tienda[3].precio)
        dineroHTML.innerText = ('Dinero: ' + dinero + '$')
        empleados++
        empleadosHTML.innerText = ('Empleados: ' + empleados)
        timerArray.push(setInterval(()=>{
            atraparPez(false)
        }, (3000/(empleados))))
    }
})

let imgContenedor = document.querySelector('#imgContenedor')
comprar4.addEventListener('click',()=>{
    if (dinero < tienda[4].precio){
        alertaDinero.hidden = false
    }else{
        dinero = (dinero - tienda[4].precio)
        dineroHTML.innerText = ('Dinero: ' + dinero + '$')
        peluche++
        alertaDinero.hidden = true
        imgContenedor.innerHTML += addPeluche(Math.floor(Math.random() * 6))
    }
})

function addPeluche(numero){
    if(numero == 0){
        return '<img src="https://m.media-amazon.com/images/I/51G22XSlZDL._AC_SL1001_.jpg" alt="Cirno peluche"></img>'
    }else if(numero == 1){
        return '<img src="https://m.media-amazon.com/images/I/61ZUmWLOm3L.jpg" alt="Reimu peluche"></img>'
    }else if(numero == 2){
        return '<img src="https://m.media-amazon.com/images/I/51ZEir-5H2L._AC_UF894,1000_QL80_.jpg" alt="Marisa peluche"></img>'
    }else if(numero == 3){
        return '<img src="https://m.media-amazon.com/images/I/513MIC5OULL._AC_SL1001_.jpg" alt="Sakuya peluche"></img>'
    }else if(numero == 4){
        return '<img src="https://m.media-amazon.com/images/I/51gmuPeAALL._AC_SL1333_.jpg" alt="Flandre peluche"></img>'
    }else{
        return '<img src="https://m.media-amazon.com/images/I/5130-j6APoL._AC_SL1200_.jpg" alt="Izayoi peluche"></img>'
    }
}

const btnBorrar = document.querySelector('#btnBorrar')
btnBorrar.addEventListener('click',()=>{
    Swal.fire({
        icon: 'warning',
        title: "Quieres borrar la partida?",
        text: "Esta accion es permanente.",
        showCancelButton: true,
        confirmButtonText: "Borrar partida",
        cancelButtonText: `Cancelar`
        }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            nivel = 0
            carnada = 0
            anzuelo = false
            dinero = 50
            peluche = 0
            if(empleados>0){
                clearInterval(timerArray[0])
                timerArray.splice(0,1)
                atraparPez()
            }
            empleados = 0
            dineroHTML.innerText = ('Dinero: ' + dinero + '$')
            carnadaHTML.innerText = ('Carnada: ' + carnada)
            empleadosHTML.innerText = ('Empleados: ' + empleados)
            pezTable.innerHTML = '<tr><th>Id</th><th>Nombre</th><th>Peso</th><th>Precio</th><th>Vender?</th></tr>'
            pecesAtrapados.splice(0,pecesAtrapados.length)
            actualizarNivel()
            imgContenedor.innerHTML = ''
            alertaDinero.hidden = true
            alertaNivel.hidden = true
            tienda[0].precio = 50;
            tienda[0].nombre = ('Caña nivel ' + (nivel + 1));
            (document.querySelector('#nombre0')).innerText = tienda[0].nombre;
            (document.querySelector('#precio0')).innerText = tienda[0].precio;
            comprar2.parentElement.parentElement.parentElement.hidden = false
            Swal.fire({
                title: "La partida ha sido borrada",
                icon: "success"
            });
    }});
})

const btnGuardar = document.querySelector('#btnGuardar')
btnGuardar.addEventListener('click',()=>{
    localStorage.clear()
    localStorage.setItem('nivel', nivel)
    localStorage.setItem('carnada', carnada)
    localStorage.setItem('anzuelo', anzuelo)
    localStorage.setItem('dinero', dinero)
    localStorage.setItem('peluche', peluche)
    localStorage.setItem('empleados', empleados)
    for(let pecesJSON of pecesAtrapados){
        let clave = ('pez' + pecesJSON.id)
        const objJSON = JSON.stringify(pecesJSON)
        localStorage.setItem(clave, objJSON)
    }
    Toastify({
        text: "¡Se ha guardado la partida!",
        duration: 5000,
        style: {
            background: "rgb(4, 4, 65)",
        }
        }).showToast();
})