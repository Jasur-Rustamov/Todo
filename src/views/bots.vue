<template>
    <Bar />
    <div class="min-h-screen bg-gray-900 text-white py-12 px-6">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold text-center mb-10 text-white">🤖 Bot Manager</h1>

            <form @submit.prevent="handleCreate"
                class="bg-gray-800 rounded-2xl p-6 shadow-lg space-y-5 border border-gray-700">
                <div>
                    <label class="block mb-2 text-sm text-gray-300">Bot Token</label>
                    <input v-model="newBot.token" type="text" placeholder="Enter bot token"
                        class="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block mb-2 text-sm text-gray-300">Channel ID</label>
                    <input v-model="newBot.channel_id" type="text" placeholder="Enter channel ID"
                        class="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl">
                    {{ isEditing ? ' Update Bot' : ' Create Bot' }}
                </button>
            </form>

            <div class="mt-10 grid gap-6">
                <div v-for="bot in bots" :key="bot.id"
                    class="bg-gray-800 p-5 rounded-2xl shadow border border-gray-700">
                    <p class="text-lg"><span class="font-semibold text-blue-400">ID:</span> {{ bot.id }}</p>
                    <p><span class="font-semibold text-blue-400">Token:</span> {{ bot.token }}</p>
                    <p><span class="font-semibold text-blue-400">Channel ID:</span> {{ bot.channel_id }}</p>

                    <div class="mt-4 flex gap-3">
                        <button @click="startEdit(bot)"
                            class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl transition">
                            ✏️ Edit
                        </button>
                    </div>
                </div>
            </div>

            <p v-if="!bots.length" class="text-gray-500 text-center mt-10">Пока нет ни одного бота 🤷‍♂️</p>
        </div>
    </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import Bar from '../components/Bar.vue'

const bots = ref([])
const newBot = ref({
    token: '',
    channel_id: ''
})
const isEditing = ref(false)
const editId = ref(null)

const saveToLocalStorage = () => {
    localStorage.setItem('bots', JSON.stringify(bots.value))
}

const loadFromLocalStorage = () => {
    const data = localStorage.getItem('bots')
    if (data) {
        bots.value = JSON.parse(data)
    }
}

const fetchBots = async () => {
    try {
        const response = await api.get('/bots')
        bots.value = response.data
        saveToLocalStorage()
    } catch (error) {
        console.warn('Ошибка при загрузке с API, загружаем из localStorage')
        loadFromLocalStorage()
    }
}

onMounted(fetchBots)

const handleCreate = async () => {
    if (!newBot.value.token || !newBot.value.channel_id) {
        alert('Все поля обязательны')
        return
    }

    if (isEditing.value) {
        try {
            await api.put(`/bots`, {
                token: newBot.value.token,
                channel_id: newBot.value.channel_id
            })

            const index = bots.value.findIndex(bot => bot.id === editId.value)
            if (index !== -1) {
                bots.value[index].token = newBot.value.token
                bots.value[index].channel_id = newBot.value.channel_id
            }

            isEditing.value = false
            editId.value = null
            newBot.value.token = ''
            newBot.value.channel_id = ''
            saveToLocalStorage()
        } catch (error) {
            console.error('Ошибка при редактировании бота:', error)
            alert('Не удалось обновить бота')
        }
    } else {
        try {
            const response = await api.post('/bots', {
                token: newBot.value.token,
                channel_id: newBot.value.channel_id
            })

            bots.value.push(response.data) 
            newBot.value.token = ''
            newBot.value.channel_id = ''
            saveToLocalStorage()
        } catch (error) {
            console.error('Ошибка при создании бота:', error)
            alert('Ошибка при создании бота')
        }
    }
}

const startEdit = (bot) => {
    newBot.value.token = bot.token
    newBot.value.channel_id = bot.channel_id
    editId.value = bot.id
    isEditing.value = true
}
</script>
