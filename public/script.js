// ==================== CONFIGURAÇÃO E ESTADO ==================== 

const API_BASE_URL = 'http://localhost:3000';
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// ==================== ELEMENTOS DO DOM ==================== 

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const tasksList = document.getElementById('tasksList');
const filterButtons = document.querySelectorAll('.filter-btn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const editTaskStatus = document.getElementById('editTaskStatus');
const editTaskPriority = document.getElementById('editTaskPriority');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const closeModalBtn = document.querySelector('.close-btn');
const notification = document.getElementById('notification');

// ==================== INICIALIZAÇÃO ==================== 

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    await loadTasks();
    setupEventListeners();
}

// ==================== EVENT LISTENERS ==================== 

function setupEventListeners() {
    // Formulário de adicionar tarefa
    taskForm.addEventListener('submit', handleAddTask);

    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });

    // Modal
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Formulário de edição
    editForm.addEventListener('submit', handleEditTask);
}

// ==================== CARREGAMENTO DE TAREFAS ==================== 

async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }

        tasks = await response.json();
        renderTasks();
        updateFilterCounts();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        showNotification('Erro ao carregar tarefas', 'error');
    }
}

// ==================== ADICIONAR TAREFA ==================== 

async function handleAddTask(e) {
    e.preventDefault();

    const newTask = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priority: taskPriority.value
    };

    if (!newTask.title) {
        showNotification('Por favor, preencha o título da tarefa', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar tarefa');
        }

        const createdTask = await response.json();
        tasks.push(createdTask);

        // Limpar formulário
        taskForm.reset();
        taskPriority.value = 'Média';

        renderTasks();
        updateFilterCounts();
        showNotification('✅ Tarefa criada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        showNotification('Erro ao criar tarefa', 'error');
    }
}

// ==================== EDITAR TAREFA ==================== 

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description;
    editTaskStatus.value = task.status;
    editTaskPriority.value = task.priority;

    editModal.classList.add('active');
}

function closeEditModal() {
    editModal.classList.remove('active');
    editingTaskId = null;
    editForm.reset();
}

async function handleEditTask(e) {
    e.preventDefault();

    if (!editingTaskId) return;

    const updates = {
        title: editTaskTitle.value.trim(),
        description: editTaskDescription.value.trim(),
        status: editTaskStatus.value,
        priority: editTaskPriority.value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${editingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar tarefa');
        }

        const updatedTask = await response.json();
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }

        closeEditModal();
        renderTasks();
        updateFilterCounts();
        showNotification('✅ Tarefa atualizada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        showNotification('Erro ao atualizar tarefa', 'error');
    }
}

// ==================== DELETAR TAREFA ==================== 

async function deleteTask(taskId) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar tarefa');
        }

        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateFilterCounts();
        showNotification('✅ Tarefa deletada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        showNotification('Erro ao deletar tarefa', 'error');
    }
}

// ==================== RENDERIZAÇÃO ==================== 

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <p>📝 Nenhuma tarefa encontrada.</p>
                <p>${currentFilter === 'all' ? 'Crie sua primeira tarefa acima!' : 'Nenhuma tarefa com este status.'}</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');

    // Adicionar event listeners aos botões das tarefas
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            openEditModal(parseInt(e.currentTarget.dataset.taskId));
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteTask(parseInt(e.currentTarget.dataset.taskId));
        });
    });

    // Atualizar contador de tarefas
    const taskCount = document.querySelector('.task-count');
    taskCount.textContent = `Total: ${filteredTasks.length}`;
}

function getFilteredTasks() {
    if (currentFilter === 'all') {
        return tasks;
    }
    return tasks.filter(task => task.status === currentFilter);
}

function createTaskCard(task) {
    const statusClass = task.status === 'Concluída' ? 'completed' : 
                        task.status === 'Em Progresso' ? 'in-progress' : '';
    
    const priorityClass = task.priority === 'Alta' ? '' : 
                         task.priority === 'Média' ? 'medium' : 'low';

    const formattedDate = formatDate(task.createdAt);

    return `
        <div class="task-card ${statusClass}">
            <div class="task-content">
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <span class="task-badge badge-status ${statusClass}">
                        ${task.status}
                    </span>
                    <span class="task-badge badge-priority ${priorityClass}">
                        🎯 ${task.priority}
                    </span>
                </div>
                
                ${task.description ? `
                    <p class="task-description">${escapeHtml(task.description)}</p>
                ` : ''}

                <div class="task-meta">
                    <span>📅 ${formattedDate}</span>
                    <span>ID: #${task.id}</span>
                </div>
            </div>

            <div class="task-actions">
                <button class="btn btn-primary btn-small btn-edit" data-task-id="${task.id}">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small btn-delete" data-task-id="${task.id}">
                    🗑️ Deletar
                </button>
            </div>
        </div>
    `;
}

// ==================== UTILITÁRIOS ==================== 

function updateFilterCounts() {
    const counts = {
        all: tasks.length,
        'A Fazer': tasks.filter(t => t.status === 'A Fazer').length,
        'Em Progresso': tasks.filter(t => t.status === 'Em Progresso').length,
        'Concluída': tasks.filter(t => t.status === 'Concluída').length
    };

    filterButtons.forEach(btn => {
        const filter = btn.dataset.filter;
        const count = counts[filter] || 0;
        btn.textContent = `${btn.textContent.split(' (')[0]} (${count})`;
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Agora mesmo';
    } else if (diffMins < 60) {
        return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    } else if (diffHours < 24) {
        return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else if (diffDays < 7) {
        return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== TRATAMENTO DE ERROS DE CONEXÃO ==================== 

window.addEventListener('offline', () => {
    showNotification('⚠️ Conexão perdida. Verifique sua internet.', 'warning');
});

window.addEventListener('online', () => {
    showNotification('✅ Conexão restaurada!', 'success');
    loadTasks();
});
