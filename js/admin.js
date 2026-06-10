// Protección: solo admin puede entrar
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!usuarioLogueado || usuarioLogueado.rol !== "admin") {
  window.location.href = "index.html";
}

// Sidebar: nombre, rol y cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sidebarNombre").textContent = usuarioLogueado.nombre;
  document.getElementById("sidebarRol").textContent = usuarioLogueado.rol;
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
  });
});

// traer los datos del db.json y hacer el grafico
async function cargarGraficoGeneros() {
  // traigo el archivo
  const respuesta = await fetch("../db.json");
  const datos = await respuesta.json();

  // guardo los titulos y los generos en variables
  const titulos = datos.titulos;
  const generos = datos.generos;

  // cuento cuantos titulos tiene cada genero
  // uso un objeto vacio y voy sumando de a uno
  const conteo = {};

  for (let i = 0; i < titulos.length; i++) {
    const id = titulos[i].generoId;

    if (conteo[id] == undefined) {
      conteo[id] = 0;
    }

    conteo[id] = conteo[id] + 1;
  }

  // calculo el total para sacar el porcentaje despues
  const total = titulos.length;

  // --- armo el SVG de la dona ---

  // el radio y el centro del circulo
  const radio = 80;
  const cx = 110;
  const cy = 110;

  // la circunferencia es 2 * PI * radio
  const circunferencia = 2 * 3.14159 * radio;

  // voy a ir guardando los segmentos aca
  let segmentos = "";

  // esto me dice desde donde empieza cada segmento
  let offset = 0;

  for (let i = 0; i < generos.length; i++) {
    const genero = generos[i];

    // cuantos titulos tiene este genero
    const cantidad = conteo[genero.id];

    // el porcentaje de este genero
    const porcentaje = (cantidad / total) * 100;

    // que tan largo es el arco en pixeles
    const largo = (porcentaje / 100) * circunferencia;

    // creo el circulo con stroke-dasharray para que parezca un arco
    const segmento =
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      radio +
      '" fill="none" stroke="' +
      genero.color +
      '" stroke-width="32" stroke-dasharray="' +
      largo +
      " " +
      circunferencia +
      '" stroke-dashoffset="' +
      -offset +
      '" transform="rotate(-90 ' +
      cx +
      " " +
      cy +
      ')">' +
      "<title>" +
      genero.nombre +
      ": " +
      cantidad +
      " titulos (" +
      porcentaje.toFixed(1) +
      "%)</title>" +
      "</circle>";

    segmentos = segmentos + segmento;

    // avanzo el offset para el proximo segmento
    offset = offset + largo;
  }

  // numero en el centro de la dona
  const centro =
    '<text x="' +
    cx +
    '" y="' +
    (cy - 8) +
    '" text-anchor="middle" font-size="22" font-weight="bold" fill="currentColor">' +
    total +
    "</text>" +
    '<text x="' +
    cx +
    '" y="' +
    (cy + 14) +
    '" text-anchor="middle" font-size="11" fill="#9CA3AF">titulos</text>';

  // armo el svg completo
  const svg =
    '<svg width="220" height="220" viewBox="0 0 220 220">' +
    segmentos +
    centro +
    "</svg>";

  // --- armo la leyenda ---

  let leyenda = "";

  for (let i = 0; i < generos.length; i++) {
    const genero = generos[i];
    const cantidad = conteo[genero.id];
    const porcentaje = ((cantidad / total) * 100).toFixed(1);

    const fila =
      '<div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">' +
      '<span style="width:14px; height:14px; border-radius:3px; background:' +
      genero.color +
      '; display:inline-block;"></span>' +
      '<span style="flex:1; font-size:14px;">' +
      genero.nombre +
      "</span>" +
      '<span style="font-size:14px; font-weight:600;">' +
      cantidad +
      "</span>" +
      '<span style="font-size:12px; color:#9CA3AF; min-width:42px; text-align:right;">' +
      porcentaje +
      "%</span>" +
      "</div>";

    leyenda = leyenda + fila;
  }

  // --- meto todo en el HTML ---

  // busco el canvas que esta en el html
  const canvas = document.getElementById("grafico1");

  // creo un div nuevo para poner el svg y la leyenda
  const div = document.createElement("div");

  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";

  div.style.flexWrap = "wrap";

  div.innerHTML =
    svg +
    '<div style="min-width:180px;"><p style="font-size:13px; color:#9CA3AF; margin-bottom:14px;">Generos</p>' +
    leyenda +
    "</div>";

  // reemplazo el canvas con el div nuevo
  canvas.replaceWith(div);
}

