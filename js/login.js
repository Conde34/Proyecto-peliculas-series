const inputCorreo = document.getElementById("usuario");
const inputContrasenia = document.getElementById("contraseña");
const btnIngresar = document.getElementById("btnIngresar");
const mensaje = document.getElementById("mensaje");

btnIngresar.addEventListener("click", async () => {

    const correo = inputCorreo.value.trim();
    const contrasenia = inputContrasenia.value.trim();

    if (correo === "" || contrasenia === "") {
        mensaje.textContent = "Completa todos los campos";
        mensaje.className = "error";
        return;
    }

    try {

        const respuesta = await axios.get("http://localhost:3000/usuarios");

        const usuarios = respuesta.data;

        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.correo === correo
        );

       
        if (!usuarioEncontrado) {
            mensaje.textContent = "Correo incorrecto";
            mensaje.className = "error";
            return;
        }

        
        if (usuarioEncontrado.contrasenia !== contrasenia) {
            mensaje.textContent = "Contraseña incorrecta";
            mensaje.className = "error";
            return;
        }

       
        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioEncontrado)
        );

        mensaje.textContent = "Login exitoso";
        mensaje.className = "exito";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {

        console.error(error);

        mensaje.textContent = "Error al conectar con el servidor";
        mensaje.className = "error";
    }

});