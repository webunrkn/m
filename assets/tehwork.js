 document.addEventListener('DOMContentLoaded', function() {
            const banner = document.getElementById('maintenanceBanner');
            const closeBtn = document.getElementById('closeMaintenanceBanner');

            if (banner && closeBtn) {
                closeBtn.addEventListener('click', function() {
                    // Добавляем класс для анимации исчезновения
                    banner.classList.add('closing');

                    // Удаляем элемент из DOM после завершения анимации
                    banner.addEventListener('animationend', function(e) {
                        if (e.animationName === 'maintenanceFadeOut') {
                            banner.remove();
                        }
                    });
                });
            }
        });
