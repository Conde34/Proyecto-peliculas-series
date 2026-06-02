//*------- main index -------*//

const logo = document.getElementById("logo");
const menuLateral = document.querySelector(".menuLateral");
const spans = document.querySelectorAll("span");
const menuLogo = document.querySelector(".menuLogo");
const main = document.querySelector("main");

menuLogo.addEventListener("click", ()=>{
    menuLateral.classList.toggle("maxMenuLateral")
    if(menuLateral.classList.contains("maxMenuLateral")){
        menuLateral.children[0].style.display = "none";
        menuLateral.children[1].style.display = "block";
    } else{
        menuLateral.children[0].style.display = "block";
        menuLateral.children[1].style.display = "none";
    } if(window.innerWidth<=320){
        menuLateral.classList.add("miniMenuLateral")
        main.classList.add("minMain");
        spans.forEach(()=>{
            span.classList.add("oculto");
        })
    }
})

logo.addEventListener("click", () => {
    menuLateral.classList.toggle("miniMenuLateral");
    main.classList.toggle("minMain")
    spans.forEach((span) => {
        span.classList.toggle("oculto");
    })
})

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

