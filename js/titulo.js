//*------- main titulo -------*//
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
const liAdmin = document.getElementById("liAdmin");

// Verificación de sesión
if (!JSON.parse(localStorage.getItem("usuarioLogueado"))) {
  window.location.href = "login&register.html";
}

// Sidebar: nombre, rol, visibilidad del link Admin y cerrar sesión
const sidebarNombre = document.getElementById("sidebarNombre");
const sidebarRol = document.getElementById("sidebarRol");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (usuarioLogueado) {
  const avatarImg = document.getElementById("sidebarImagen");
  if (avatarImg) {
    if (usuarioLogueado.imagen && usuarioLogueado.imagen.trim() !== "") {
      avatarImg.src = usuarioLogueado.imagen;
    } else {
      avatarImg.src = "../images/defaultAvatar.webp"; // Respaldo
    }
  }
  sidebarNombre.textContent = usuarioLogueado.nombreUsu;
  sidebarRol.textContent = usuarioLogueado.rol;
  liAdmin.style.display = usuarioLogueado.rol === "admin" ? "" : "none";
} else {
  liAdmin.style.display = "none";
}

btnCerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "../html/login&register.html";
});

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

    const respuestaUsuarios = await axios.get("http://localhost:3000/usuarios");
    const respuestaTitulo = await axios.get(
      `http://localhost:3000/titulos/${tituloId}`,
    );
    const respuestaGeneros = await axios.get("http://localhost:3000/generos");
    const respuestaResenas = await axios.get("http://localhost:3000/resenas");

    const usuarios = respuestaUsuarios.data;
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
    const trailerUrl = titulo.trailer || "";
    const trailerEl = document.getElementById("tituloTrailer");
    if (!trailerUrl.trim()) {
      trailerEl.replaceWith(
        Object.assign(document.createElement("p"), {
          className: "sin-trailer",
          textContent: "No hay trailer disponible para mostrar.",
        }),
      );
    } else {
      let embedUrl = trailerUrl;
      if (trailerUrl.includes("watch?v=")) {
        const videoId = new URL(trailerUrl).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (trailerUrl.includes("youtu.be/")) {
        const videoId = trailerUrl.split("youtu.be/")[1].split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      trailerEl.src = embedUrl;
    }
    document.getElementById("tituloNombre").textContent = titulo.nombre;
    document.getElementById("tituloAnio").textContent = titulo.anio;
    document.getElementById("tituloPlataforma").textContent = titulo.plataforma;
    document.getElementById("tituloTipo").textContent = titulo.tipo;
    document.getElementById("tituloGenero").textContent =
      generoMap[titulo.generoId] || "Sin género";
    document.getElementById("tituloPuntuacion").textContent =
      `${titulo.puntuacion}/10`;

    // Filtrar y renderizar reseñas del título
    const resenasTitulo = resenas.filter(
      (r) => String(r.tituloId) === String(tituloId),
    );
    renderizarResenas(resenasTitulo, usuarios);
  } catch (error) {
    console.log("Error al cargar detalles:", error);
  }
};

// Renderizar reseñas
const renderizarResenas = (resenas, usuarios) => {
  const listaResenas = document.getElementById("listaResenas");

  if (resenas.length === 0) {
    listaResenas.innerHTML = "<p class='sin-resenas'>No hay reseñas aún.</p>";
    return;
  }

  listaResenas.innerHTML = resenas
    .map((resena) => {
      const esCreador =
        resena.usuario &&
        resena.usuario.toLowerCase() ===
          usuarioLogueado.nombreUsu.toLowerCase();

      const esAdmin = usuarioLogueado.rol === "admin";

      let botonesHTML = "";

      const usuarioData = usuarios.find(
        (usuario) =>
          usuario.nombreUsu.toLowerCase() ===
          (resena.usuario || "").toLowerCase(),
      );
      const avatarSrc = usuarioData?.imagen?.trim()
        ? usuarioData.imagen
        : "../images/defaultAvatar.webp";

      if (esCreador) {
        botonesHTML = `
                <button class="btn-resena btn-editar" data-id="${resena.id}" data-texto="${resena.texto.replace(/"/g, "&quot;")}">
                    <ion-icon name="pencil-outline"></ion-icon> Editar
                </button>
                <button class="btn-resena btn-eliminar" data-id="${resena.id}">
                    <ion-icon name="trash-outline"></ion-icon> Eliminar
                </button>
            `;
      } else if (esAdmin) {
        botonesHTML = `
                <button class="btn-resena btn-eliminar" data-id="${resena.id}">
                    <ion-icon name="trash-outline"></ion-icon> Eliminar
                </button>
            `;
      }

      return `
            <div class="resena-item" id="resena-${resena.id}">
                <div class="resena-header">
                    <div class="resena-usuario">
                        <img class="resena-avatar" src="${avatarSrc}" alt="${resena.usuario}" />
                        <div>
                            <span class="resena-nombre">${resena.usuario || "Usuario"}</span>
                            <span class="resena-fecha">${new Date(resena.fecha).toLocaleDateString("es-ES")}</span>
                        </div>
                    </div>
                    <div class="resena-acciones">
                        ${botonesHTML}
                    </div>
                </div>
                <p class="resena-texto">${resena.texto}</p>
            </div>
        `;
    })
    .join("");

  listaResenas.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => eliminarResena(btn.dataset.id));
  });
  listaResenas.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () =>
      abrirModalEditar(btn.dataset.id, btn.dataset.texto),
    );
  });
};

// Formulario agregar reseña
document.getElementById("formResena").addEventListener("submit", async (e) => {
  e.preventDefault();
  const tituloId = obtenerIdTitulo();
  const textoResena = document.getElementById("textoResena").value.trim();
  const usuarioResena = usuarioLogueado.nombreUsu || "Usuario";
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
