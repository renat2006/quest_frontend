import {Card, CardBody, CardFooter, CardHeader, Image} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faStar} from "@fortawesome/free-solid-svg-icons";

const MainPageQuestCard = ({ title, author, img, author_img, description, type, location, cost, rate, rate_sum }) => {
    return (
        <Card isPressable isFooterBlurred
              onPress={() => console.log("Карточка нажата")}
              className="max-w-[400px] min-h-[200px] col-span-12 sm:col-span-7">
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <h4 className="text-white/90 font-medium text-xl">{title}</h4>
                <p className="text-tiny text-white/60 ">{author}</p>
            </CardHeader>
            <CardBody className="overflow-visible p-0">
                <Image
                    removeWrapper
                    alt={title}
                    className="z-0 w-full h-full object-cover"
                    src={img}
                />
            </CardBody>
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2">
                    <Image
                        alt="Лого автора квеста"
                        className="rounded-full max-w-10 h-auto block"
                        src={author_img}
                    />
                    <div className="flex flex-col text-start">
                        <p className="text-sm text-white/70 line-clamp-1 font-medium indent-0">{description}</p>
                        <p className="text-tiny font-thin text-white/50 line-clamp-1">{type}</p>
                        <p className="text-tiny text-white/70 ">
                            <FontAwesomeIcon icon={faLocationDot} className="text-blue-500"/>
                            <span id="quest--location">{location}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-green-600 font-medium">{cost === "0" ? "Бесплатно" : `${cost} руб.`}</p>
                        <p className="text-tiny text-white/60">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500"/>
                            <span id="quest--rate">{rate}</span>
                            <span id="quest--rate-sum">({rate_sum})</span>
                        </p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default MainPageQuestCard;
