
function mostrarNotificacion(texto, tipo = "error") {
    const contenedor = document.getElementById("toastContainer");
    

    const toast = document.createElement("div");
    toast.className = `toast-alerta ${tipo}`;
    

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

const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputNombreUsu = document.getElementById("nombreUsu");
const inputCorreoReg = document.getElementById('correo'); 
const inputContraseniaReg = document.getElementById("contrasenia");
const inputImagenReg = document.getElementById("imagenRegister");


const btnRegistrar = document.getElementById("btnRegistrar");

btnRegistrar.addEventListener("click", async () => {

    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const nombreUsu = inputNombreUsu.value.trim();
    const correo = inputCorreoReg.value.trim();
    const contrasenia = inputContraseniaReg.value.trim();
    const imagen = inputImagenReg.value.trim();
    if (
        nombre === "" ||
        apellido === "" ||
        nombreUsu === "" ||
        correo === "" ||
        contrasenia === "" ||
        imagen === ""
    ) {
        mostrarNotificacion("Completa todos los campos", "error");
        return;
    }

    try {
        const respuesta = await axios.get("http://localhost:3000/usuarios");
        const usuarios = respuesta.data;

        const usuarioExistente = usuarios.find(
            usuario => usuario.correo === correo
        );

        if (usuarioExistente) {
            mostrarNotificacion("Ese correo ya está registrado", "error");
            return;
        }

        const nuevoUsuario = {
            nombre,
            apellido,
            nombreUsu,
            correo,
            contrasenia,
            rol: "usuario",
            imagen,
        };

        await axios.post("http://localhost:3000/usuarios", nuevoUsuario);

        mostrarNotificacion("Usuario registrado correctamente", "exito");

        setTimeout(() => {
            const contenedor = document.getElementById('contenedor-deslizable');
            if(contenedor) {
                contenedor.classList.remove("registro-activo");
                
               
                inputNombre.value = "";
                inputApellido.value = "";
                inputNombreUsu.value = "";
                inputCorreoReg.value = "";
                inputContraseniaReg.value = ""; 
            }
        }, 1500);

    } catch (error) {
        console.error(error);
        mostrarNotificacion("Error al conectar con el servidor", "error");
    }
});