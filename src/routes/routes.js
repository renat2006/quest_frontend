const routes = {
    home: { url: '/', name: "Главная" },
    about: { url: '/about', name: "О нас" },
    profile: { url: '/profile', name: "Профиль" },
    admin: {
        root: { url: '/admin', name: "Админ" },
        routeAdmin: { url: '/admin/route', name: "Маршрут" },
        routeAdminInfo: { url: '/admin/route/info', name: "Инфо" },
        routeAdminMedia: { url: '/admin/route/media', name: "Медиа" },
        routeAdminMap: { url: '/admin/route/map', name: "Карта" },
        locationAdmin: { url: '/admin/location', name: "Точка" },
        locationAdminInfo: { url: '/admin/location/info', name: "Инфо Точки" },
        locationAdminMedia: { url: '/admin/location/media', name: "Медиа Точки" },

    },
    map: { url: '/map', name: "Карта" }
};

export default routes;
