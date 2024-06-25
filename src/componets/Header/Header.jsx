import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
    Link,
    Button
} from "@nextui-org/react";

import {Logo} from "../Logo/Logo.jsx";
import {useAuth} from "../../providers/AuthProvider.jsx";


export default function Header() {
    const {token} = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        "Профиль",
        "О нас",
        "Обратная связь",

    ];

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="md:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}/>
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Logo/>
                    <p className="font-bold text-inherit">Нулевой километр</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <Logo/>

                </NavbarBrand>
                <p className="font-bold text-inherit">Нулевой километр</p>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Главная
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        О нас
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Обратная связь
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden md:flex">
                    <Link href="#">Войти</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} className="hidden md:flex" color="warning" href="#" variant="flat">
                        Регистрация
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color="foreground"

                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>

                ))}
                {token ? (<NavbarMenuItem>
                    <Link
                        className="w-full"
                        color="danger"
                        onPress={() => auth.logOut()}
                        href="#"
                        size="lg"

                    >
                        Выйти
                    </Link>
                </NavbarMenuItem>) : (<></>)}

            </NavbarMenu>
        </Navbar>
    );
}
