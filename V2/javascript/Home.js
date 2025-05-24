async function carregarPacientes() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Token não encontrado. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/patient', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      localStorage.clear();
      window.location.href = 'login.html';
      return;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar pacientes');
    }

    const pacientes = await response.json();
    const ultimos10 = pacientes.reverse().slice(0, 10);
    const tabela = document.getElementById('patientTableBody');
    tabela.innerHTML = '';

    ultimos10.forEach(paciente => {
      const linha = document.createElement('tr');
      
      linha.style.cursor = 'pointer';
      linha.addEventListener('click', () => {
        window.location.href = `teste.html?id=${paciente.id}`;

      });

      linha.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${paciente.idade}</td>
        <td>${paciente.documento}</td>
        <td>${paciente.sexo}</td>
        <td>${new Date(paciente.data_nascimento).toLocaleDateString()}</td>
        <td>${paciente.profissao}</td>
      `;

      tabela.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao carregar pacientes:', erro);
    alert('Erro ao carregar pacientes');
  }
}

carregarPacientes();