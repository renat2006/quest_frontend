const routes = {
    home: {url: '/', name: "Главная"},
    about: {url: '/about', name: "О нас"},
    profile: {url: '/profile', name: "Профиль"},
    admin: {
        root: {url: '/admin', name: "Админ"},
        routeAdmin: {url: '/admin/route/:questId', name: "Маршрут"},
        routeAdminInfo: {url: '/admin/route/:questId/info', name: "Инфо"},
        routeAdminMedia: {url: '/admin/route/:questId/media', name: "Медиа"},
        routeAdminMap: {url: '/admin/route/:questId/map', name: "Карта"}
    },
    map: {url: '/map', name: "Карта"},

};

export default routes;
