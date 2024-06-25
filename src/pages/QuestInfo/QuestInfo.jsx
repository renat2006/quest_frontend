import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";

const QuestInfo = () => {
    return (
        <div className="quest--container"><Card isFooterBlurred className="max-w-[400px] h-[450px] col-span-12 sm:col-span-7">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <h4 className="text-white/90 font-medium text-xl">Тайны города</h4>
                <p className="text-tiny text-white/60 ">Движение первых</p>

            </CardHeader>
            <Image
                removeWrapper
                alt="Relaxing app background"
                className="z-0 w-full h-full object-cover"
                src="https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg"
            />
            <CardFooter
                className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                    <Image
                        alt="Лого автора квеста"
                        className="rounded-full max-w-10 h-auto block"
                        src="/demoImages/QuestAuthorLogo/dvfirst.svg"
                    />
                    <div className="flex flex-col">
                        <p className="text-tiny text-white/60">Пройди уникальный квест по Казани!</p>

                    </div>
                </div>
                <Button radius="full" size="sm">Пройти</Button>
            </CardFooter>
        </Card></div>)
}
export default QuestInfo