// traigo los datos y hago el grafico de barras con plataformas
async function cargarGraficoPlataformas() {
  // traigo el archivo
  const respuesta = await fetch("../db.json");
  const datos = await respuesta.json();

  // guardo los titulos
  const titulos = datos.titulos;

  // cuento cuantos titulos tiene cada plataforma
  const conteo = {};

  for (let i = 0; i < titulos.length; i++) {
    const plataforma = titulos[i].plataforma;

    if (conteo[plataforma] == undefined) {
      conteo[plataforma] = 0;
    }

    conteo[plataforma] = conteo[plataforma] + 1;
  }

  // saco los nombres de las plataformas y las cantidades
  const plataformas = Object.keys(conteo);
  const cantidades = Object.values(conteo);

  // busco el maximo para calcular el ancho de cada barra
  let maximo = 0;
  for (let i = 0; i < cantidades.length; i++) {
    if (cantidades[i] > maximo) {
      maximo = cantidades[i];
    }
  }

  // colores para cada barra
  const colores = [
    "#7C3AED",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EC4899",
  ];

  // --- armo las barras en SVG ---

  const anchoSVG = 350;
  const altoBarra = 32;
  const espaciado = 20;
  const margenIzq = 100; // espacio para los nombres
  const margenDer = 100;
  const anchoMaxBarra = anchoSVG - margenIzq - margenDer;

  const altoSVG = plataformas.length * (altoBarra + espaciado) + espaciado;

  let barras = "";

  for (let i = 0; i < plataformas.length; i++) {
    const y = espaciado + i * (altoBarra + espaciado);
    const anchoBarra = (cantidades[i] / maximo) * anchoMaxBarra;
    const color = colores[i % colores.length];

    // etiqueta con el nombre de la plataforma
    const etiqueta =
      '<text x="' +
      (margenIzq - 10) +
      '" y="' +
      (y + altoBarra / 2 + 5) +
      '" text-anchor="end" font-size="13" fill="currentColor">' +
      plataformas[i] +
      "</text>";

    // la barra
    const barra =
      '<rect x="' +
      margenIzq +
      '" y="' +
      y +
      '" width="' +
      anchoBarra +
      '" height="' +
      altoBarra +
      '" rx="6" fill="' +
      color +
      '"></rect>';

    // numero al final de la barra
    const numero =
      '<text x="' +
      (margenIzq + anchoBarra + 8) +
      '" y="' +
      (y + altoBarra / 2 + 5) +
      '" font-size="13" font-weight="600" fill="currentColor">' +
      cantidades[i] +
      "</text>";

    barras = barras + etiqueta + barra + numero;
  }

  const svg =
    '<svg width="' +
    anchoSVG +
    '" height="' +
    altoSVG +
    '" viewBox="0 0 ' +
    anchoSVG +
    " " +
    altoSVG +
    '">' +
    barras +
    "</svg>";

  // --- meto el svg en el HTML ---

  const canvas = document.getElementById("grafico2");

  const div = document.createElement("div");

  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";

  div.style.gap = "9px";

  // titulo del grafico
  const titulo = document.createElement("p");
  titulo.textContent = "Títulos por Plataforma";
  titulo.style.fontWeight = "600";
  titulo.style.fontSize = "15px";
  titulo.style.marginBottom = "4px";

  div.appendChild(titulo);
  div.innerHTML = div.innerHTML + svg;

  canvas.replaceWith(div);
}

// espero a que cargue la pagina
document.addEventListener("DOMContentLoaded", cargarGraficoPlataformas);
// espero a que cargue la pagina antes de ejecutar la funcion
document.addEventListener("DOMContentLoaded", cargarGraficoGeneros);

const d = document;

let idEditar = null;

