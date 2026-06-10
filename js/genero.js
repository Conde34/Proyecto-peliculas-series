// Verificación de sesión
if (!JSON.parse(localStorage.getItem("usuarioLogueado"))) {
  window.location.href = "login.html";
}

const API = "http://localhost:3000/generos";

let editandoId = null;
let editandoFila = null;

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
        <td>
            <div class="acciones-cell">
                <button class="btn-editar"><ion-icon name="pencil-outline"></ion-icon></button>
                <button class="btn-eliminar"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        </td>
    `;

  // Eliminar
  tr.querySelector(".btn-eliminar").addEventListener("click", async () => {
    if (!confirm(`¿Eliminar "${genero.nombre}"?`)) return;
    try {
      await axios.delete(`${API}/${genero.id}`);
      tr.remove();
    } catch (error) {
      console.log(error);
    }
  });

  // Editar
  tr.querySelector(".btn-editar").addEventListener("click", () => {
    document.getElementById("inputNombre").value = genero.nombre;
    document.getElementById("inputColor").value = genero.color;
    document.getElementById("modaltitulo").textContent = "Editar Género";
    editandoId = genero.id;
    editandoFila = tr;
    modalOverlay.classList.add("activo");
  });

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
  editandoId = null;
  editandoFila = null;
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
    if (editandoId) {
      const respuesta = await axios.put(`${API}/${editandoId}`, {
        id: editandoId,
        nombre,
        color,
      });
      const nuevaFila = crearFila(respuesta.data);
      editandoFila.replaceWith(nuevaFila);
    } else {
      const respuesta = await axios.post(API, { nombre, color });
      document
        .getElementById("genreContainer")
        .appendChild(crearFila(respuesta.data));
    }

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
  window.location.href = "login.html";
});
