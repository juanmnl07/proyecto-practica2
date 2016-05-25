window.onload = function(e){
    var dataObject = JSON.parse(simularDatos());
    console.log(dataObject);
}

function simularDatos(){
    return '{"data":[{"Nombre":"Carlos","Edad":50,"Genero":"Masculino"},{"Nombre":"Jose","Edad":23,"Genero":"Masculino"},{"Nombre":"María","Edad":45,"Genero":"Femenino"}]}';
}