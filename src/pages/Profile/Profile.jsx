import TelegramAuthButton from "../../componets/TelegramAuthButton/TelegramAuthButton.jsx";
import {Card, CardFooter, CardHeader, Image} from "@nextui-org/react";

const Profile = () => {
    return (<div className="profile--container">
        <Card isFooterBlurred className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">New</p>
                <h4 className="text-black font-medium text-2xl">Acme camera</h4>
            </CardHeader>
            <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src="https://nextui.org/images/card-example-6.jpeg"
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                    <p className="text-black text-tiny">Присоединяйся уже сегодня!</p>

                </div>
                <TelegramAuthButton/>
            </CardFooter>
        </Card></div>)
}
export default Profile