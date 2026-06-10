//*------- main index -------*//

// Verificación de sesión
if (!JSON.parse(localStorage.getItem("usuarioLogueado"))) {
window.location.href = "login&register.html";
}

const logo = document.getElementById("logo");
const menuLateral = document.querySelector(".menuLateral");
const spans = document.querySelectorAll("span");
const menuLogo = document.querySelector(".menuLogo");
const main = document.querySelector("main");

menuLogo.addEventListener("click", () => {
  menuLateral.classList.toggle("maxMenuLateral");
  if (menuLateral.classList.contains("maxMenuLateral")) {
    menuLateral.children[0].style.display = "none";
    menuLateral.children[1].style.display = "block";
  } else {
    menuLateral.children[0].style.display = "block";
    menuLateral.children[1].style.display = "none";
  }
  if (window.innerWidth <= 320) {
    menuLateral.classList.add("miniMenuLateral");
    main.classList.add("minMain");
    spans.forEach(() => {
      span.classList.add("oculto");
    });
  }
});

// Menu responsive

logo.addEventListener("click", () => {
  menuLateral.classList.toggle("miniMenuLateral");
  main.classList.toggle("minMain");
  spans.forEach((span) => {
    span.classList.toggle("oculto");
  });
});

// leer los datos
const obtenerDatos = async () => {
  try {
    const respuesta = await axios.get("http://localhost:3000/titulos");
    const respuestaGeneros = await axios.get("http://localhost:3000/generos");
    const divTitulos = document.getElementById("idTitulos");
    const datos = respuesta.data;
    const generos = respuestaGeneros.data;

    // Crear un mapeo de generoId -> nombre
    const generoMap = {};

    generos.forEach((genero) => {
      generoMap[genero.id] = genero.nombre;
    });

    datos.forEach((titulos) => {
      const div = document.createElement("div");
      const nombreGenero = generoMap[titulos.generoId] || "Sin género";
      div.innerHTML = `
                <a href="titulo.html?id=${titulos.id}">
            <div class="title-card">
                        <div class="card-poster">
                            <img class="card-poster" src="${titulos.imagen}">
                            <div class="card-label">${titulos.tipo}</div>
                        </div>
                        <div class="card-info">
                            <h3>${titulos.nombre}</h3>
                            <div class="card-meta">${titulos.anio} • ${titulos.plataforma}</div>
                            <div class="card-rating">
                                <span class="stars">★</span>
                                <span class="rating-value">${titulos.puntuacion}/10</span>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <span class="card-status status-visto">${titulos.estado}</span>
                            </div>
                            <span class="card-genre">${nombreGenero}</span>
                        </div>
                        </div>
            </a>
                        `;
      divTitulos.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
};

obtenerDatos();

// Sidebar: nombre, rol, visibilidad del link Admin y cerrar sesión
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
const liAdmin = document.getElementById("liAdmin");
const sidebarNombre = document.getElementById("sidebarNombre");
const sidebarRol = document.getElementById("sidebarRol");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (usuarioLogueado) {
  sidebarNombre.textContent = usuarioLogueado.nombre;
  sidebarRol.textContent = usuarioLogueado.rol;
  liAdmin.style.display = usuarioLogueado.rol === "admin" ? "" : "none";
} else {
  liAdmin.style.display = "none";
}

btnCerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "../html/login&register.html";
});