//   PARTE DE TITULOS

//Obtener los titulos

const obtenerTitulos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/titulos");
    const datos = response.data;
    const tbody = d.getElementById("tablaTitulos-admin");
    datos.forEach((titulos) => {
      const tr = d.createElement("tr");
      tr.innerHTML = `
        <td class="contenido-tabla">${titulos.id}</td>
        <td class="contenido-tabla">${titulos.nombre}</td>
        <td class="contenido-tabla">${titulos.tipo}</td>
        <td class="contenido-tabla">${titulos.plataforma}</td>
        <td class="contenido-tabla">
        <ion-icon onclick="editarInputs('${titulos.id}','${titulos.nombre}','${titulos.tipo}','${titulos.anio}','${titulos.plataforma}','${titulos.puntuacion}','${titulos.estado}','${titulos.generoId}','${titulos.imagen}')" class="btn-edit" name="pencil-outline"></ion-icon>
        <ion-icon onclick="eliminarTitulo('${titulos.id}')" class="btn-del" name="trash-outline"></ion-icon>       
       `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
};

obtenerTitulos();

// MAXIMIZA DE MANERA DINAMICA EL FORMULARIO DE AG TITULOS PARA ELEGIR EL ID DEL GENERO
document.addEventListener("DOMContentLoaded", async () => {
  const respuesta = await fetch("../db.json");
  const datos = await respuesta.json();
  const totalGeneros = datos.generos.length;
  document.getElementById("input-generoId").max = totalGeneros;
});

const agregarTitulo = async () => {
  try {
    const nombre = document.getElementById("input-nombre").value;
    const tipo = document.getElementById("input-tipo").value;
    const anio = document.getElementById("input-anio").value;
    const plataforma = document.getElementById("input-plataforma").value;
    const puntuacion = document.getElementById("input-puntuacion").value;
    const estado = document.getElementById("input-estado").value;
    const generoId = document.getElementById("input-generoId").value;
    const imagen = document.getElementById("input-imagen").value;

    if (
      !nombre ||
      !tipo ||
      !anio ||
      !plataforma ||
      !puntuacion ||
      !estado ||
      !generoId ||
      !imagen
    ) {
      alert("Por Favor, Complete todos los campos!");
    } else {
      const datos = {
        nombre,
        tipo,
        anio,
        plataforma,
        puntuacion,
        estado,
        generoId,
        imagen,
      };

      const response = await axios.post("http://localhost:3000/titulos", datos);
      document.getElementById("formAgregarTitulo").reset();
      alert("Titulo agregado exitosamente");
      obtenerTitulos();
    }
  } catch (error) {
    console.log(error);
  }
};

const eliminarTitulo = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/titulos/${id}`);
    obtenerTitulos();
  } catch (error) {
    console.log(error);
  }
};

const editarInputs = async (
  id,
  nombre,
  tipo,
  anio,
  plataforma,
  puntuacion,
  estado,
  generoId,
  imagen,
) => {
  window.location.href = "#form-titulos-admin";
  document.getElementById("input-nombre").value = nombre;
  document.getElementById("input-tipo").value = tipo;
  document.getElementById("input-anio").value = anio;
  document.getElementById("input-plataforma").value = plataforma;
  document.getElementById("input-puntuacion").value = puntuacion;
  document.getElementById("input-estado").value = estado;
  document.getElementById("input-generoId").value = generoId;
  document.getElementById("input-imagen").value = imagen;
  idEditar = id;
  const btn = document.getElementById("btn-guardar");

  btn.textContent = "Actualizar Titulo";
  btn.onclick = editarTitulos;
};

const editarTitulos = async () => {
  try {
    const nombre = document.getElementById("input-nombre").value;
    const tipo = document.getElementById("input-tipo").value;
    const anio = document.getElementById("input-anio").value;
    const plataforma = document.getElementById("input-plataforma").value;
    const puntuacion = document.getElementById("input-puntuacion").value;
    const estado = document.getElementById("input-estado").value;
    const generoId = document.getElementById("input-generoId").value;
    const imagen = document.getElementById("input-imagen").value;

    const datos = {
      nombre,
      tipo,
      anio,
      plataforma,
      puntuacion,
      estado,
      generoId,
      imagen,
    };

    const response = await axios.put(
      `http://localhost:3000/titulos/${idEditar}`,
      datos,
    );
    obtenerTitulos();
  } catch (error) {
    console.log(error);
  }
};

