document.addEventListener('DOMContentLoaded', function () {
  // Elementos do componente de atividades
  const activitiesViewButton = document.getElementById('activities-view-button');
  const activitiesSelectButton = document.getElementById('activities-select-button');
  const activitiesSelectedValue = document.getElementById('activities-selected-value');
  const activitiesOptions = document.getElementById('activities-options');
  const activitiesCheckboxes = document.querySelectorAll('#activities-options input[type="checkbox"]');

  // Atualizar chevrons
  function updateActivitiesChevrons() {
    const chevronDown = document.querySelector('#activities-chevrons .chevron-down');
    const chevronUp = document.querySelector('#activities-chevrons .chevron-up');

    if (activitiesViewButton.checked) {
      chevronDown.style.display = 'none';
      chevronUp.style.display = 'block';
    } else {
      chevronDown.style.display = 'block';
      chevronUp.style.display = 'none';
    }
  }

  // Atualizar valor selecionado
  function updateActivitiesSelectedValue() {
    const selectedOptions = Array.from(activitiesCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (selectedOptions.length === 0) {
      activitiesSelectedValue.textContent = 'Selecione as Atividades';
    } else if (selectedOptions.length === 1) {
      activitiesSelectedValue.textContent = selectedOptions[0];
    } else {
      activitiesSelectedValue.textContent = `${selectedOptions.length} selecionadas`;
    }
  }

  // Impedir que o clique nos checkboxes feche o dropdown
  activitiesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    checkbox.addEventListener('change', function () {
      if (this.id === 'nenhuma-atividade' && this.checked) {
        activitiesCheckboxes.forEach(cb => {
          if (cb.id !== 'nenhuma-atividade') cb.checked = false;
        });
      } else if (this.id !== 'nenhuma-atividade' && this.checked) {
        document.getElementById('nenhuma-atividade').checked = false;
      }

      updateActivitiesSelectedValue();
    });
  });

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', function (e) {
    const isCheckbox = e.target.type === 'checkbox';
    const isInsideComponent = activitiesSelectButton.contains(e.target) || activitiesOptions.contains(e.target);

    if (!isInsideComponent && !isCheckbox) {
      activitiesViewButton.checked = false;
    }
    updateActivitiesChevrons();
  });

  // Enviar formulário
  window.enviarAtividades = function () {
    const codigoUsuario = document.getElementById('codigo_usuario').value;
    const dataAtividade = document.getElementById('data_atividade').value;
    const atividadesSelecionadas = Array.from(activitiesCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (!codigoUsuario || atividadesSelecionadas.length === 0 || !dataAtividade) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    console.log('Dados a serem enviados:', {
      codigoUsuario,
      dataAtividade,
      atividades: atividadesSelecionadas
    });

    alert('Atividades registradas com sucesso!');
  };

  // Buscar usuário por código
  async function buscarUsuario() {
    const codigo = document.getElementById("codigo_usuario").value.trim();
    const tabela = document.getElementById("usuarioTable");
    const nomeCell = document.getElementById("nomeUsuario");
    const idadeCell = document.getElementById("idadeUsuario");
    const sexoCell = document.getElementById("sexoUsuario");

    if (!codigo) {
      tabela.style.display = "none";
      return;
    }

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
      const encontrado = pacientes.find(p => String(p.id) === codigo);

      if (!encontrado) {
        alert("Usuário não encontrado.");
        tabela.style.display = "none";
        return;
      }

      nomeCell.textContent = encontrado.nome ?? "-";
      idadeCell.textContent = encontrado.idade ?? "-";
      sexoCell.textContent = encontrado.sexo ?? "-";
      tabela.style.display = "table";
    } catch (err) {
      alert("Erro ao buscar usuário: " + err.message);
      tabela.style.display = "none";
    }
  }

  // Executar busca ao sair do campo
  document.getElementById("codigo_usuario").addEventListener("blur", buscarUsuario);

  // Inicializar valores visuais
  updateActivitiesSelectedValue();
  updateActivitiesChevrons();
});
