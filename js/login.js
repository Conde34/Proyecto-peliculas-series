
function mostrarNotificacion(texto, tipo = "error") {
    const contenedor = document.getElementById("toastContainer");
    

    const toast = document.createElement("div");
    toast.className = `toast-alerta ${tipo}`;
    
    // Le agregamos un ícono sutil según el tipo
    const icono = tipo === "error" ? "❌" : "✅";
    toast.innerHTML = `<span>${icono}</span> <span>${texto}</span>`;
    
    contenedor.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("salida");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

const inputCorreo = document.getElementById("usuario");
const inputContrasenia = document.getElementById("contraseña");
const btnIngresar = document.getElementById("btnIngresar");

btnIngresar.addEventListener("click", async () => {

    const correo = inputCorreo.value.trim();
    const contrasenia = inputContrasenia.value.trim();

    if (correo === "" || contrasenia === "") {
        mostrarNotificacion("Completa todos los campos", "error");
        return;
    }

    try {
        const respuesta = await axios.get("http://localhost:3000/usuarios");
        const usuarios = respuesta.data;

        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.correo === correo
        );

        if (!usuarioEncontrado) {
            mostrarNotificacion("Correo incorrecto", "error");
            return;
        }

        if (usuarioEncontrado.contrasenia !== contrasenia) {
            mostrarNotificacion("Contraseña incorrecta", "error");
            return;
        }

        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioEncontrado)
        );

        mostrarNotificacion("Login exitoso", "exito");

        setTimeout(() => {
            window.location.href = "index.html"; 
        }, 1500);

    } catch (error) {
        console.error(error);
        mostrarNotificacion("Error al conectar con el servidor", "error");
    }
});