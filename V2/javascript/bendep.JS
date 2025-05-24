    document.addEventListener('DOMContentLoaded', function() {
    // Mapeamento de benefícios
    const beneficiosMap = {
        "Aposentado/Auxílio Doença": "B04",
        "BCP/LOAS": "B03",
        "Bolsa Família/Auxílio Brasil": "B02",
        "Não possui": "B01"
    };

    // Mapeamento de dependências
    const dependenciasMap = {
        "Álcool": "D02",
        "Álcool e Drogas": "D01",
        "Drogas": "D03",
        "Não possui": "D04"
    };

    // Elementos do DOM
    const codigoUsuarioInput = document.getElementById('codigo_usuario');
    const nomeUsuarioCell = document.getElementById('nomeUsuario');
    const idadeUsuarioCell = document.getElementById('idadeUsuario');
    const sexoUsuarioCell = document.getElementById('sexoUsuario');
    const usuarioTable = document.getElementById('usuarioTable');

    // ========== COMPONENTE DE BENEFÍCIOS ==========
    const benefitsViewButton = document.getElementById('options-view-button');
    const benefitsSelectButton = document.getElementById('select-button');
    const benefitsSelectedValue = document.getElementById('selected-value');
    const benefitsOptions = document.getElementById('options');
    const benefitsCheckboxes = document.querySelectorAll('#options input[type="checkbox"]');

    // ========== COMPONENTE DE DEPENDÊNCIAS ==========
    const dependenciesViewButton = document.getElementById('dependencies-view-button');
    const dependenciesSelectButton = document.getElementById('dependencies-select-button');
    const dependenciesSelectedValue = document.getElementById('dependencies-selected-value');
    const dependenciesOptions = document.getElementById('dependencies-options');
    const dependenciesCheckboxes = document.querySelectorAll('#dependencies-options input[type="checkbox"]');

    // Função usuário
    window.buscarUsuario = async function () {
    const codigoUsuario = codigoUsuarioInput.value.trim();

    if (!codigoUsuario) {
        alert('Por favor, digite o código do usuário');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/patient/id?id=${codigoUsuario}`);


        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }

        const data = await response.json();

        nomeUsuarioCell.textContent = data.nome;
        idadeUsuarioCell.textContent = data.idade;
        sexoUsuarioCell.textContent = data.sexo;
        usuarioTable.style.display = 'table';

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        alert('Erro ao buscar usuário. Verifique o código e tente novamente.');
    }
};


    // Função benefícios
    async function enviarBeneficios(codigoUsuario, beneficiosSelecionados) {
        try {
        const response = await fetch('http://localhost:3001/patient-benefit/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            patientCode: codigoUsuario,
            benefits: beneficiosSelecionados.map(b => ({
                code: beneficiosMap[b],
                description: b
            }))
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar benefícios');
        }

        return await response.json();
        } catch (error) {
        console.error('Erro:', error);
        throw error;
        }
    }

    // Função dependências
    async function enviarDependencias(codigoUsuario, dependenciasSelecionadas) {
        try {
        const response = await fetch('http://localhost:3001/patient-dependencie/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            patientCode: codigoUsuario,
            dependencies: dependenciasSelecionadas.map(d => ({
                code: dependenciasMap[d],
                description: d
            }))
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar dependências');
        }

        return await response.json();
        } catch (error) {
        console.error('Erro:', error);
        throw error;
        }
    }

    // Função envio
    window.enviarCadastro = async function() {
        const codigoUsuario = codigoUsuarioInput.value.trim();
        
        if (!codigoUsuario) {
        alert('Por favor, busque um usuário antes de enviar');
        return;
        }

        // benefícios 
        const beneficiosSelecionados = Array.from(benefitsCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

        // dependências 
        const dependenciasSelecionadas = Array.from(dependenciesCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

        if (beneficiosSelecionados.length === 0 && dependenciasSelecionadas.length === 0) {
        alert('Selecione pelo menos um benefício ou dependência');
        return;
        }

        try {
        // Enviar benefícios 
        if (beneficiosSelecionados.length > 0) {
            await enviarBeneficios(codigoUsuario, beneficiosSelecionados);
        }

        // Enviar dependências
        if (dependenciasSelecionadas.length > 0) {
            await enviarDependencias(codigoUsuario, dependenciasSelecionadas);
        }

        alert('Cadastro realizado com sucesso!');
        
        
        benefitsCheckboxes.forEach(cb => cb.checked = false);
        dependenciesCheckboxes.forEach(cb => cb.checked = false);
        updateSelectedValue();
        updateDependenciesSelectedValue();
        window.location.href = 'home.html';


        } catch (error) {
        alert('Erro ao enviar cadastro. Por favor, tente novamente.');
        }
    };

   
    function updateSelectedValue() {
        const selectedOptions = Array.from(benefitsCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
        
        if (selectedOptions.length === 0) {
        benefitsSelectedValue.textContent = 'Selecione o Beneficio';
        } else if (selectedOptions.length === 1) {
        benefitsSelectedValue.textContent = selectedOptions[0];
        } else {
        benefitsSelectedValue.textContent = `${selectedOptions.length} selecionados`;
        }
    }

    function updateDependenciesSelectedValue() {
        const selectedOptions = Array.from(dependenciesCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
        
        if (selectedOptions.length === 0) {
        dependenciesSelectedValue.textContent = 'Selecione as Dependências';
        } else if (selectedOptions.length === 1) {
        dependenciesSelectedValue.textContent = selectedOptions[0];
        } else {
        dependenciesSelectedValue.textContent = `${selectedOptions.length} selecionados`;
        }
    }

    function updateChevrons() {
        const chevronDown = document.querySelector('#chevrons .chevron-down');
        const chevronUp = document.querySelector('#chevrons .chevron-up');
        
        if (benefitsViewButton.checked) {
        chevronDown.style.display = 'none';
        chevronUp.style.display = 'block';
        } else {
        chevronDown.style.display = 'block';
        chevronUp.style.display = 'none';
        }
    }

    function updateDependenciesChevrons() {
        const chevronDown = document.querySelector('#dependencies-chevrons .chevron-down');
        const chevronUp = document.querySelector('#dependencies-chevrons .chevron-up');
        
        if (dependenciesViewButton.checked) {
        chevronDown.style.display = 'none';
        chevronUp.style.display = 'block';
        } else {
        chevronDown.style.display = 'block';
        chevronUp.style.display = 'none';
        }
    }

    document.addEventListener('click', function(e) {
        const isCheckbox = e.target.type === 'checkbox';
        const isInsideBenefits = benefitsSelectButton.contains(e.target) || benefitsOptions.contains(e.target);
        const isInsideDependencies = dependenciesSelectButton.contains(e.target) || dependenciesOptions.contains(e.target);
        
        if (!isInsideBenefits && !isCheckbox) {
        benefitsViewButton.checked = false;
        }
        if (!isInsideDependencies && !isCheckbox) {
        dependenciesViewButton.checked = false;
        }
        
        updateChevrons();
        updateDependenciesChevrons();
    });

    benefitsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
        e.stopPropagation();
        });
        
        checkbox.addEventListener('change', function() {
        if (this.id === 'nenhum' && this.checked) {
            benefitsCheckboxes.forEach(cb => {
            if (cb.id !== 'nenhum') cb.checked = false;
            });
        }
        else if (this.id !== 'nenhum' && this.checked) {
            document.getElementById('nenhum').checked = false;
        }
        
        updateSelectedValue();
        });
    });
    dependenciesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
        e.stopPropagation();
        });
        
        checkbox.addEventListener('change', function() {
        if (this.id === 'nenhuma-dependencia' && this.checked) {
            dependenciesCheckboxes.forEach(cb => {
            if (cb.id !== 'nenhuma-dependencia') cb.checked = false;
            });
        }
        else if (this.id !== 'nenhuma-dependencia' && this.checked) {
            document.getElementById('nenhuma-dependencia').checked = false;
        }
        
        updateDependenciesSelectedValue();
        });
    });

    updateSelectedValue();
    updateDependenciesSelectedValue();
    updateChevrons();
    updateDependenciesChevrons();
    });