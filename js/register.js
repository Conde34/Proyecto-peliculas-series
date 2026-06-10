const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputNombreUsu = document.getElementById("nombreUsu");
const inputCorreo = document.getElementById("correo");
const inputContrasenia = document.getElementById("contrasenia");

const btnRegistrar = document.getElementById("btnRegistrar");
const mensaje = document.getElementById("mensaje");

btnRegistrar.addEventListener("click", async () => {

    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const nombreUsu = inputNombreUsu.value.trim();
    const correo = inputCorreo.value.trim();
    const contrasenia = inputContrasenia.value.trim();

    if (
        nombre === "" ||
        apellido === "" ||
        nombreUsu === "" ||
        correo === "" ||
        contrasenia === ""
    ) {
        mensaje.textContent = "Completa todos los campos";
        mensaje.className = "error";
        return;
    }

    try {

        const respuesta = await axios.get(
            "http://localhost:3000/usuarios"
        );

        const usuarios = respuesta.data;

        const usuarioExistente = usuarios.find(
            usuario => usuario.correo === correo
        );

        if (usuarioExistente) {

            mensaje.textContent = "Ese correo ya está registrado";
            mensaje.className = "error";
            return;
        }

        const nuevoUsuario = {
            nombre,
            apellido,
            nombreUsu,
            correo,
            contrasenia,
            rol: "usuario"
        };

        await axios.post(
            "http://localhost:3000/usuarios",
            nuevoUsuario
        );

        mensaje.textContent = "Usuario registrado correctamente";
        mensaje.className = "exito";

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    } catch (error) {

        console.error(error);

        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.className = "error";
    }
}); 