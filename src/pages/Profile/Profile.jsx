import { useContext } from 'react';
import TelegramAuthButton from "../../componets/TelegramAuthButton/TelegramAuthButton.jsx";
import { Card, CardFooter, CardHeader, Image } from "@nextui-org/react";

import {useAuth} from "../../providers/AuthProvider.jsx";

const Profile = () => {
    const user = useAuth();

    return (
        <div className="profile--container">
            {user ? (
                <Card className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-[0.6rem] text-black/70 uppercase font-bold">Ваш профиль</p>
                        <h4 className="text-black font-medium text-2xl">{user.first_name} {user.last_name}</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Cardbackground"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src={user.photo_url}
                    />
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-end">
                        {/* Дополнительная информация о пользователе */}
                    </CardFooter>
                </Card>
            ) : (
                <Card className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-[0.6rem] text-black/70 uppercase font-bold">Будь ближе к сотням увлекательных квестов!</p>
                        <h4 className="text-black font-medium text-2xl">Войди через Telegram</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Cardbackground"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src="https://yurmino.ru/wp-content/uploads/2021/09/scale_1200-4.jpg"
                    />
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-end">
                        <TelegramAuthButton />
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Profile;
