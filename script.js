const materias = [
  { id: "mat1", nombre: "Cálculo Diferencial", semestre: 1, requisitos: [] },
  { id: "mat2", nombre: "Programación Básica", semestre: 1, requisitos: [] },
  { id: "mat7", nombre: "Cálculo Integral", semestre: 2, requisitos: ["mat1"] },
  { id: "mat10", nombre: "Programación Orientada a Objetos", semestre: 2, requisitos: ["mat2"] },
  // ... aquí añadiré más según el pensum completo
];

let estadoMaterias = JSON.parse(localStorage.getItem("estadoMaterias")) || {};

function guardarEstado() {
  localStorage.setItem("estadoMaterias", JSON.stringify(estadoMaterias));
}

function estaDesbloqueada(materia) {
  return materia.requisitos.every(req => estadoMaterias[req] === "aprobada");
}

function render() {
  const container = document.getElementById("pensum-container");
  container.innerHTML = "";

  const semestres = [...new Set(materias.map(m => m.semestre))];

  semestres.forEach(sem => {
    const divSem = document.createElement("div");
    divSem.className = "semestre";
    divSem.innerHTML = `<h2>Semestre ${sem}</h2>`;

    materias.filter(m => m.semestre === sem).forEach(m => {
      const div = document.createElement("div");
      div.className = "materia";
      const estado = estadoMaterias[m.id];

      if (estado === "aprobada") {
        div.classList.add("aprobada");
      } else if (m.semestre === 1 || estaDesbloqueada(m)) {
        div.classList.add("desbloqueada");
      } else {
        div.classList.add("bloqueada");
      }

      div.textContent = m.nombre;

      div.onclick = () => {
        if (!estaDesbloqueada(m) && m.semestre !== 1) return;
        estadoMaterias[m.id] = estadoMaterias[m.id] === "aprobada" ? null : "aprobada";
        guardarEstado();
        render();
      };

      divSem.appendChild(div);
    });

    container.appendChild(divSem);
  });
}

render();
