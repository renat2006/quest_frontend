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
    Badge,
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
    Autocomplete
} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faLandmark,
    faMapLocationDot,
    faMapPin,
    faFolder,
    faFolderOpen,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import classNames from "classnames";
import {languageList, pathTypes} from "../../data/types.js";
import {useNavigate} from "react-router-dom";
import routes from "../../routes/routes.js";
import {useFormik} from "formik";
import * as yup from "yup";
import {createQuest, getUUID} from "../../api/api.js";
import {toast} from "react-hot-toast";
import {useAuth} from "../../providers/AuthProvider.jsx";

const validationSchema = yup.object({
    routeName: yup
        .string()
        .required("Название не может быть пустым.")
        .max(30, "Название не должно превышать 30 символов.")
        .matches(/^[\p{L}\p{N}\s]+$/u, "Название может содержать только стандартные символы Unicode."),
    routeType: yup.string().required("Тип маршрута должен быть выбран."),
    routeLanguage: yup.string().required("Язык маршрута должен быть выбран.")
});

const FormModal = ({isOpen, onOpenChange, initialValues, onSubmit}) => {
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

const AdminCard = ({item}) => {
    return (
        <Card className="w-full border-2" isPressable onPress={() => console.log("item pressed")} shadow="none"
              key={item.title}>
            <CardBody className="flex flex-row gap-5 justify-center items-center">
                <Image alt={item.title} className="object-cover min-w-[80px] w-[80px] h-[60px] flex-1"
                       src={item.cover}/>
                <div className="flex-1">
                    <p className="font-bold line-clamp-1">{item.title}</p>
                    <p className="font-thin text-sm">{item.type}</p>
                </div>
            </CardBody>
        </Card>
    );
};

const Admin = () => {
    const [openItem, setOpenItem] = useState(null);
    const [pointList, setPointList] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [routeList, setRouteList] = useState([
        {
            cover: "https://turgeek.ru/upload/tour/image_main/10577/big-tur-v-kazan-zolotoe-kolco-povolze.jpg",
            title: "Казань - моя родина",
            type: "Пеший"
        },
        {
            cover: "https://s0.rbk.ru/v6_top_pics/resized/1440xH/media/img/8/20/755953419643208.jpg",
            title: "Необычные места Казани",
            type: "Пеший"
        },
        {
            cover: "https://baldezh.top/uploads/posts/2021-04/1618681509_3-funart_pro-p-dvorets-zemledeliya-kazan-krasivie-mesta-f-3.jpg",
            title: "Супер квест",
            type: "Пеший"
        },
        {
            cover: "https://putidorogi-nn.ru/images/stories/evropa/rossiya/kazan_2.jpg",
            title: "Мега квест",
            type: "Пеший"
        },
        {
            cover: "https://sch159ufa.ru/images/2022/2041_n2065251_big.jpg",
            title: "Гипер квест",
            type: "Пеший"
        }
    ]);

    const accordionInfo = [
        {
            key: "1",
            title: "Маршруты",
            subtitle: "",
            startContent: faMapLocationDot,
            content: routeList,
            objCount: "1"
        },
        {
            key: "2",
            title: "Точки",
            subtitle: "",
            startContent: faMapPin,
            content: pointList,
            objCount: "4"
        },
        {
            key: "3",
            title: "Музеи",
            subtitle: "",
            startContent: faLandmark,
            content: [],
            objCount: "0"
        }
    ];
    const blanckCrad = {
        cover: "https://via.placeholder.com/300x200",
        title: "Название",
        type: "Тип"
    };

    const navigate = useNavigate();
    const {accessToken} = useAuth();
    const handleNext = async (values) => {
        try {

            const {uuid} = await getUUID(accessToken);


            const questData = {
                quest_id: uuid[0],
                title: values.routeName,
                description: 'go',
                lang: values.routeLanguage,
                type: values.routeType,

            };
            console.log(questData)


            await createQuest(questData, accessToken);

            toast.success("Квест успешно создан");


            setRouteList([...routeList, {
                ...questData,
                cover: "https://via.placeholder.com/300x200",
                type: values.routeType
            }]);


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
            indicator={({isOpen}) => (isOpen ? <FontAwesomeIcon icon={faFolderOpen}/> :
                <FontAwesomeIcon icon={faFolder}/>)}
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
                {item.content.length > 0 ? item.content.map(item => <AdminCard item={item}/>) :
                    <p>Добавьте первый объект</p>}
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
                            <Button color="primary" size="sm" startContent={<FontAwesomeIcon icon={faPlus}/>}>
                                Добавить
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat" aria-label="Dropdown menu with description"
                                      disabledKeys={["museum"]}>
                            <DropdownItem
                                key="route"
                                description="Добавить новый маршрут с новыми или ранее созданными точками"
                                startContent={<FontAwesomeIcon icon={faMapLocationDot}/>}
                                onPress={onOpen}
                            >
                                Маршрут
                            </DropdownItem>
                            <DropdownItem
                                key="point"
                                description="Добавить новую точку для маршрутов"
                                startContent={<FontAwesomeIcon icon={faMapPin}/>}
                                onPress={() => setPointList(oldPointList => [...oldPointList, blanckCrad])}
                            >
                                Точку
                            </DropdownItem>
                            <DropdownItem key="museum" description="В разработке..."
                                          startContent={<FontAwesomeIcon icon={faLandmark}/>}>
                                Музей
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </CardHeader>
                <Divider/>
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
