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
import routes from "../../routes/routes.js";


export default function Header() {
    const {logOut, user} = useAuth();
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

            <NavbarContent className="hidden sm:flex gap-4" justify="start">


                <NavbarItem isActive>
                    <Link color="foreground" href="/" aria-current="page">

                        Главная
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" color="foreground" isDisabled>
                        О нас
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#" isDisabled>
                        Обратная связь
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand className="flex gap-2">
                    <Logo/>
                    <p className="font-bold text-inherit">Нулевой километр</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end">
                {user ? <NavbarMenuItem>
                        <Button


                            color="danger"
                            onPress={() => {
                                logOut();

                            }}
                            variant="flat"
                            className="hidden md:flex"


                        >
                            Выйти
                        </Button></NavbarMenuItem> :
                    <NavbarItem>

                        <Button as={Link} className="hidden md:flex" color="warning" href={routes.profile.url}
                                variant="flat">
                            Войти
                        </Button>
                    </NavbarItem>}

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
                {user ? (<NavbarMenuItem>
                    <Link
                        className="w-full"
                        color="danger"
                        onPress={() => {
                            logOut();
                            setIsMenuOpen(false);
                        }}
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
