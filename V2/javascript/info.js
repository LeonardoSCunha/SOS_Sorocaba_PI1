let pacientesOriginais = [];

async function buscarUsuarios() {
  const termo = document.getElementById("pesquisa").value.toLowerCase();
  const tabela = document.querySelector("#tabelaUsuarios tbody");
  tabela.innerHTML = "";

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/patient", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar usuários");
    const pacientes = await response.json();

    pacientesOriginais = pacientes;
    const filtrados = pacientes.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    if (filtrados.length === 0) {
      tabela.innerHTML = "<tr><td colspan='4'>Nenhum usuário encontrado.</td></tr>";
      return;
    }

    filtrados.forEach(usuario => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.addEventListener("click", () => {
        window.location.href = `teste.html?id=${usuario.id}`;

      });

      tr.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.idade ?? "-"}</td>
        <td>${usuario.documento ?? "-"}</td>
        <td>${usuario.status ?? "-"}</td>
        <td>${usuario.sexo ?? "-"}</td>
        <td>${usuario.data_nascimento ?? "-"}</td>
        <td>${usuario.profissão ?? "-"}</td>
      `;
      tabela.appendChild(tr);
    });
  } catch (err) {
    alert("Erro ao buscar usuários: " + err.message);
  }
}

window.onload = buscarUsuarios;
