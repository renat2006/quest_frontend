const routes = {
    home: {url: '/', name: "Главная"},
    about: {url: '/about', name: "О нас"},
    profile: {url: '/profile', name: "Профиль"},
    admin: {
        root: {url: '/admin', name: "Админ"},
        routeAdmin: {url: '/admin/route', name: "Маршрут"},
        routeAdminInfo: {url: '/admin/route/info', name: "Информация"},
        routeAdminMedia: {url: '/admin/route/media', name: "Медиа"}
    },
    map: {url: '/map', name: "Карта"},

};

export default routes;
