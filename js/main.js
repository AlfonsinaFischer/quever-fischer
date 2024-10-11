let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];
const apiKey = "73c49b2c"; 

const contenedorPeliculas = document.querySelector("#titulos");
const listaVacia = document.querySelector("#lista-vacia");
const listaPeliculas = document.querySelector("#carrito-productos");
const totalPeliculas = document.querySelector("#carrito-total");
const mensajeError = document.querySelector("#mensaje-error");

const seccionLista = listaPeliculas.parentElement;

const contenedorBoton = document.createElement("div");
contenedorBoton.classList.add("d-flex", "flex-column", "align-items-start", "ms-3"); 

const botonAlAzar = document.createElement("button");
botonAlAzar.innerText = "Elige una película al azar";
botonAlAzar.classList.add("btn", "boton-al-azar", "mb-3"); 

const botonBuscar = document.createElement("button");
botonBuscar.innerText = "Buscar películas populares";
botonBuscar.classList.add("btn", "boton-al-azar", "mb-3"); 

contenedorBoton.appendChild(botonAlAzar);
contenedorBoton.appendChild(botonBuscar);
seccionLista.appendChild(contenedorBoton); 

function mostrarPeliculas() {
    if (peliculas.length === 0) {
        listaVacia.classList.remove("d-none");
        listaPeliculas.classList.add("d-none");
    } else {
        listaVacia.classList.add("d-none");
        listaPeliculas.classList.remove("d-none");

        listaPeliculas.innerHTML = "";  
        peliculas.forEach((pelicula) => {
            let div = document.createElement("div");
            div.classList.add("lista-item");
            div.innerHTML = `
                <h3>${pelicula.titulo}</h3>
                ${pelicula.genero ? `<p>Género: ${pelicula.genero}</p>` : ''} <!-- Solo muestra el género si existe -->
                ${pelicula.puntaje ? `<p>Puntaje: ${pelicula.puntaje}</p>` : ''} <!-- Solo muestra el puntaje si existe -->
            `;

            let buttonEliminar = document.createElement("button");
            buttonEliminar.classList.add("btn", "boton-al-azar", "pelicula-btn");
            buttonEliminar.innerText = "x";
            buttonEliminar.addEventListener("click", () => {
                eliminarPelicula(pelicula);
            });

            div.append(buttonEliminar);
            listaPeliculas.append(div);
        });
    }
    actualizarTotalPeliculas();
    localStorage.setItem("peliculas", JSON.stringify(peliculas));
}

function agregarPelicula(titulo, genero, puntaje) {
    const nuevaPelicula = {
        id: Date.now(),
        titulo: titulo,
        genero: genero || null, 
        puntaje: puntaje || null 
    };

    peliculas.push(nuevaPelicula);
    mostrarPeliculas();

    Toastify({
        text: "Película agregada exitosamente!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#28a745", 
    }).showToast();
}

function eliminarPelicula(pelicula) {
    peliculas = peliculas.filter(item => item.id !== pelicula.id);
    mostrarPeliculas();

    Toastify({
        text: "Película eliminada!",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#dc3545", 
    }).showToast();
}

function actualizarTotalPeliculas() {
    totalPeliculas.innerText = `${peliculas.length}`;
}

function mostrarError(mensaje) {
    mensajeError.innerText = mensaje;
    mensajeError.classList.remove("d-none");
}

function elegirPeliculaAlAzar() {
    if (peliculas.length > 0) {
        const peliculaAleatoria = peliculas[Math.floor(Math.random() * peliculas.length)];
        swal({
            title: "¡RANDOM!",
            text: `Título: ${peliculaAleatoria.titulo}\n${peliculaAleatoria.genero ? `Género: ${peliculaAleatoria.genero}\n` : ''}${peliculaAleatoria.puntaje ? `Puntaje: ${peliculaAleatoria.puntaje}` : ''}`,
            icon: "info",
            buttons: {
                chooseAgain: {
                    text: "Elegir de nuevo",
                    value: "chooseAgain",
                    className: "red-button" 
                },
                okay: {
                    text: "¡Genial!",
                    value: "okay",
                    className: "red-button"
                }
            },
            closeOnClickOutside: false,
            closeOnEsc: false,
            className: "dark-alert" 
        }).then((value) => {
            if (value === "chooseAgain") {
                elegirPeliculaAlAzar(); 
            }
        });
    } else {
        Toastify({
            text: "No hay películas para elegir.",
            duration: 3000,
            gravity: "top",
            position: 'right',
            backgroundColor: "#dc3545", 
        }).showToast();
    }
}

function buscarPeliculasPopulares() {
    const url = `http://www.omdbapi.com/?s=movie&apikey=${apiKey}`; 

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                peliculas = data.Search.map(pelicula => ({
                    id: Date.now() + Math.random(), 
                    titulo: pelicula.Title,
                    genero: pelicula.Genre || null, 
                    puntaje: pelicula.imdbRating || null 
                }));
                mostrarPeliculas();
            } else {
                mostrarError("No se encontraron películas.");
            }
        })
        .catch(error => mostrarError("Error al buscar películas: " + error));
}

document.querySelector("#agregar-pelicula-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.querySelector("#titulo-pelicula").value;
    const genero = document.querySelector("#genero-pelicula").value;
    const puntaje = document.querySelector("#puntaje-pelicula").value;

    if (titulo && genero && puntaje) {
        agregarPelicula(titulo, genero, puntaje);
        e.target.reset(); 
        mensajeError.classList.add("d-none"); 
    } else {
        mostrarError("Por favor, completa todos los campos");
    }
});

botonAlAzar.addEventListener("click", elegirPeliculaAlAzar);
botonBuscar.addEventListener("click", buscarPeliculasPopulares); 

mostrarPeliculas();