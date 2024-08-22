import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
    Image,
    Divider,
    Accordion,
    AccordionItem,
    Chip,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    useDisclosure,
    Modal,
    ModalContent,
    Input,
    ModalFooter,
    ModalHeader,
    ModalBody,
    AutocompleteItem,
    Autocomplete,
    Skeleton,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLandmark,
    faMapLocationDot,
    faMapPin,
    faFolder,
    faFolderOpen,
    faPlus,
    faTrash,
    faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { languageList, pathTypes } from "../../data/types.js";
import { useNavigate } from "react-router-dom";
import routes from "../../routes/routes.js";
import { useFormik } from "formik";
import * as yup from "yup";
import { createQuest, getUUID, fetchUserQuests, fetchUserLocations, deleteQuest, deleteLocation } from "../../api/api.js";
import { toast } from "react-hot-toast";
import { useAuth } from "../../providers/AuthProvider.jsx";
import JSZip from "jszip";

const validationSchema = yup.object({
    routeName: yup
        .string()
        .required("Название не может быть пустым.")
        .max(30, "Название не должно превышать 30 символов.")
        .matches(/^[\p{L}\p{N}\s]+$/u, "Название может содержать только стандартные символы Unicode."),
    routeType: yup.string().required("Тип маршрута должен быть выбран."),
    routeLanguage: yup.string().required("Язык маршрута должен быть выбран.")
});

