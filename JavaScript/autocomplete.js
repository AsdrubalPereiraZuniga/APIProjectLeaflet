
new Autocomplete("search", { // "search" componete de entrada para el autocompletado

    selectFirst: true, // por default se selecciona el primer item de la lista de opciones
    insertToInput: true, // inserta el item seleccionado en el input
    // número de caracteres ingresados para empezar la busqueda de autocompletado
    howManyCharacters: 2,
  
    // busqueda de las opciones de autocompletado
    onSearch: ({ currentValue }) => { // currentValue = texto actual ingresado por el usuario
      
      const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
        currentValue
        // se construye una URL para realizar una petición a una API externa, currentValue -> nombre del lugar
        // URL apunta a la API de Nominatim de OpenStreetMap
      )}`;
        
      return new Promise((resolve) => { // se crea una instancia de la clase Promise "promesa" 
        fetch(api) // se realiza la solicitud a la API de Nominatim, se devuelve una promesa como respuesta de la solicitud                
          .then((response) => response.json()) // se toma la respuesta de la API y se convierte en un JSON
          .then((data) => { // se encadena otro "then" para el manejo de los JSON restantes
            resolve(data.features); // resolve(data.features) es la promesa que se devuelve
            //data.features son las características de interes de la respuesta JSON
            // los then es un método de las promesas que se utiliza para especificar qué hacer cuando 
            //una promesa se resuelve exitosamente, al hacer una peticion http a una URL
          })
          .catch((error) => { // manejo de posibles errores
            console.error(error);
          });
      });
    },
    // onResult -> acción que se realiza cuando se generan los resultados del autocompletado 
    // matches -> número de coincidencias en el resultado del autocompletado
    // templates -> función para generar la apariencia de los resultados.
    onResults: ({ currentValue, matches, template }) => {
      const regex = new RegExp(currentValue, "gi");
      // RegExp -> expresión regular
      // bandera -> modificador que se utiliza junto con la expresión regular para cambiar su comportamiento
      // gi -> bandera, "g" busqueda global, "i" insensible a mayúsculas y minúsculas, g+i=gi 

      return matches === 0 // expresion ternaria, devuelve template si no encuentra coincidencias
        ? template
        : matches
            .map((element) => { // si hay coincidencias, se utiliza el método "map" para iterrar sobre el array de coincidencias
              return `              
            <li class="loupe"> 
              <p>
                ${element.properties.display_name.replace(
                  regex,
                  (str) => `<b>${str}</b>`
                )}
              </p>
            </li> `;
            })
            .join(""); 
            // li -> lista, clase -> loupe, p -> parrafo que contiene el nombre del lugar de coincidencia en negrita
            //join concatena todos los fracmentos HTML generados, son devueltos a onResult
    },
  
    // accion a realizar cuando el usuario selecciona una opción de los items HTML
    onSubmit: ({ object }) => { // object-> contiene la informacion del item seleccionado    
      map.eachLayer(function (layer) { // se itera sobre todas las capas del mapa utilizando el método eachLayer de Leaflet
        if (!!layer.toGeoJSON) { // se verifica si la capa tiene un método toGeoJSON
          map.removeLayer(layer);
          // Si la capa tiene un método toGeoJSON, se elimina esa capa del mapa utilizando el método removeLayer
        }
      });
      // se extraen los datos del item seleccionado
      const { display_name } = object.properties; // nombre del item
      const [lng, lat] = object.geometry.coordinates; // coordinadas del mismo
  
      const marker = L.marker([lat, lng], { // se posiciona el marcador en las coordenadas
        title: display_name, // titulo del marcador
      });
  
      marker.addTo(map).bindPopup(display_name); // se añade el marcador al mapa con una ventana emergente con la informacion del item seleccionado
  
      map.setView([lat, lng], 13); // se redirecciona el mapa a las coordenadas del item (ahí estará el marcador)
      // zoom = 13
    },
   // al seleccionar el item
    onSelectedItem: ({ index, element, object }) => {
      console.log("onSelectedItem:", index, element, object);
    },
    // index-> indice de item seleccionado
    // element-> elemento HTML seleccionado
    // object-> objeto de datos asociado al item seleccionado
    // the method presents no results element

    // cuando no se encuentran resultados en el autocompletar
    noResults: ({ currentValue, template }) =>
      template(`<li>No results found: "${currentValue}"</li>`),// lista con el texto y el contenido "currentValue" del valor de entrada por el usuario
  });