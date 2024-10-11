// URL da API
const apiURL = 'http://localhost:3000/tasks';

// Função para carregar todas as tarefas
function loadTasks() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Limpa a lista antes de carregar as tarefas
            data.forEach(task => {
                const li = document.createElement('li');
                li.classList.add(task.status === 'completed' ? 'complete' : '');
                li.innerHTML = `
                    ${task.title}
                    <button class="remove" data-id="${task.id}">Remover</button>
                `;
                taskList.appendChild(li);

                // Evento de remoção
                li.querySelector('.remove').addEventListener('click', (e) => {
                    const taskId = e.target.getAttribute('data-id');
                    removeTask(taskId);
                });

                // Evento de clique para marcar tarefa como concluída
                li.addEventListener('click', () => {
                    toggleTaskStatus(task.id, task.status);
                });
            });
        })
        .catch(error => console.error('Erro ao carregar tarefas:', error));
}

// Função para adicionar uma nova tarefa
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput').value;

    fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskInput })
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('taskInput').value = ''; // Limpa o campo de input
            loadTasks(); // Recarrega a lista de tarefas
        })
        .catch(error => console.error('Erro ao adicionar tarefa:', error));
});

// Função para remover uma tarefa
function removeTask(taskId) {
    fetch(`${apiURL}/${taskId}`, {
        method: 'DELETE'
    })
        .then(() => loadTasks())
        .catch(error => console.error('Erro ao remover tarefa:', error));
}

// Função para alternar o status de uma tarefa
function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    fetch(`${apiURL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
        .then(() => loadTasks())
        .catch(error => console.error('Erro ao atualizar status da tarefa:', error));
}

// Carrega as tarefas quando a página é carregada
document.addEventListener('DOMContentLoaded', loadTasks);
