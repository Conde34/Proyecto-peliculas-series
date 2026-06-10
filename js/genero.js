

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


// Verificación de sesión
if (!JSON.parse(localStorage.getItem("usuarioLogueado"))) {
  window.location.href = "../html/index.html";
}



const API = "http://localhost:3000/generos";

const modalOverlay = document.getElementById("modalOverlay");

// Crear fila de la tabla
const crearFila = (genero) => {
  const tr = document.createElement("tr");
  tr.dataset.id = genero.id;
  tr.innerHTML = `
        <td>${genero.nombre}</td>
        <td>
            <div class="color-cell">
                <span class="color-dot" style="background-color: ${genero.color};"></span>
                ${genero.color}
            </div>
        </td>
       
    `;

  return tr;
};

// Cargar géneros
const obtenerGeneros = async () => {
  const genreContainer = document.getElementById("genreContainer");
  if (!genreContainer) return;

  try {
    const respuesta = await axios.get(API);
    respuesta.data.forEach((genero) => {
      genreContainer.appendChild(crearFila(genero));
    });
  } catch (error) {
    console.log(error);
  }
};

// Modal - agregar
document.querySelector(".add-btn").addEventListener("click", () => {
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputColor").value = "#7c3aed";
  document.getElementById("modaltitulo").textContent = "Agregar Género";
  modalOverlay.classList.add("activo");
});

// Modal - cancelar
document.getElementById("btnCancelar").addEventListener("click", () => {
  modalOverlay.classList.remove("activo");
});

// Modal - guardar
document.getElementById("btnGuardar").addEventListener("click", async () => {
  const nombre = document.getElementById("inputNombre").value.trim();
  const color = document.getElementById("inputColor").value;

  if (!nombre) return alert("Ingresá un nombre");

  try {
    const respuesta = await axios.post(API, { nombre, color });
    document
      .getElementById("genreContainer")
      .appendChild(crearFila(respuesta.data));

    modalOverlay.classList.remove("activo");
  } catch (error) {
    console.log(error);
  }
});

obtenerGeneros();

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
