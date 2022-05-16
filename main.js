const fs = require("fs")

let salida = {
    auth_module: {},
    content_module: {},
};


function leerArchivo() {
    let files = fs.readdirSync("./resources", "utf-8");
    cargarSalida(files)
}

function cargarSalida(files) {
    files.forEach(file => {
        let data = fs.readFileSync(`./resources/${file}`, 'utf8');
        let propiedad_authz = JSON.parse(data).provider["content_module"];
        let propiedad_authn = JSON.parse(data).provider["auth_module"];

        if (!salida.auth_module.hasOwnProperty(propiedad_authn)) {
         
            salida['auth_module'][`${propiedad_authn}`] = [];
            salida['auth_module'][`${propiedad_authn}`].push(`./${file}`);
        } else {
            salida['auth_module'][`${propiedad_authn}`].push(`./${file}`);
        }
        if (!salida.content_module.hasOwnProperty(propiedad_authz)) {
            
            salida['content_module'][`${propiedad_authz}`] = [];
            salida['content_module'][`${propiedad_authz}`].push(`./${file}`);
        } else {
            salida['content_module'][`${propiedad_authz}`].push(`./${file}`);
        }

    });

}

function generarSalida() {
    fs.writeFile("salida.json", JSON.stringify(salida), (err, data) => {
        console.log("Archivo creado");
    });

  
}

leerArchivo();

generarSalida();

//PARTE B CONTANDO EL CASO EN QUE PUEDO TENER UN MODULO UTILIZADO POR UN SOLO ARCHIVO


let ej=[] //authn
let ej2=[] //authz
let ejaux=[] //copia de athn para eliminar elementos
let ej2aux=[]  //copia de athnz para eliminar elementos


 //OBTENGO UN ARREGLO DE ARREGLOS SEPARADOS POR MODULOS
for(let modulo of Object.keys(salida.auth_module)){
    ej.push(salida.auth_module[modulo])
    ejaux.push(salida.auth_module[modulo])
}

    for(let modulo of Object.keys(salida.content_module)){
        ej2.push(salida.content_module[modulo])
        ej2aux.push(salida.content_module[modulo])
    }
let res = []
let encontre = false;
let cont = 0


unSoloElemej(ej, ejaux)
unSoloElemej(ej2, ej2aux)

//elimino los arreglos que contienen un solo elemento es decir los modulos que son utilizados por un solo archivo 
async function unSoloElemej(arr, ayuda) {
    cont =0
    for (let i = 0; i < arr.length; i++) {
        
        if (arr[i].length == 1) {
            let j = 0;
            res.push(arr[i][j])
            ayuda.splice(i - cont, 1)
            cont++   
        }   
    }
}

let arraux = []
let arraux2 = []

borrarOcurrencias()

function borrarOcurrencias(){
    
    for(let i = 0; i < res.length ; i++){ //si en el otro arreglo aparecen los archivos que ya agregue a res busco el arreglo q los tiene y los borro
       var sigo = buscar(res[i],ejaux)
       if (!sigo )buscar(res[i],ej2aux)
    }
    //cargo el arreglo auxiliar para poder ir borrando y que el largo no varie 
    for(let x = 0; x< ejaux.length; x++){
        arraux[x] = ejaux [x]
    }
    for(let x = 0; x< ejaux.length; x++){
        arraux2[x] = ej2aux [x]
    }
    if(arraux !=" undefined" && arraux2 != "undefined"){ //si aparece en authn aparece en authz entonces lo borro
        
        for(let i = 0; i < arraux.length;i++){
            res.push(arraux[i][0])
            buscar(ej[i][0],ej2aux)
            ejaux.splice(0,1)
            
        }
         if(ej2aux != "undefined"){
             arraux2 = ej2aux   //si nme quedan elementos tengo q pushear el archivo q lo usa y eliminarlo 
             for (let j = 0 ; j< arraux2.length; j++){
                res.push(arraux2[j][0])
                 ej2aux.splice(j,1)
             }
         }
    }
    
    
}
let result = res.filter((item, index) => { // borro los elementos repetidos
    return res.indexOf(item) === index;
})

console.log(result);




//FUNCION AUXILIAR
//busca el elemento abuscar en el arreglo aux y elimina todo el arreglo que lo contiene
function buscar(abuscar,aux){
    let i = 0
    let j;
    encontre = false
    while(!encontre && i < aux.length){
        j = 0
        while(!encontre && j < aux[i].length){
            if (aux[i][j] == abuscar){
                aux.splice(i,1)
                encontre = true
            }
            else{
               j++ 
            }
        }
        i++
    }
    return !encontre
}