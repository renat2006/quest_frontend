import {useState, useEffect, useRef} from "react";
import {Avatar, Card, CardBody, CardFooter, CardHeader, Image} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faStar} from "@fortawesome/free-solid-svg-icons";
import ColorThief from 'colorthief';
import routes from "../../routes/routes.js";
import {useNavigate} from "react-router-dom";

const MainPageQuestCard = ({title, quest_id, author, img, author_img, description, type, location, cost, rate, rate_sum}) => {
    const [textColor, setTextColor] = useState('text-white/90');
    const imgRef = useRef();

    useEffect(() => {
        const setTextColorBasedOnImage = () => {
            if (imgRef.current) {
                const colorThief = new ColorThief();
                const resultColor = colorThief.getColor(imgRef.current);
                const brightness = (resultColor[0] * 299 + resultColor[1] * 587 + resultColor[2] * 114) / 1000;
                setTextColor(brightness > 125 ? 'text-black/90' : 'text-white/90');
            }
        };

        if (imgRef.current) {
            if (imgRef.current.complete) {
                setTextColorBasedOnImage();
            } else {
                imgRef.current.addEventListener('load', setTextColorBasedOnImage);
            }
        }

        return () => {
            if (imgRef.current) {
                imgRef.current.removeEventListener('load', setTextColorBasedOnImage);
            }
        };
    }, [img]);
    const navigate = useNavigate();
    const handleCardPress = (questId) => {
        navigate(routes.admin.routeAdminInfo.url, {
            state: questId,
        });
    };
    return (
        <Card isPressable isFooterBlurred shadow="none"
              onPress={() => handleCardPress(quest_id)}
              className="max-w-[400px] min-h-[200px] max-h-[200px] col-span-12 sm:col-span-7">
            <CardHeader className="absolute z-10 top-1 flex-col items-start ">
                <h4 className={"font-medium text-xl " + textColor}>{title}</h4>
                <p className={"text-tiny " + textColor}>{author}</p>
            </CardHeader>
            <CardBody className="overflow-visible p-0">
                <Image
                    removeWrapper
                    alt={title}
                    className="z-0 w-full h-full object-cover"
                    src={img}
                    ref={imgRef}
                />
            </CardBody>
            <CardFooter
                className="absolute bg-black/40 bottom-0 z-10  border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-3 items-center">
                    <Avatar isBordered color="primary" name={author} src={author_img} className="w-10 h-10"/>
                    <div className="flex flex-col text-start flex-1">
                        <p className="text-sm text-white/70 line-clamp-1 font-medium max-w-[150px] indent-0">{description}</p>
                        <p className="text-tiny font-thin text-white/50 line-clamp-1">{type}</p>
                        <p className="text-tiny text-white/70">
                            <FontAwesomeIcon icon={faLocationDot} className="text-blue-500"/> <span
                            id="quest--location">{location}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end self-start">
                        <p className="text-sm text-green-600 font-medium">{cost === "0" ? "Бесплатно" : `${cost} руб.`}</p>
                        <p className="text-tiny text-white/60">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500"/> <span
                            id="quest--rate">{rate}</span> <span id="quest--rate-sum">({rate_sum})</span>
                        </p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default MainPageQuestCard;
