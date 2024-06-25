import TelegramAuthButton from "../../componets/TelegramAuthButton/TelegramAuthButton.jsx";
import {Card, CardFooter, CardHeader, Image} from "@nextui-org/react";

const Profile = () => {
    return (<div className="profile--container">
        <Card isFooterBlurred isHea className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-[0.6rem] text-black/70 uppercase font-bold">Будь ближе к сотням увлекательных
                    квестов!</p>
                <h4 className="text-black font-medium text-2xl">Войди через Telegram</h4>
            </CardHeader>
            <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://yurmino.ru/wp-content/uploads/2021/09/scale_1200-4.jpg"
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">

                <TelegramAuthButton/>
            </CardFooter>
        </Card></div>)
}
export default Profile