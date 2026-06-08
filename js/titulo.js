//*------- main titulo -------*//

const logo = document.getElementById("logo");
const menuLateral = document.querySelector(".menuLateral");
const spans = document.querySelectorAll("span");
const menuLogo = document.querySelector(".menuLogo");
const main = document.querySelector("main");

menuLogo.addEventListener("click", () => {
    menuLateral.classList.toggle("maxMenuLateral")
    if (menuLateral.classList.contains("maxMenuLateral")) {
        menuLateral.children[0].style.display = "none";
        menuLateral.children[1].style.display = "block";
    } else {
        menuLateral.children[0].style.display = "block";
        menuLateral.children[1].style.display = "none";
    } if (window.innerWidth <= 320) {
        menuLateral.classList.add("miniMenuLateral")
        main.classList.add("minMain");
        spans.forEach(() => {
            span.classList.add("oculto");
        })
    }
})

logo.addEventListener("click", () => {
    menuLateral.classList.toggle("miniMenuLateral");
    main.classList.toggle("minMain")
    spans.forEach((span) => {
        span.classList.toggle("oculto");
    })
})

// Obtener ID del título desde la URL
const obtenerIdTitulo = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// Cargar detalles del título
const cargarDetallesTitulo = async () => {
    try {
        const tituloId = obtenerIdTitulo();
        if (!tituloId) {
            console.log('No se proporcionó ID de título');
            return;
        }

        const respuestaTitulo = await axios.get(`http://localhost:3000/titulos/${tituloId}`);
        const respuestaGeneros = await axios.get("http://localhost:3000/generos");
        const respuestaResenas = await axios.get("http://localhost:3000/resenas");

        const titulo = respuestaTitulo.data;
        const generos = respuestaGeneros.data;
        const resenas = respuestaResenas.data;

        // Crear mapeo de géneros
        const generoMap = {};
        generos.forEach(genero => {
            generoMap[genero.id] = genero.nombre;
        });

        // Llenar información del título
        document.getElementById("tituloImagen").src = titulo.imagen;
        document.getElementById("tituloNombre").textContent = titulo.nombre;
        document.getElementById("tituloAnio").textContent = titulo.anio;
        document.getElementById("tituloPlataforma").textContent = titulo.plataforma;
        document.getElementById("tituloTipo").textContent = titulo.tipo;
        document.getElementById("tituloGenero").textContent = generoMap[titulo.generoId] || "Sin género";
        document.getElementById("tituloPuntuacion").textContent = `${titulo.puntuacion}/10`;
        document.getElementById("tituloEstado").textContent = titulo.estado;

        // Cargar reseñas del título
        const resenasTitulo = resenas.filter(r => r.tituloId == tituloId);
        const listaResenas = document.getElementById("listaResenas");

        if (resenasTitulo.length === 0) {
            listaResenas.innerHTML = "<p class='sin-resenas'>No hay reseñas aún.</p>";
        } else {
            listaResenas.innerHTML = resenasTitulo.map(resena => `
                <div class="resena-item">
                    <p class="resena-texto">${resena.texto}</p>
                    <p class="resena-fecha">${new Date(resena.fecha).toLocaleDateString('es-ES')}</p>
                </div>
            `).join("");
        }

        // Configurar formulario para agregar reseña
        const formResena = document.getElementById("formResena");
        formResena.addEventListener("submit", async (e) => {
            e.preventDefault();
            const textoResena = document.getElementById("textoResena").value;
            
            try {
                const nuevaResena = {
                    tituloId: parseInt(tituloId),
                    texto: textoResena,
                    fecha: new Date().toISOString().split('T')[0]
                };

                await axios.post("http://localhost:3000/resenas", nuevaResena);
                document.getElementById("textoResena").value = "";
                cargarDetallesTitulo(); // Recargar las reseñas
            } catch (error) {
                console.log('Error al agregar reseña:', error);
            }
        });

    } catch (error) {
        console.log('Error al cargar detalles:', error);
    }
};

cargarDetallesTitulo();
