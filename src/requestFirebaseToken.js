import { getToken } from 'firebase/messaging'
import { messaging } from './firebase'

export const requestFirebaseToken = async () => {
    try {
        const token = await getToken(messaging, {
            vapidKey: 'BBVi9D048Z1Y59L7G-GEoYpGw7iZhDLE2Jk4C0__nB7QnbNROteT6HCYo0XORwkxM_c8HpWq2cqQWkSKHRxK9a4'
        })

        if (token) {
            localStorage.setItem('firebase_token', token)
            console.log('FCM token:', token)
        } else {
            console.warn('FCM token не получен — возможно, пользователь отклонил разрешения.')
        }
    } catch (error) {
        console.error('Ошибка при получении FCM token:', error)
    }
}
