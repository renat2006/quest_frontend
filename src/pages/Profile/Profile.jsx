
import React from 'react';
import { useAuthContext } from "../../providers/AuthProvider.jsx";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Link, User, Image } from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faGear, faQuestionCircle, faChartPie, faScaleBalanced, faShield } from "@fortawesome/free-solid-svg-icons";
import TelegramAuthButton from "../../componets/TelegramAuthButton/TelegramAuthButton.jsx";


const Profile = () => {
    const { user, logOut } = useAuthContext(); // Обратите внимание на правильное название функции logOut
    const settingsButtons = [
        { name: "Настройки", link: "/settings", icon: <FontAwesomeIcon icon={faGear}/> },
        { name: "Справка и обратная связь", link: "/contact", icon: <FontAwesomeIcon icon={faQuestionCircle}/> },
        { name: "Статистика", link: "/stats", icon: <FontAwesomeIcon icon={faChartPie}/> },
        { name: "Политика конфиденциальности", link: "/conf_politics", icon: <FontAwesomeIcon icon={faScaleBalanced}/> },
        { name: "Условия использования", link: "/terms_of_use", icon: <FontAwesomeIcon icon={faShield}/> },
    ];

    return (
        <div className="profile--container">
            {user ? (
                <Card className="w-full max-w-[800px] lg:h-[600px] col-span-12 sm:col-span-7">
                    <CardHeader className="justify-between">
                        <User
                            name={(user?.first_name ? user.first_name + (user?.last_name ? " " + user.last_name : "") : `Пользователь ${user.id}`)}
                            description={(
                                <Link href={`https://t.me/${user.username}`} size="sm" isExternal>
                                    @{user.username}
                                </Link>
                            )}
                            avatarProps={{
                                src: user?.photo_url ? user.photo_url : "",
                                color: "danger",
                                isBordered: false
                            }}
                        />
                        {user.is_admin ? (
                            <Chip startContent={<FontAwesomeIcon style={{width: "18px", height: "18px"}} icon={faCircleCheck}/>} variant="faded" color="success">
                                Админ
                            </Chip>
                        ) : null}
                    </CardHeader>
                    <CardBody className="px-4">
                        <div className="profile-input__container flex flex-col gap-3">
                            {settingsButtons.map(button => (
                                <Button key={button.link} color="primary" as={Link} href={button.link} startContent={button.icon} variant="faded">
                                    {button.name}
                                </Button>
                            ))}
                            <Button color="danger" onPress={logOut} variant="flat">Выйти из аккаунта</Button>
                        </div>
                    </CardBody>
                    <CardFooter className="gap-3"/>
                </Card>
            ) : (
                <Card className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-[0.6rem] text-black/70 uppercase font-bold">Будь ближе к сотням увлекательных квестов!</p>
                        <h4 className="text-black font-medium text-2xl">Войди через Telegram</h4>
                    </CardHeader>
                    <Image removeWrapper alt="Card background" className="z-0 w-full h-full scale-125 -translate-y-6 object-cover" src="https://yurmino.ru/wp-content/uploads/2021/09/scale_1200-4.jpg"/>
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-end">
                        <TelegramAuthButton/>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Profile;
