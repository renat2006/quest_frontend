import {Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Link} from "@nextui-org/react";
import AdminBreadCrumbs from "../../componets/AdminBreadCrumbs/AdminBreadCrumbs.jsx";
import {Route, Routes} from "react-router-dom";
import {getLastPathPart} from "../../methods/methods.js";
import routes from "../../routes/routes.js";
import {RouteMedia} from "../../forms/RouteMedia.jsx";
import RouteInfo from "../../forms/RouteInfo.jsx";
import React, {Suspense} from "react";
import InteractiveMap from "../InteractiveMap/InteractiveMap.jsx";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center p-5 w-full"> <Card
            isFooterBlurred
            radius="lg"
            className="w-full max-w-[600px] h-[calc(100dvh_-_200px)]"
        >
            <CardHeader className="absolute z-10 top-1 flex-col items-start p-5">
                <p className="text-white font-bold text-2xl leading-none">Мы не нашли ни одного квеста во всей галактике</p>
                <p className="text-white/60 font-medium text-lg leading-none mt-2">Может попробуем вернуться на главную и поискать внимательнее?</p>
                <p className="text-white/80 font-medium text-6xl leading-none mt-2">404</p>
            </CardHeader>
            <Image
                alt="Woman listing to music"
                className="z-0 w-full h-full scale-125 -translate-y-6 blur-[4px] object-cover"

                src="https://i.pinimg.com/736x/2c/21/65/2c216574d68c3d7313aba4e9461a0a93.jpg"

            />
            <CardFooter className="justify-end before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">

                <Button as={Link}  href="/" className="text-white bg-white/10" variant="flat" color="default" radius="lg">
                    Вернуться
                </Button>
            </CardFooter>
        </Card></div>
    )
}