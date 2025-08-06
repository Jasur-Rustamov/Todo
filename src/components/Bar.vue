<template>
    <div class="w-full h-12 bg-gray-800 text-white flex items-center justify-between px-4">
        <div class="flex gap-4 items-center">
            <span @click="goTo('/todolist')" :class="[
                'cursor-pointer',
                isActive('/todolist') ? 'text-amber-400 font-bold' : 'text-white'
            ]">
                Tasks
            </span>

            <span v-if="isAdmin" @click="goTo('/bots')" :class="[
                'cursor-pointer',
                isActive('/bots') ? 'text-amber-400 font-bold' : 'text-white'
            ]">
                Bots
            </span>
            <span  @click="goTo('/map')" :class="[
                'cursor-pointer',
                isActive('/map') ? 'text-amber-400 font-bold' : 'text-white'
            ]">
                Map
            </span>
        </div>

        <button @click="logout" class="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-2xl transition">
            Выйти
        </button>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const isAdmin = ref(false)

onMounted(() => {
    isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})

const goTo = (path) => {
    if (route.path !== path) {
        router.push(path)
    }
}

const isActive = (path) => route.path === path

const logout = () => {
    localStorage.clear()
    router.push('/login')
}
</script>
