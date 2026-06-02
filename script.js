// leer los datos
const obtenerDatos = async () => {
    try {
        const respuesta = await axios.get("http://localhost:3000/titulos");
        const divTitulos = document.getElementById("idTitulos");
        const datos = respuesta.data;

        datos.forEach(titulos => {
            const div = document.createElement("div");
            div.innerHTML =
                `
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
                            <span class="card-genre">${titulos.generoId}</span>
                            <div class="card-actions">
                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
            `
            divTitulos.appendChild(div)
        });
    } catch (error) {
        console.log(error);
    }
};

obtenerDatos()

