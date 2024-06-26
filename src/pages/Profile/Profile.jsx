import {useAuth} from "../../providers/AuthProvider.jsx";
import {Avatar, Button, Card, CardBody, CardFooter, CardHeader, Image, Link, User} from "@nextui-org/react";
import TelegramAuthButton from "../../componets/TelegramAuthButton/TelegramAuthButton.jsx";

const Profile = () => {
    const {user} = useAuth();
    // console.log(user);

    return (
        <div className="profile--container">
            {user ? (
                <Card className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
                    <CardHeader className="justify-between">
                        <User
                            name={user.first_name + " " + user.last_name}
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

                    </CardHeader>
                    <CardBody className="px-3 py-0 text-small text-default-400">
                        <p>
                            Хоп хей
                        </p>


                        <span className="pt-2">
          {/*#FrontendWithZoey*/}
          {/*<span className="py-2" aria-label="computer" role="img">*/}
          {/*  💻*/}
          {/*</span>*/}
        </span>
                    </CardBody>
                    <CardFooter className="gap-3">
                        {/*<div className="flex gap-1">*/}
                        {/*    <p className="font-semibold text-default-400 text-small">4</p>*/}
                        {/*    <p className=" text-default-400 text-small">Following</p>*/}
                        {/*</div>*/}
                        {/*<div className="flex gap-1">*/}
                        {/*    <p className="font-semibold text-default-400 text-small">97.1K</p>*/}
                        {/*    <p className="text-default-400 text-small">Followers</p>*/}
                        {/*</div>*/}
                    </CardFooter>
                </Card>
            ) : (
                <Card className="w-full max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-[0.6rem] text-black/70 uppercase font-bold">Будь ближе к сотням увлекательных
                            квестов!</p>
                        <h4 className="text-black font-medium text-2xl">Войди через Telegram</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Cardbackground"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src="https://yurmino.ru/wp-content/uploads/2021/09/scale_1200-4.jpg"
                    />
                    <CardFooter
                        className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-end">
                        <TelegramAuthButton/>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Profile;
