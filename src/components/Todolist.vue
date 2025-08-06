<template>
    <Bar />
    <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
        <div class="w-full max-w-lg bg-gray-800 shadow-xl rounded-3xl p-8 text-gray-100">
            <h1 class="text-3xl font-bold text-center mb-8 text-white">📝 Мои Задачи</h1>

            <div class="space-y-4 mb-6">
                <input v-model="taskTitle"
                    class="w-full p-4 rounded-2xl bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Название задачи" />
                <textarea v-model="taskText" rows="3"
                    class="w-full p-4 rounded-2xl bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    placeholder="Описание задачи (необязательно)"></textarea>
                <button @click="isEditing ? updateTask() : addTask()"
                    class="w-full cursor-pointer py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium shadow">
                    {{ isEditing ? '💾 Обновить' : '➕ Добавить' }}
                </button>
            </div>
            <input type="file" @change="handleExcelImport" accept=".xlsx, .xls"
                class="mb-6 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" />
            <div v-if="tasks.length" class="space-y-4">
                <div v-for="task in tasks" :key="task.id"
                    class="bg-gray-700 border border-gray-600 rounded-2xl p-4 shadow hover:shadow-lg transition flex justify-between items-start group">
                    <div>
                        <h2 class="text-lg font-semibold text-white group-hover:text-indigo-400 transition">
                            {{ task.title }}
                        </h2>
                        <p class="text-sm text-gray-300 mt-1">{{ task.text }}</p>
                    </div>
                    <button @click="editTask(task)"
                        class="text-indigo-400 cursor-pointer hover:text-indigo-300 text-sm font-medium transition">
                        ✏️
                    </button>
                </div>
            </div>
            <p v-else class="text-center text-gray-500 mt-10">Нет задач. Добавьте новую 🧠</p>
        </div>
    </div>
</template>

<script setup>
import Bar from '../components/Bar.vue'
import { ref, onMounted } from 'vue'
import api from '../axios'
import Swal from 'sweetalert2'

const taskTitle = ref('')
const taskText = ref('')
const tasks = ref([])
const isEditing = ref(false)
const editingId = ref(null)

const fetchTasks = async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await api.get('/tasks?page=0&limit=0', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        tasks.value = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } catch (err) {
        console.error('Ошибка при загрузке задач:', err)
    }
}

const addTask = async () => {
    if (!taskTitle.value.trim()) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
        const payload = {
            title: taskTitle.value.trim(),
            text: taskText.value.trim() || 'no description',
            status: false,
        }

        await api.post('/tasks', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        taskTitle.value = ''
        taskText.value = ''
        isEditing.value = false
        editingId.value = null
        fetchTasks()
    } catch (err) {
        Swal.fire({
            title: err.response?.data?.detail,
            icon: 'error',
        })
        console.error('Ошибка при добавлении задачи:', err)
    }
}

const editTask = (task) => {
    taskTitle.value = task.title
    taskText.value = task.text
    editingId.value = task.id
    isEditing.value = true
}

const updateTask = async () => {
    const title = taskTitle.value.trim()
    const text = taskText.value.trim() || 'no description'
    const token = localStorage.getItem('token')

    if (!title) {
        Swal.fire({
            title: 'Заголовок задачи не может быть пустым',
            icon: 'error',
        })
        return
    }

    if (!token) return

    try {
        const payload = {
            title,
            text,
            status: false,
        }

        await api.put(`/tasks/${editingId.value}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        taskTitle.value = ''
        taskText.value = ''
        isEditing.value = false
        editingId.value = null
        fetchTasks()
    } catch (err) {
        console.error('Ошибка при обновлении задачи:', err)
        Swal.fire({
            title: 'Ошибка при обновлении',
            text: err.response?.data?.detail || 'Что-то пошло не так',
            icon: 'error',
        })
    }
}


const handleExcelImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const token = localStorage.getItem('token')
    if (!token) return

    const formData = new FormData()
    formData.append('file', file)

    try {
        await api.post('/tasks/upload_file', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })

        await fetchTasks()

        Swal.fire({
            title: '✅ Файл успешно загружен!',
            text: 'Задачи будут добавлены в фоновом режиме.',
            icon: 'success',
        })
    } catch (err) {
        console.error('Ошибка при импорте Excel:', err)
        Swal.fire({
            title: 'Ошибка при загрузке файла',
            text: err.response?.data?.detail || 'Что-то пошло не так',
            icon: 'error',
        })
    }
}


onMounted(() => {
    fetchTasks()
})
</script>
