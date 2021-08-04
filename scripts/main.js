if(document.title.includes("Home")){
    var readMore = document.getElementById("readMore")
    var viewLess = document.getElementById("viewLess")

    readMore.addEventListener("click" , function (e){
        this.style.display = "none"
    })
    viewLess.addEventListener("click" , function (e){
        readMore.style.display = "block"
    })
}
else{
//DECLARACIÓN DE VARIABLES EN SPAGLISH
var api = document.title.includes("Senator") ? "senate" : "house"
var miembrosCongreso=[]

var tiposPartidos = ["D","ID","R"]
var estadoElegido = "todos"
var miembrosFiltrar=[]
var miembrosMostrar=[]
var estadosfiltrados=[];

let init = {
    headers:{
        "X-API-Key": "jL26RkQh2yhnR87s4s8BkLXNmtjW4VH7ZOzlVjOe"
    }
}

var statistics = {
    porPartido: [
    {
        partido: "D",
        conjunto: [],
        promVCP: null
    }, 
    {
        partido: "R",
        conjunto: [],
        promVCP: null
    }, 
    {
        partido: "ID",
        conjunto: []
    }],
    mejores: [],
    peores: []
}

//FUNCIONES PARA PÁGINA CONGRESS
function imprimirTablaCongress(){
    filtrarTablaCongress()
    miembrosMostrar.forEach(miembro => {
        let fila = document.createElement("tr")
        let link = document.createElement("a")
        let col1 = document.createElement("td")
        let col2 = document.createElement("td")
        let col3 = document.createElement("td")
        let col4 = document.createElement("td")
        let col5 = document.createElement("td")
        link.href = miembro.url
        link.target = '_blank'
        link.innerText = `${miembro.last_name} ${miembro.first_name} ${miembro.middle_name || ""}`
        col1.appendChild(link)
        col2.innerText = miembro.party
        col3.innerText = miembro.state
        col4.innerText = miembro.seniority
        col5.innerText = miembro.votes_with_party_pct
        fila.appendChild(col1)
        fila.appendChild(col2)
        fila.appendChild(col3)
        fila.appendChild(col4)
        fila.appendChild(col5)
        document.getElementById("tablaBody").appendChild(fila)
    })
}

function filtrarTablaCongress(){
    document.getElementById("tablaBody").innerHTML = ""
    
    miembrosMostrar=[]

    if(estadoElegido == "todos"){
        miembrosFiltrar = miembrosCongreso
    } else {
        miembrosFiltrar = miembrosCongreso.filter(miembro => miembro.state == estadoElegido)
    }
    tiposPartidos.forEach(partido => {
        let adicionarMostrar = miembrosFiltrar.filter(miembro => miembro.party == partido)
        miembrosMostrar = miembrosMostrar.concat(adicionarMostrar)
    })
}
function leerFiltros(){
    miembrosCongreso.forEach((miembro) => {
        if (!estadosfiltrados.includes(miembro.state)) {
            estadosfiltrados.push(miembro.state)
        }
    })
    
    estadosfiltrados.sort();
    
    estadosfiltrados.forEach(estado => {
        let nuevaOpcion = document.createElement('option');
        nuevaOpcion.innerText = estado;
        nuevaOpcion.value = estado;
        document.getElementById('selectEstado').appendChild(nuevaOpcion)
    })
    
    let inputs = document.getElementsByName('filtroTipo')
    inputs = Array.from(inputs)
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            let cualInput = e.target.value
            let chequeo = e.target.checked
            if (tiposPartidos.includes(cualInput) && !chequeo){
                tiposPartidos = tiposPartidos.filter(partido => partido !== cualInput)
            } else if (!tiposPartidos.includes(cualInput) && chequeo){
                tiposPartidos.push(cualInput)
            }
            tiposPartidos.sort()
            imprimirTablaCongress()
        })
    })
    
    document.getElementById('selectEstado').addEventListener('change', (e) => {
        estadoElegido = e.target.value
        imprimirTablaCongress()
    })
    }

