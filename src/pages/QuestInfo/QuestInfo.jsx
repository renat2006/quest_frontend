import {useState, useEffect} from "react";
import {Avatar, Card, CardBody, CardFooter, CardHeader, Image, Input, ScrollShadow, Skeleton} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot, faSearch, faStar} from "@fortawesome/free-solid-svg-icons";

import {fetchAllQuests} from "../../api/api.js";
import {useAuth} from "../../providers/AuthProvider.jsx";
import JSZip from 'jszip';
import {pathTypes} from "../../data/types.js";
import MainPageQuestCard from "../../componets/MainPageQuestCard/MainPageQuestCard.jsx";


const QuestInfo = () => {
    const {accessToken} = useAuth();
    const [questList, setQuestList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const getQuestTypeLabel = (value) => {
        const pathType = pathTypes.find(type => type.value === value);
        return pathType ? pathType.label : value;
    };

    useEffect(() => {
        const getQuests = async () => {
            try {
                const zipBlob = await fetchAllQuests(accessToken, 0, 10);
                const zip = await JSZip.loadAsync(zipBlob);
                const quests = [];

                await Promise.all(Object.keys(zip.files).map(async (filePath) => {
                    if (filePath.endsWith('data.json')) {
                        const fileData = await zip.file(filePath).async('string');
                        const questData = JSON.parse(fileData);

                        const folderPath = filePath.split('/').slice(0, -1).join('/');

                        // Extract promo image
                        const promoFilePath = `${folderPath}/promo.webp`;
                        const promoFile = zip.file(promoFilePath);
                        if (promoFile) {
                            questData.img = URL.createObjectURL(await promoFile.async('blob'));
                        }

                        // Extract author profile image
                        questData.author_img = null;
                        const userProfileFile = Object.keys(zip.files).find(file => file.startsWith(`${folderPath}/user_profile`));
                        if (userProfileFile) {
                            questData.author_img = URL.createObjectURL(await zip.file(userProfileFile).async('blob'));
                        }

                        quests.push(questData);
                    }
                }));

                setQuestList(quests);
            } catch (error) {
                console.error('Error fetching quests:', error);
            } finally {
                setLoading(false);
            }
        };

        getQuests();
    }, [accessToken]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredQuests = questList.filter((quest) => {
        return (
            quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quest.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getQuestTypeLabel(quest.type).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const renderSkeletons = () => (
        Array.from({length: 5}, (_, index) => (
            <Card isPressable isFooterBlurred shadow="none"
                  onPress={() => console.log("Карточка нажата")}
                  className="min-w-[315px] w-full max-w-[400px] min-h-[200px] col-span-12 sm:col-span-7" key={index}>
                <CardHeader className="absolute z-10 top-1 flex-col items-start ">

                </CardHeader>
                <CardBody className="overflow-visible p-0">
                    <Skeleton className="h-full w-full rounded-lg"/>
                </CardBody>
                <CardFooter
                    className="absolute bg-black/40 bottom-0 z-10  border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2">
                        <Skeleton className="flex rounded-full w-12 h-12"/>
                        <div className="flex flex-1 flex-col gap-2">
                            <Skeleton className="h-3 w-2/5 rounded-lg"/>
                            <Skeleton className="h-3 w-4/5 rounded-lg"/>
                            <Skeleton className="h-3 w-3/5 rounded-lg"/>
                        </div>

                    </div>
                </CardFooter>
            </Card>
        ))
    );

    const questListCards = filteredQuests.map((quest, index) => (
        <MainPageQuestCard
            key={index}
            title={quest.title}
            questId={quest.quest_id}
            author={quest.author_name}
            img={quest.img}
            author_img={quest.author_img}
            description={quest.description}
            type={getQuestTypeLabel(quest.type)} // Преобразование типа маршрута
            location="Казань" // Assuming locations is an array of strings
            cost="0" // Assuming the cost is not provided in data.json
            rate={quest.rating}
            rate_sum={quest.rating_count}
        />
    ));

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
                startContent={<FontAwesomeIcon icon={faSearch}/>}
                type="search"
                value={searchTerm}
                onChange={handleSearch}
            />
            <ScrollShadow className="flex flex-col gap-4 h-full" size={20} hideScrollBar>
                {loading ? renderSkeletons() : questListCards}
            </ScrollShadow>
        </div>
    );
};

export default QuestInfo;