//     PARTE DE GENEROS

const obtenerGeneros = async () => {
  try {
    const response = await axios.get("http://localhost:3000/generos");
    const datos = response.data;
    const tbody = d.getElementById("tablaGeneros-admin");
    datos.forEach((generos) => {
      const tr = d.createElement("tr");
      tr.innerHTML = `
        <td class="contenido-tabla">${generos.id}</td>
        <td class="contenido-tabla">${generos.nombre}</td>
        <td class="contenido-tabla">${generos.color}</td>
        <ion-icon onClick="editarInputsGen('${generos.id}', '${generos.nombre}', '${generos.color}')" class="btn-edit-gen" name="pencil-outline"></ion-icon>
        <ion-icon onclick="eliminarGenero('${generos.id}', '${generos.nombre}')" class="btn-del-gen" name="trash-outline"></ion-icon>       
       `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
};

obtenerGeneros();

const agregarGenero = async () => {
  const nombre = document.getElementById("input-nombre-gen").value;
  const color = document.getElementById("input-color-gen").value;
  if (!nombre || !color) {
    alert("Por favor, completa todos los campos antes de guardar.");
  } else {
    try {
      const datos = {
        nombre,
        color,
      };

      const response = await axios.post("http://localhost:3000/generos", datos);
      document.getElementById("formAgregarGenero").reset();
      alert("Género agregado exitosamente");
    } catch (error) {
      console.log(error);
    }
    obtenerTitulos();
  }
};

let idEliminarGen = null;

const eliminarGenero = (id, nombre) => {
  idEliminarGen = id;
  document.getElementById("modal-nombre-gen").textContent = nombre;
  const overlay = document.getElementById("modal-overlay-gen");
  overlay.style.display = "flex";
};

const cerrarModalGen = () => {
  document.getElementById("modal-overlay-gen").style.display = "none";
  idEliminarGen = null;
};

const confirmarEliminarGen = async () => {
  try {
    await axios.delete(`http://localhost:3000/generos/${idEliminarGen}`);
    cerrarModalGen();
    document.getElementById("tablaGeneros-admin").innerHTML = "";
    obtenerGeneros();
  } catch (error) {
    console.log(error);
  }
};

const editarInputsGen = async (id, nombre, color) => {
  window.location.href = "#form-generos-admin";
  document.getElementById("input-nombre-gen").value = nombre;
  document.getElementById("input-color-gen").value = color;
  idEditar = id;
  const btn = document.getElementById("btn-guardar-gen");

  btn.textContent = "Actualizar Género";
  btn.onclick = editarGeneros;
};

const editarGeneros = async () => {
  try {
    const nombre = document.getElementById("input-nombre-gen").value;
    const color = document.getElementById("input-color-gen").value;

    const datos = {
      nombre,
      color,
    };

    const response = await axios.put(
      `http://localhost:3000/generos/${idEditar}`,
      datos,
    );
    obtenerGeneros();
  } catch (error) {
    console.log(error);
  }
};

const cargarCards = async () => {
  const respuesta = await fetch("../db.json");
  const datos = await respuesta.json();

  const titulos = datos.titulos;
  const generos = datos.generos;
  const resenas = datos.resenas;

  const totalTitulos = titulos.length;
  const totalSeries = titulos.filter((t) => t.tipo === "serie").length;
  const totalPeliculas = titulos.filter((t) => t.tipo === "película").length;
  const totalGeneros = generos.length;
  const totalResenas = resenas.length;

  document.getElementById("card-titulos-totales").textContent = totalTitulos;
  document.getElementById("card-series").textContent = totalSeries;
  document.getElementById("card-peliculas").textContent = totalPeliculas;
  document.getElementById("card-generos").textContent = totalGeneros;
  document.getElementById("card-resenas").textContent = totalResenas;
};

document.addEventListener("DOMContentLoaded", cargarCards);