//FUNCIONES PARA ATTENDANCE Y LOYALTY
function llenarPorPartido(){
    statistics.porPartido.forEach(objeto => {
        objeto.conjunto = miembrosCongreso.filter(miembro => miembro.party == objeto.partido)
        objeto.conjunto.forEach(miembro => {
            objeto.promVCP = objeto.promVCP + miembro.votes_with_party_pct
        })
        objeto.promVCP = (objeto.promVCP/objeto.conjunto.length).toFixed(2) 
    })
    pintarTablaChica()
    }

function pintarTablaChica(){
    statistics.porPartido.forEach(objeto =>{
        let cantidad = document.createElement("td")
        let promedio = document.createElement("td")
        cantidad.innerText = objeto.conjunto.length
        document.getElementById(objeto.partido).appendChild(cantidad)
        if (objeto.partido != "ID" ){
            promedio.innerText = objeto.promVCP
        } else {
            promedio.innerText = "-"
        }
        document.getElementById(objeto.partido).appendChild(promedio)
    })
    let total = document.createElement("td")
    total.innerText = miembrosCongreso.length
    let totalpct = document.createElement("td")
    totalpct.innerText = "-"
    document.getElementById("trTotal").appendChild(total)
    document.getElementById("trTotal").appendChild(totalpct)
    }
function llenarTablasGrandes(indicador){
    statistics.mejores = []
    statistics.peores = []

    if (indicador == "attendance"){
        statistics.mejores = [...miembrosCongreso.sort( (a, b) => a.missed_votes_pct - b.missed_votes_pct)]
        statistics.peores = [...miembrosCongreso.sort( (a, b) => b.missed_votes_pct - a.missed_votes_pct)]
    } else {
        statistics.peores = [...miembrosCongreso.sort( (a, b) => a.votes_with_party_pct - b.votes_with_party_pct)]
        statistics.mejores = [...miembrosCongreso.sort( (a, b) => b.votes_with_party_pct - a.votes_with_party_pct)]
    }
    let diezPorciento = Math.round(miembrosCongreso.length*10/100)
 //ceil, positivo mayor ;
    statistics.mejores = statistics.mejores.splice(0,diezPorciento)
    statistics.peores = statistics.peores.splice(0,diezPorciento)
    
    pitarTablasGrandes("tablaMejores",statistics.mejores,indicador)
    pitarTablasGrandes("tablaPeores",statistics.peores,indicador)
}
function pitarTablasGrandes(tabla,conjunto, col2col2){
    conjunto.forEach(miembro => {
                let fila = document.createElement("tr")
                let link = document.createElement("a")
                let col1 = document.createElement("td")
                let col2 = document.createElement("td")
                let col3 = document.createElement("td")
                link.href = miembro.url
                link.target = '_blank'
                link.innerText = `${miembro.last_name} ${miembro.first_name} ${miembro.middle_name || ""}`
                col1.appendChild(link)
                col2.innerText = (col2col2 == "attendance") ? miembro.missed_votes : Math.round((miembro.total_votes * miembro.votes_with_party_pct)/100)
                col3.innerText = (col2col2 == "attendance") ? miembro.missed_votes_pct : miembro.votes_with_party_pct
                fila.appendChild(col1)
                fila.appendChild(col2)
                fila.appendChild(col3)
                document.getElementById(tabla).appendChild(fila)
        })
    }
    
//FETCHEO
fetch(`https://api.propublica.org/congress/v1/113/${api}/members.json`, init)
.then(res => res.json())
.then(json => {
    miembrosCongreso = [...json.results[0].members]
    
    switch(true){
        case document.title.includes("Congress"):
            imprimirTablaCongress()
            leerFiltros()
            break
        case document.title.includes("Attendance"):
            let indicador = "attendance"
            llenarPorPartido()
            llenarTablasGrandes(indicador)
            break
        case document.title.includes("Loyalty"):
            let tindicador = "loyalty"
            llenarPorPartido()
            llenarTablasGrandes(tindicador)
    }
})
.catch(err => console.error(err.message))
}