import React from "react";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import QuestButtonGroup from "../QuestButtonGroup/QuestButtonGroup.jsx";

export default function QuestCard() {
    return (
        <Card className="py-4 card max-w-[400px]">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">

                <h2 className="font-bold text-large">Заголовок</h2>
            </CardHeader>
            <CardBody className="overflow-visible py-2">

                <Image
                    alt="Card background"
                    className="object-cover rounded-xl w-96 h-52"
                    src="https://bogatyr.club/uploads/posts/2023-02/1675426844_bogatyr-club-p-kvest-fon-fon-vkontakte-76.jpg"

                />
                <p className="mt-5">Тут будет крутой текст квеста</p>
                <QuestButtonGroup> </QuestButtonGroup>
            </CardBody>
        </Card>
    );
}
