//*------- main titulo -------*//

// Verificación de sesión
if (!JSON.parse(localStorage.getItem("usuarioLogueado"))) {
  window.location.href = "login&register.html";
}

const logo = document.getElementById("logo");
const menuLateral = document.querySelector(".menuLateral");
const spans = document.querySelectorAll("span");
const menuLogo = document.querySelector(".menuLogo");
const main = document.querySelector("main");

// Menu hamburguesa
menuLogo.addEventListener("click", () => {
  menuLateral.classList.toggle("maxMenuLateral");
  if (menuLateral.classList.contains("maxMenuLateral")) {
    menuLateral.children[0].style.display = "none";
    menuLateral.children[1].style.display = "block";
  } else {
    menuLateral.children[0].style.display = "block";
    menuLateral.children[1].style.display = "none";
  }
});

// Menu colapsable desktop
logo.addEventListener("click", () => {
  menuLateral.classList.toggle("miniMenuLateral");
  main.classList.toggle("minMain");
  spans.forEach((span) => {
    span.classList.toggle("oculto");
  });
});

// Obtener ID del título desde la URL
const obtenerIdTitulo = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

// Cargar detalles del título
const cargarDetallesTitulo = async () => {
  try {
    const tituloId = obtenerIdTitulo();
    if (!tituloId) {
      console.log("No se proporcionó ID de título");
      return;
    }

    const respuestaTitulo = await axios.get(
      `http://localhost:3000/titulos/${tituloId}`,
    );
    const respuestaGeneros = await axios.get("http://localhost:3000/generos");
    const respuestaResenas = await axios.get("http://localhost:3000/resenas");

    const titulo = respuestaTitulo.data;
    const generos = respuestaGeneros.data;
    const resenas = respuestaResenas.data;

    // Crear mapeo de géneros
    const generoMap = {};
    generos.forEach((genero) => {
      generoMap[genero.id] = genero.nombre;
    });

    // Llenar información del título
    document.getElementById("tituloImagen").src = titulo.imagen;
    document.getElementById("tituloNombre").textContent = titulo.nombre;
    document.getElementById("tituloAnio").textContent = titulo.anio;
    document.getElementById("tituloPlataforma").textContent = titulo.plataforma;
    document.getElementById("tituloTipo").textContent = titulo.tipo;
    document.getElementById("tituloGenero").textContent =
      generoMap[titulo.generoId] || "Sin género";
    document.getElementById("tituloPuntuacion").textContent =
      `${titulo.puntuacion}/10`;

    const estadoEl = document.getElementById("tituloEstado");
    estadoEl.textContent = titulo.estado;
    if (titulo.estado === "visto") estadoEl.className = "estado-visto";
    if (titulo.estado === "viendo") estadoEl.className = "estado-viendo";
    if (titulo.estado === "pendiente") estadoEl.className = "estado-pendiente";

    // Filtrar y renderizar reseñas del título
    const resenasTitulo = resenas.filter(
      (r) => String(r.tituloId) === String(tituloId),
    );
    renderizarResenas(resenasTitulo);
  } catch (error) {
    console.log("Error al cargar detalles:", error);
  }
};

// Renderizar reseñas
const renderizarResenas = (resenas) => {
  const listaResenas = document.getElementById("listaResenas");

  if (resenas.length === 0) {
    listaResenas.innerHTML = "<p class='sin-resenas'>No hay reseñas aún.</p>";
    return;
  }

  listaResenas.innerHTML = resenas
    .map(
      (resena) => `
        <div class="resena-item" id="resena-${resena.id}">
            <div class="resena-header">
                <div class="resena-usuario">
                    <div class="resena-avatar">${resena.usuario ? resena.usuario[0].toUpperCase() : "U"}</div>
                    <div>
                        <span class="resena-nombre">${resena.usuario || "Usuario"}</span>
                        <span class="resena-fecha">${new Date(resena.fecha).toLocaleDateString("es-ES")}</span>
                    </div>
                </div>
                <div class="resena-acciones">
                    <button class="btn-resena btn-editar" onclick="abrirModalEditar('${resena.id}', \`${resena.texto.replace(/`/g, "'")}\`)">
                        <ion-icon name="pencil-outline"></ion-icon> Editar
                    </button>
                    <button class="btn-resena btn-eliminar" onclick="eliminarResena('${resena.id}')">
                        <ion-icon name="trash-outline"></ion-icon> Eliminar
                    </button>
                </div>
            </div>
            <p class="resena-texto">${resena.texto}</p>
        </div>
    `,
    )
    .join("");
};

// Formulario agregar reseña
document.getElementById("formResena").addEventListener("submit", async (e) => {
  e.preventDefault();
  const tituloId = obtenerIdTitulo();
  const textoResena = document.getElementById("textoResena").value.trim();
  const usuarioResena =
    document.getElementById("usuarioResena").value.trim() || "Usuario";

  if (!textoResena) return;

  try {
    const nuevaResena = {
      tituloId: parseInt(tituloId),
      usuario: usuarioResena,
      texto: textoResena,
      fecha: new Date().toISOString().split("T")[0],
    };

    await axios.post("http://localhost:3000/resenas", nuevaResena);
    document.getElementById("textoResena").value = "";
    document.getElementById("usuarioResena").value = "";
    cargarDetallesTitulo();
  } catch (error) {
    console.log("Error al agregar reseña:", error);
  }
});

// Eliminar reseña
const eliminarResena = async (resenaId) => {
  const confirmar = confirm(
    "¿Estás seguro de que querés eliminar esta reseña?",
  );
  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:3000/resenas/${resenaId}`);
    cargarDetallesTitulo();
  } catch (error) {
    console.log("Error al eliminar reseña:", error);
  }
};

// Abrir modal de edición
const abrirModalEditar = (resenaId, textoActual) => {
  document.getElementById("editResenaId").value = resenaId;
  document.getElementById("editTextoResena").value = textoActual;
  document.getElementById("modalEditar").classList.add("activo");
};

// Cerrar modal
document.getElementById("btnCerrarModal").addEventListener("click", () => {
  document.getElementById("modalEditar").classList.remove("activo");
});

// Cerrar modal al hacer click fuera
document.getElementById("modalEditar").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalEditar")) {
    document.getElementById("modalEditar").classList.remove("activo");
  }
});

// Guardar edición
document
  .getElementById("formEditarResena")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const resenaId = document.getElementById("editResenaId").value;
    const textoEditado = document
      .getElementById("editTextoResena")
      .value.trim();

    if (!textoEditado) return;

    try {
      await axios.patch(`http://localhost:3000/resenas/${resenaId}`, {
        texto: textoEditado,
      });
      document.getElementById("modalEditar").classList.remove("activo");
      cargarDetallesTitulo();
    } catch (error) {
      console.log("Error al editar reseña:", error);
    }
  });

cargarDetallesTitulo();
