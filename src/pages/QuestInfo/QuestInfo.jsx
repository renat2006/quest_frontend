import {Card, CardHeader, CardBody, CardFooter, Image, Button, ScrollShadow, Input} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faStar, faSearch} from "@fortawesome/free-solid-svg-icons";
import MainPageQuestCard from "../../componets/MainPageQuestCard/MainPageQuestCard.jsx";


const QuestInfo = () => {
    const questList = [{
        title: "Тайны города",
        author: "Движение первых",
        img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
        author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
        description: "Пройди уникальный квест по Казани!",
        type: "Пешая прогулка",
        location: "Казань, Татарстан",
        cost: "0",
        rate: "3.8",
        rate_sum: "20",
    },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        },
        {
            title: "Тайны города",
            author: "Движение первых",
            img: "https://ic.pics.livejournal.com/zdorovs/16627846/1557359/1557359_original.jpg",
            author_img: "/demoImages/QuestAuthorLogo/dvfirst.svg",
            description: "Пройди уникальный квест по Казани!",
            type: "Пешая прогулка",
            location: "Казань, Татарстан",
            cost: "0",
            rate: "3.8",
            rate_sum: "20",
        }];
    const questListCards = questList.map((quest, index) => (
        <MainPageQuestCard
            key={index}
            title={quest.title}
            author={quest.author}
            img={quest.img}
            author_img={quest.author_img}
            description={quest.description}
            type={quest.type}
            location={quest.location}
            cost={quest.cost}
            rate={quest.rate}
            rate_sum={quest.rate_sum}
        />
    ))
    return (
        <div className="quest--container">
            <Input
                classNames={{
                    base: "max-w-full sm:max-w-[400px] h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                placeholder="Поиск квестов"
                size="sm"
                startContent={<FontAwesomeIcon size={18} icon={faSearch}/>}
                type="search"
            />
            <ScrollShadow className="flex flex-col gap-4 h-full" size={20} hideScrollBar>
                {questListCards}
            </ScrollShadow>
        </div>
    );
}

export default QuestInfo;
