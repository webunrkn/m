// --- ЧАСТЬ 1: Скрипт для компактной мобильной навигации (.nav) ---

(function setupCompactMobileNav() {
    try {
        if (!window.matchMedia) return;
        var mq = window.matchMedia('(max-width:700px)');

        function applyForNav(nav) {
            var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
            if (links.length < 2) return;
            
            // Mark first two anchors so CSS will show them
            links[0].classList.add('main-nav-main');
            links[1].classList.add('main-nav-info');

            var baseId = nav.id || ('nav-' + Math.random().toString(36).slice(2, 8));
            var moreBtnId = baseId + '-moreBtn';
            var popupId = baseId + '-morePopup';

            // If already created for this nav, skip
            if (document.getElementById(moreBtnId) || document.getElementById(popupId)) return;

            // Create more button
            var moreBtn = document.createElement('button');
            moreBtn.id = moreBtnId;
            moreBtn.className = 'nav-more-btn';
            moreBtn.type = 'button';
            moreBtn.setAttribute('aria-expanded', 'false');
            
            // create three small bars inside the button
            for (var b = 0; b < 3; b++) {
                var bar = document.createElement('span');
                bar.className = 'more-bar';
                moreBtn.appendChild(bar);
            }

            // Create popup container
            var popup = document.createElement('div');
            popup.id = popupId;
            popup.className = 'nav-more-popup';

            // Fill popup with remaining links (clone)
            for (var i = 2; i < links.length; i++) {
                var a = links[i].cloneNode(true);
                a.addEventListener('click', function () {
                    popup.classList.remove('show');
                    moreBtn.setAttribute('aria-expanded', 'false');
                });
                popup.appendChild(a);
            }

            // Insert moreBtn and popup after the second link
            var ref = links[1];
            ref.parentNode.insertBefore(moreBtn, ref.nextSibling);
            ref.parentNode.insertBefore(popup, moreBtn.nextSibling);

            moreBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                popup.classList.toggle('show');
                var expanded = popup.classList.contains('show');
                moreBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });

            // Close popup on outside click
            document.addEventListener('click', function (ev) {
                if (!popup.contains(ev.target) && ev.target !== moreBtn) {
                    popup.classList.remove('show');
                    moreBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        function init() {
            var navs = document.querySelectorAll('.nav');
            navs.forEach(function (nav) { applyForNav(nav); });
        }

        // Init only on mobile; also when crossing breakpoint
        function checkAndInit() {
            if (mq.matches) init();
        }
        
        checkAndInit();
        mq.addEventListener ? mq.addEventListener('change', checkAndInit) : window.addEventListener('resize', checkAndInit);

    } catch (e) {
        console.error('Compact mobile nav init error', e);
    }
})();

// --- ЧАСТЬ 2: Скрипт для других меню, загрузчика страницы и анимаций ---

document.addEventListener('DOMContentLoaded', function () {
    
    // --- Логика для переключателей меню (navToggle) ---
    function wire(toggleId, navId) {
        var btn = document.getElementById(toggleId);
        var nav = document.getElementById(navId);
        if (!btn || !nav) return;
        btn.addEventListener('click', function () {
            nav.classList.toggle('show');
        });
    }
    wire('navToggle', 'mainNav');
    wire('navToggle2', 'mainNav2');
    wire('navToggle3', 'mainNav3');
    wire('navToggle4', 'mainNav4');

    // --- Логика для загрузчика страницы (pageLoader) ---
    var loader = document.getElementById('pageLoader');
    if (loader) {
        var hideLoader = function () {
            if (loader.classList.contains('loader-hidden')) return; // Не прятать дважды
            
            loader.classList.add('loader-hidden');
            setTimeout(function () {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 450); // Даем время на анимацию скрытия
        };

        // Скрываем после загрузки окна
        window.addEventListener('load', function () {
            hideLoader();
        });

        // Аварийный таймер: скрыть в любом случае через 6 секунд
        setTimeout(function () {
            hideLoader();
        }, 6000);
    }

    // --- Логика для анимации элементов (animate fade-up) ---
    var animated = document.querySelectorAll('.animate.fade-up');
    animated.forEach(function (el, idx) {
        var delay = 120 + idx * 80;
        el.style.animationDelay = delay + 'ms';
        // Force reflow then add class to start animation
        requestAnimationFrame(function () {
            el.style.opacity = ''; // Сброс, если JS его скрыл
        });
    });
});
