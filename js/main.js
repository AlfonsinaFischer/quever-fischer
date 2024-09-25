
let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];


const contenedorPeliculas = document.querySelector("#titulos");
const listaVacia = document.querySelector("#lista-vacia");
const listaPeliculas = document.querySelector("#carrito-productos");
const totalPeliculas = document.querySelector("#carrito-total");


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
                <p>Género: ${pelicula.genero}</p>
                <p>Puntaje: ${pelicula.puntaje}</p>
            `;


            let buttonEliminar = document.createElement("button");
            buttonEliminar.classList.add("btn", "btn-danger", "pelicula-btn");
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
        genero: genero,
        puntaje: puntaje
    };

    peliculas.push(nuevaPelicula);
    mostrarPeliculas();
}


function eliminarPelicula(pelicula) {
    peliculas = peliculas.filter(item => item.id !== pelicula.id);
    mostrarPeliculas();
}


function actualizarTotalPeliculas() {
    totalPeliculas.innerText = `${peliculas.length}`;
}


document.querySelector("#agregar-pelicula-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.querySelector("#titulo-pelicula").value;
    const genero = document.querySelector("#genero-pelicula").value;
    const puntaje = document.querySelector("#puntaje-pelicula").value;

    if (titulo && genero && puntaje) {
        agregarPelicula(titulo, genero, puntaje);
        e.target.reset(); 
    } else {
        alert("Por favor, completa todos los campos");
    }
});


mostrarPeliculas();