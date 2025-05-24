const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const token = localStorage.getItem('token');

if (!userId || !token) {
    alert("ID ou token não encontrado.");
} else {
    // Dados do paciente
    fetch(`http://localhost:3001/patient/id?id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('id').textContent = data.id || '—';
        document.getElementById('nome').textContent = data.nome || '—';
        document.getElementById('idade').textContent = data.idade || '—';
        document.getElementById('documento').textContent = data.documento || '—';
        document.getElementById('sexo').textContent = data.sexo || '—';
        document.getElementById('data_nascimento').textContent = new Date(data.data_nascimento).toLocaleDateString('pt-BR') || '—';
        document.getElementById('profissao').textContent = data.profissao || '—';
    })
    .catch(err => {
        console.error('Erro ao buscar paciente:', err);
        alert('Erro ao carregar informações do paciente.');
    });

    // Benefícios — corrigido
    fetch(`http://localhost:3001/patient-benefit/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(beneficios => {
        const lista = document.getElementById('beneficios');
        lista.innerHTML = '';
        beneficios.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.nome; // ajuste aqui se o nome do campo for diferente
            lista.appendChild(li);
        });
    })
    .catch(err => console.error('Erro ao buscar benefícios:', err));

    // Dependências — corrigido
    fetch(`http://localhost:3001/patient-dependencie/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(dependencias => {
        const lista = document.getElementById('dependencias');
        lista.innerHTML = '';
        dependencias.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.nome; // ajuste se o campo for diferente
            lista.appendChild(li);
        });
    })
    .catch(err => console.error('Erro ao buscar dependências:', err));

    // Atividades — já estava certo
    fetch(`http://localhost:3001/history-activitie/id?id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(atividades => {
        const lista = document.getElementById('atividades');
        lista.innerHTML = '';
        atividades.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.nome; // ajuste se o campo for diferente
            lista.appendChild(li);
        });
    })
    .catch(err => console.error('Erro ao buscar atividades:', err));
}
