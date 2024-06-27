import React from "react";
const columns = [
    {name: "НАЗВАНИЕ", uid: "name"},
    {name: "ДАТА СОЗДАНИЯ", uid: "date"},
    {name: "СТАТУС", uid: "status"},
    {name: "ДЕЙСТВИЯ", uid: "actions"},
];

const users = [
    {
        id: 1,
        name: "Tony Reichert",
        date: "2024-06-27T11:45:05.472Z",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
    },
    {
        id: 2,
        name: "Zoey Lang",
        date: "2024-06-27T11:45:05.472Z",
        team: "Development",
        status: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
    },
    {
        id: 3,
        name: "Jane Fisher",
        date: "2024-06-27T11:45:05.472Z",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
    },


];

export {columns, users};
