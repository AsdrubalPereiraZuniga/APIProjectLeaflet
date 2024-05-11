let map; // mapa
let marker; // marcador

//el siguiente evento se carga al finalizar la carga del DOM de proyecto
document.addEventListener("DOMContentLoaded", function(){
    let lat = 9.9354; 
    var lng = -84.1032; // ubicaciones de San José
    map = L.map('map').setView([lat, lng], 13); // se le da las ubicaciones iniciales al mapa

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map); // se agrega la capa de mosaicos de OpenStreetMap

    marker = L.marker([lat, lng]).addTo(map); // se agrega el marcador al mapa según las coordenadas    
    marker.bindPopup('Standart location').openPopup(); // se coloca la ventana emergente "My location"
});

function reder(){//función para redenderizar el mapa a la ubicación del dispositivo del usuario
    if(navigator.geolocation){ // se pregunta si el navegador permite la geolocalización
        navigator.geolocation.getCurrentPosition(function (position){// se obtienen las coordenadas, guardadas en position
            let latitude = position.coords.latitude; // latitud
            let longitude = position.coords.longitude;// longitud 
            map.removeLayer(marker); // se elimina el marcador de mapa, para su nueva ubicación            
            marker = L.marker([latitude, longitude]).addTo(map); // se vuelve a agregar el marcador al mapa        
            marker.bindPopup('My location').openPopup();
            map.setView([latitude, longitude]); // se configura el mapa en base a la ubicación del usuario
        });
        
    } else{
        alert("Geolocation is not enabled in this browser or your device location is not enabled")
    }      
}

var btn_location = document.getElementById("btn_location");
    btn_location.addEventListener("click", reder);
