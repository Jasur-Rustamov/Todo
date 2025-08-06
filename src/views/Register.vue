<template>
    <form @submit.prevent="handleSubmit"
        class="w-[500px] h-[600px] m-auto mt-[100px] flex flex-col gap-10 justify-center align-middle">

        <div class="w-[500px]">
            <h1 class="text-4xl text-center pb-5 text-gray-700">Регистрация</h1>
            <input v-model="form.username" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="text" placeholder="Имя пользователя" />
            <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.name" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0" type="text"
                placeholder="Ваше имя" />
            <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.email" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="email" placeholder="Электронная почта" />
            <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.phone" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="text" placeholder="Номер телефона" />
            <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.password" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="password" placeholder="Пароль" />
            <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>

        <div class="w-[500px]">
            <input v-model="form.confirmPassword" class="w-full bg-gray-500 py-3 rounded-3xl pl-4 text-white outline-0"
                type="password" placeholder="Повторите пароль" />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit"
            class="cursor-pointer bg-gray-800 py-3 text-gray-100 rounded-3xl hover:bg-gray-900 hover:text-white outline-0 text-center">
            Зарегистрироваться
        </button>
        <span @click="onClick" class="text-sm cursor-pointer">Войти →</span>
    </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()

const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
})

const errors = reactive({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
})

const validate = () => {
    errors.username = form.username.trim() === '' ? 'Введите имя пользователя' : ''
    errors.email = !form.email.includes('@') ? 'Введите корректный email' : ''
    errors.phone = form.phone.trim() === '' ? 'Введите номер телефона' : ''
    errors.name = form.name.trim() === '' ? 'Введите ваше имя' : ''
    errors.password = form.password.trim() === '' ? 'Введите пароль' : ''
    errors.confirmPassword =
        form.confirmPassword.trim() === ''
            ? 'Повторите пароль'
            : form.confirmPassword !== form.password
                ? 'Пароли не совпадают'
                : ''

    return !errors.username && !errors.email && !errors.password && !errors.confirmPassword
}

const handleSubmit = async () => {
    if (!validate()) return
    try {
        await api.post('/users', {
            username: form.username,
            email: form.email,
            password: form.password,
            phone: form.phone,
            name: form.name,
        })

        console.log('Пользователь успешно зарегистрирован!')
        router.push('/login')
    } catch (err) {
        console.error('Ошибка при регистрации:', err.message)
        if (err.code === 'auth/email-already-in-use') {
            errors.email = 'Этот email уже используется'
        } else {
            errors.email = 'Ошибка: ' + err.message
        }
    }
}

const onClick = () => {
    router.push('/login')
}
</script>
