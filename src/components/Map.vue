<template>
    <Bar />
    <div id="map" class="w-full h-[100vh] rounded-xl shadow"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Bar from '../components/Bar.vue'

onMounted(() => {
    const waitForYmaps = setInterval(() => {
        if (window.ymaps) {
            clearInterval(waitForYmaps)

            window.ymaps.ready(() => {
                let map, userCoords, userPlacemark, destPlacemark, currentRoute

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userCoords = [position.coords.latitude, position.coords.longitude]

                        map = new window.ymaps.Map('map', {
                            center: userCoords,
                            zoom: 12,
                            controls: ['zoomControl', 'fullscreenControl']
                        })

                        userPlacemark = new window.ymaps.Placemark(
                            userCoords,
                            { balloonContent: 'Вы здесь' },
                            { preset: 'islands#redDotIcon' }
                        )
                        map.geoObjects.add(userPlacemark)

                        map.events.add('click', function (e) {
                            const destinationCoords = e.get('coords')

                            if (destPlacemark) map.geoObjects.remove(destPlacemark)
                            if (currentRoute) map.geoObjects.remove(currentRoute)

                            destPlacemark = new window.ymaps.Placemark(
                                destinationCoords,
                                { balloonContent: 'Назначение' },
                                { preset: 'islands#greenDotIcon' }
                            )
                            map.geoObjects.add(destPlacemark)

                            window.ymaps.route([userCoords, destinationCoords]).then((route) => {
                                currentRoute = route
                                map.geoObjects.add(route)
                            })
                        })
                    },
                    (error) => {
                        alert('Не удалось определить ваше местоположение: ' + error.message)
                    }
                )
            })
        }
    }, 300)
})
</script>

<style></style>
