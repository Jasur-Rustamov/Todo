<template>
    <form @submit.prevent="handleSubmit"
        class="w-[500px] h-[500px] m-auto mt-[150px] flex flex-col gap-10 justify-center align-middle">

        <div class="w-[500px]">
            <input v-model.trim="form.username" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="text" placeholder="Имя пользователя" />
            <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.password" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="password" placeholder="Пароль" />
            <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>

        <button type="submit"
            class="cursor-pointer bg-gray-800 py-3 text-gray-100 rounded-3xl hover:bg-gray-900 hover:text-white outline-0 text-center">
            Войти
        </button>
        <span @click="onClick" class="text-sm cursor-pointer">Регистрация →</span>
    </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase'
import { toast } from 'vue3-toastify'
const router = useRouter()

const form = reactive({
    username: '',
    password: ''
})

const errors = reactive({
    username: '',
    password: ''
})

const validate = () => {
    errors.username = form.username.trim() === '' ? 'Введите имя пользователя' : ''
    errors.password = form.password.trim() === '' ? 'Введите пароль' : ''
    return !errors.username && !errors.password
}

const handleSubmit = async () => {
    if (!validate()) return

    try {
        const formData = new URLSearchParams()
        formData.append('username', form.username)
        formData.append('password', form.password)

        const response = await api.post('/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const token = response.data.access_token

        localStorage.setItem('token', token)
        localStorage.setItem('username', form.username)
        localStorage.setItem('isAdmin', form.username.toLowerCase() === 'admin')

        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            const fcmToken = await getToken(messaging, {
                vapidKey: 'BBVi9D048Z1Y59L7G-GEoYpGw7iZhDLE2Jk4C0__nB7QnbNROteT6HCYo0XORwkxM_c8HpWq2cqQWkSKHRxK9a4'
            })

            if (fcmToken) {
                localStorage.setItem('firebase_token', fcmToken)

                await api.put('/firebase_token', {
                    firebase_token: fcmToken
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setTimeout(() => {
                    toast.success('Вы успешно вошли!', {
                        autoClose: 2000
                    })
                }, 2000)

                console.log('Firebase токен отправлен:', fcmToken)
            } else {
                console.warn('FCM токен не получен')
            }
        } else {
            console.warn('Уведомления запрещены пользователем')
        }

        toast.success('Успешный вход!')
        router.push('/todolist')

    } catch (error) {
        console.error(error)
        const detail = error.response?.data?.detail

        if (Array.isArray(detail)) {
            detail.forEach((err) => {
                if (err.loc?.includes('username')) {
                    errors.username = err.msg
                }
                if (err.loc?.includes('password')) {
                    errors.password = err.msg
                }
            })
        } else if (typeof detail === 'string') {
            errors.username = detail
        } else {
            errors.username = 'Не удалось войти. Проверьте данные.'
        }

        setTimeout(() => {
            toast.error('Ошибка входа. Проверьте данные.', {
                autoClose: 1500
            })
        })
    }
}

const onClick = () => {
    router.push('/')
}
</script>