const FormModal = ({ isOpen, onOpenChange, initialValues, onSubmit }) => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    useEffect(() => {
        if (isOpen) {
            formik.resetForm();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={formik.handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">Создать маршрут</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                isRequired
                                isClearable
                                label="Название"
                                placeholder="Введите название маршрута"
                                variant="bordered"
                                name="routeName"
                                value={formik.values.routeName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errorMessage={formik.touched.routeName && formik.errors.routeName ? formik.errors.routeName : ""}
                                isInvalid={formik.touched.routeName && !!formik.errors.routeName}
                            />
                            <Autocomplete
                                isRequired
                                label="Тип маршрута"
                                variant="bordered"
                                defaultItems={pathTypes}
                                placeholder="Выберите тип для маршрута"
                                name="routeType"
                                selectedKey={formik.values.routeType}
                                onSelectionChange={(key) => formik.setFieldValue("routeType", key)}
                                errorMessage={formik.touched.routeType && formik.errors.routeType ? formik.errors.routeType : ""}
                                isInvalid={formik.touched.routeType && !!formik.errors.routeType}
                            >
                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                            <Autocomplete
                                isRequired
                                label="Язык"
                                variant="bordered"
                                defaultItems={languageList}
                                placeholder="Выберите основной язык маршрута"
                                name="routeLanguage"
                                selectedKey={formik.values.routeLanguage}
                                onSelectionChange={(key) => formik.setFieldValue("routeLanguage", key)}
                                errorMessage={formik.touched.routeLanguage && formik.errors.routeLanguage ? formik.errors.routeLanguage : ""}
                                isInvalid={formik.touched.routeLanguage && !!formik.errors.routeLanguage}
                            >
                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Отмена
                            </Button>
                            <Button color="primary" type="submit">
                                Далее
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
};

const AdminCard = ({ item, handleCardPress, handleDelete, isQuest }) => {
    const idKey = isQuest ? 'quest_id' : 'location_id';
    const nameKey = isQuest ? 'title_draft' : 'title';
    const typeKey = isQuest ? 'type_draft' : 'language';

    return (
        <Popover placement="top" showArrow={true}>
            <PopoverTrigger>
                <Card className="w-full border-2" shadow="none" key={item[idKey]}>
                    <CardBody className="flex flex-row gap-5 justify-center items-center">
                        <Image alt={item[nameKey]} className="object-cover min-w-[80px] w-[80px] h-[60px] flex-1"
                               src={item.cover || '/placeholders/image_placeholder.svg'} />
                        <div className="flex-1">
                            <p className="font-bold line-clamp-1">{item[nameKey]}</p>
                            <p className="font-thin text-sm">{item[typeKey]}</p>
                        </div>
                    </CardBody>
                </Card>
            </PopoverTrigger>
            <PopoverContent className="flex gap-3 flex-row p-2">
                <Button color="primary" size="sm" onPress={() => handleCardPress(item[idKey], isQuest)}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Открыть
                </Button>
                <Button color="danger" size="sm" onPress={() => handleDelete(item[idKey], isQuest)}>
                    <FontAwesomeIcon icon={faTrash} /> Удалить
                </Button>
            </PopoverContent>
        </Popover>
    );
};

const AdminSkeletonCard = () => (
    <Card className="w-full border-2" shadow="none">
        <CardBody className="flex flex-row gap-5 justify-center items-center">
            <Skeleton className="min-w-[80px] w-[80px] h-[60px] flex-1 rounded-lg">
                <div className="h-60 w-80 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="flex-1 space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        </CardBody>
    </Card>
);

const Admin = () => {
    const [openItem, setOpenItem] = useState(null);
    const [pointList, setPointList] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [routeList, setRouteList] = useState([]);
    const [loadingQuests, setLoadingQuests] = useState(true);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const isLoading = loadingQuests || loadingLocations;

    useEffect(() => {
        const getQuests = async () => {
            try {
                const zipBlob = await fetchUserQuests(accessToken);

                const zip = await JSZip.loadAsync(zipBlob);
                const quests = [];

                await Promise.all(Object.keys(zip.files).map(async (filePath) => {
                    if (filePath.endsWith('data.json')) {
                        const fileData = await zip.file(filePath).async('string');
                        const questData = JSON.parse(fileData);

                        const folderPath = filePath.split('/').slice(0, -1).join('/');

                        const promoFilePath = `${folderPath}/promo_draft.webp`;
                        const promoFile = zip.file(promoFilePath);
                        if (promoFile) {
                            questData.cover = URL.createObjectURL(await promoFile.async('blob'));
                        }

                        quests.push(questData);
                    }
                }));

                const unpublishedQuests = quests.map((quest) => ({
                    quest_id: quest.quest_id,
                    title_draft: quest.title_draft || quest.title,
                    description_draft: quest.description_draft || quest.description,
                    locations_draft: quest.locations_draft || quest.locations,
                    lang_draft: quest.lang_draft || quest.lang,
                    type_draft: quest.type_draft || quest.type,
                    cover: quest.cover,
                }));

                setRouteList(unpublishedQuests);
            } catch (error) {
                console.error('Error fetching quests:', error);
            }
            setLoadingQuests(false);
        };

        const getLocations = async () => {
            try {
                const zipBlob = await fetchUserLocations(accessToken);
                const zip = await JSZip.loadAsync(zipBlob);
                const locations = [];

                await Promise.all(Object.keys(zip.files).map(async (filePath) => {
                    if (filePath.endsWith('data.json')) {
                        const fileData = await zip.file(filePath).async('string');
                        const locationData = JSON.parse(fileData);

                        const folderPath = filePath.split('/').slice(0, -1).join('/');

                        const promoFilePath = `${folderPath}/promo_draft.webp`;
                        const promoFile = zip.file(promoFilePath);
                        if (promoFile) {
                            locationData.cover = URL.createObjectURL(await promoFile.async('blob'));
                        }

                        locations.push(locationData);
                    }
                }));

                const userLocations = locations.map((location) => ({
                    location_id: location.location_id,
                    title: location.title_draft || location.title || "Untitled",
                    description: location.description_draft || location.description,
                    coordinates: location.coords_draft || location.coords,
                    lang: location.lang_draft || location.lang,
                    cover: location.cover,
                }));

                setPointList(userLocations);
            } catch (error) {
                console.error('Error fetching user locations:', error);
            }
            setLoadingLocations(false);
        };

        getQuests();
        getLocations();
    }, [accessToken]);

    const handleCardPress = (id, isQuest) => {
        if (isQuest) {
            navigate(routes.admin.routeAdminInfo.url, {
                state: id,
            });
        } else {
            navigate(routes.admin.locationAdminInfo.url, {
                state: id,
            });
        }
    };

    const handleDelete = async (id, isQuest) => {
        const toastId = toast.loading("Удаление...");
        try {
            if (isQuest) {
                await deleteQuest(id, accessToken);
                setRouteList((prev) => prev.filter((quest) => quest.quest_id !== id));
                toast.success("Квест успешно удалён", { id: toastId });
            } else {
                await deleteLocation(id, accessToken);
                setPointList((prev) => prev.filter((location) => location.location_id !== id));
                toast.success("Точка успешно удалёна", { id: toastId });
            }
        } catch (error) {
            toast.error("Ошибка при удалении", { id: toastId });
            console.error("Error deleting:", error);
        }
    };

    const accordionInfo = [
        {
            key: "1",
            title: "Маршруты",
            subtitle: "",
            startContent: faMapLocationDot,
            content: routeList,
        },
        {
            key: "2",
            title: "Точки",
            subtitle: "",
            startContent: faMapPin,
            content: pointList,
        },
        {
            key: "3",
            title: "Музеи",
            subtitle: "",
            startContent: faLandmark,
            content: [],
        }
    ];

    const handleNext = async (values) => {
        try {
            const { uuid } = await getUUID(accessToken);

            const questData = {
                quest_id: uuid[0],
                title: values.routeName,
                description: '',
                lang: values.routeLanguage,
                type: values.routeType,
            };

            await createQuest(questData, accessToken);

            toast.success("Квест успешно создан");

            onOpenChange(false);

            navigate(routes.admin.routeAdminInfo.url, {
                state: uuid[0],
            });
        } catch (error) {
            console.error("Error creating quest:", error);
            toast.error("Ошибка при создании квеста");
        }
    };

    const formModalProps = {
        isOpen,
        onOpenChange,
        initialValues: {
            routeName: "",
            routeType: pathTypes[0].value,
            routeLanguage: languageList[0].value
        },
        onSubmit: handleNext
    };

    const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
    const accordionComponents = accordionInfo.map(item => (
        <AccordionItem
            key={item.key}
            aria-label={item.title}
            disableIndicatorAnimation
            indicator={({ isOpen }) => (isOpen ? <FontAwesomeIcon icon={faFolderOpen} /> :
                <FontAwesomeIcon icon={faFolder} />)}
            className="transition-all"
            title={
                <>
                    <span>
                        {item.title}{" "}
                        <Chip className="transition-all" variant="flat"
                              color={selectedKeys.has(item.key) ? "primary" : "default"}>
                            {item.content.length}
                        </Chip>
                    </span>
                </>
            }
            startContent={
                <FontAwesomeIcon
                    className={classNames("text-xl", "transition-all", {
                        "text-primary": selectedKeys.has(item.key)
                    })}
                    icon={item.startContent}
                />
            }
            onOpen={() => setOpenItem(item.key)}
            onClose={() => setOpenItem(null)}
        >
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 8 }, (_, index) => <AdminSkeletonCard key={index} />)
                    : item.content.length > 0
                        ? item.content.map(item => <AdminCard item={item} key={item.quest_id || item.location_id} handleCardPress={handleCardPress} handleDelete={handleDelete} isQuest={item.quest_id !== undefined} />)
                        : <p>Добавьте первый объект</p>}
            </div>
        </AccordionItem>
    ));

    return (
        <div className="flex flex-col items-center p-5 w-full mt-3">
            <FormModal {...formModalProps} />
            <Card className="w-full max-w-[1000px]">
                <CardHeader className="flex gap-3 justify-between">
                    <h1 className="text-xl font-bold">Мои объекты</h1>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color="primary" size="sm" startContent={<FontAwesomeIcon icon={faPlus} />}>
                                Добавить
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat" aria-label="Dropdown menu with description"
                                      disabledKeys={["museum"]}>
                            <DropdownItem
                                key="route"
                                description="Добавить новый маршрут с новыми или ранее созданными точками"
                                startContent={<FontAwesomeIcon icon={faMapLocationDot} />}
                                onPress={onOpen}
                            >
                                Маршрут
                            </DropdownItem>
                            <DropdownItem
                                key="point"
                                description="Добавить новую точку для маршрутов"
                                startContent={<FontAwesomeIcon icon={faMapPin} />}
                                onPress={() => setPointList(oldPointList => [...oldPointList, blanckCrad])}
                            >
                                Точку
                            </DropdownItem>
                            <DropdownItem key="museum" description="В разработке..."
                                          startContent={<FontAwesomeIcon icon={faLandmark} />}>
                                Музей
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Accordion disabledKeys={["3"]} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                        {accordionComponents}
                    </Accordion>
                </CardBody>
                <CardFooter className="flex items-end flex-col"></CardFooter>
            </Card>
        </div>
    );
};

export default Admin;
