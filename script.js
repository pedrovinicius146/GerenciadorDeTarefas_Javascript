document.addEventListener('DOMContentLoaded', () => {
    const botaoCriar = document.querySelector('.criate');
    const botaoSalvar = document.querySelector('.salvar-lista');
    const botaoApagar = document.querySelector('.apagar-tudo');

    const table = document.querySelector('table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    const diasSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    function adicionarTarefa() {
        const timeInput = document.querySelector('input[type="time"]').value;
        const dayInput = document.querySelector('input[name="dia"]').value.trim().toLowerCase();
        const taskInput = document.querySelector('.tarefa input').value;

        if (!timeInput || !dayInput || !taskInput) {
            alert("Preencha todos os campos!");
            return;
        }

        const formattedTime = timeInput.slice(0, 5) + 'h';

        
        let dayIndex = -1;
        for (let i = 1; i < thead.children.length; i++) {
            const thText = thead.children[i].textContent.trim().toLowerCase();
            if (thText === dayInput) {
                dayIndex = i;
                break;
            }
        }

        if (dayIndex === -1) {
            alert("Dia inválido. Use nomes como: segunda, terça, quarta...");
            return;
        }

      
        let targetRow = null;
        for (let row of tbody.rows) {
            if (row.cells[0].textContent === formattedTime) {
                targetRow = row;
                break;
            }
        }

    
        if (!targetRow) {
            targetRow = tbody.insertRow();

            const timeCell = targetRow.insertCell();
            timeCell.textContent = formattedTime;

           
            for (let i = 0; i < diasSemana.length; i++) {
                const cell = targetRow.insertCell();
                const textarea = document.createElement('textarea');
                textarea.rows = 1;
                cell.appendChild(textarea);
            }
        }

        const tarefaCell = targetRow.cells[dayIndex];
        const textarea = tarefaCell.querySelector('textarea');
        textarea.value = taskInput;

        // Limpa os inputs
        document.querySelector('input[type="time"]').value = '';
        document.querySelector('input[name="dia"]').value = '';
        document.querySelector('.tarefa input').value = '';
    }

    function salvarListaLocal() {
        const linhas = [];

        for (let row of tbody.rows) {
            const horario = row.cells[0].textContent;
            const tarefas = [];

            for (let i = 1; i < row.cells.length; i++) {
                const textarea = row.cells[i].querySelector('textarea');
                tarefas.push(textarea ? textarea.value : '');
            }

            linhas.push({ horario, tarefas });
        }

        localStorage.setItem('listaTarefas', JSON.stringify(linhas));
        alert('Lista salva com sucesso!');
    }

    function carregarListaLocal() {
        const dados = localStorage.getItem('listaTarefas');
        if (!dados) return;

        const linhas = JSON.parse(dados);
        tbody.innerHTML = '';

        for (const linha of linhas) {
            const row = tbody.insertRow();
            const timeCell = row.insertCell();
            timeCell.textContent = linha.horario;

            for (let tarefa of linha.tarefas) {
                const cell = row.insertCell();
                const textarea = document.createElement('textarea');
                textarea.rows = 1;
                textarea.value = tarefa;
                cell.appendChild(textarea);
            }
        }
    }

    function apagarLista() {
        const confirmado = confirm("Deseja realmente apagar todas as tarefas?");
        if (confirmado) {
            localStorage.removeItem('listaTarefas');
            location.reload();
        }
    }


    if (botaoCriar) botaoCriar.addEventListener('click', adicionarTarefa);
    if (botaoSalvar) botaoSalvar.addEventListener('click', salvarListaLocal);
    if (botaoApagar) botaoApagar.addEventListener('click', apagarLista);

    carregarListaLocal();
});
//carregamento