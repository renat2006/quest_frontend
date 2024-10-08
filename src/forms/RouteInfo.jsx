import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Autocomplete, AutocompleteItem, Button, ButtonGroup, Input, Textarea} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faFileAudio, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {createQuest, publishQuest} from "../api/api.js";
import {languageList, pathTypes} from "../data/types.js";
import {useQuest} from "../providers/RouteProvider.jsx";
import {useAuth} from "../providers/AuthProvider.jsx";
import {handlePublishQuest, handleSubmit} from "../methods/methods.js";
import {faEye, faSave} from "@fortawesome/free-regular-svg-icons";
import SaveAndPublishButtonGroup from "../componets/SaveAndPublishButtonGroup/SaveAndPublishButtonGroup.jsx";


const RouteInfo = () => {
    const {questData, setQuestData} = useQuest();
    const navigate = useNavigate();
    const {routeName, routeType, routeLanguage, routeDescription, routeAudioTeaser, questId, promoImage} = questData;
    useEffect(() => console.log("pi",promoImage), [navigate])

    const {accessToken} = useAuth();
    const [selectedRouteType, setSelectedRouteType] = useState(routeType || '');
    const [selectedRouteLanguage, setSelectedRouteLanguage] = useState(routeLanguage || '');
    const [audioFile, setAudioFile] = useState(routeAudioTeaser || '');
    const [audioURL, setAudioURL] = useState(routeAudioTeaser ? URL.createObjectURL(routeAudioTeaser) : '');


    const formik = useFormik({
        initialValues: {
            routeName: routeName || '',
            routeType: selectedRouteType,
            routeLanguage: selectedRouteLanguage,
            routeDescription: routeDescription || '',
            routeAudioTeaser: routeAudioTeaser || '',
        },
        validationSchema: Yup.object({
            routeName: Yup.string()
                .required("Название маршрута обязательно")
                .max(30, "Название маршрута не может превышать 30 символов"),
            routeType: Yup.string().required("Тип маршрута обязателен"),
            routeLanguage: Yup.string().required("Язык маршрута обязателен"),
            routeDescription: Yup.string()

                .max(200, "Описание не может превышать 200 символов"),
            routeAudioTeaser: Yup.mixed()
                .test('fileSize', 'Размер файла не должен превышать 10 МБ', value => !value || (value && value.size <= 10 * 1024 * 1024))
                .test('fileType', 'Файл должен быть аудиофайлом', value => !value || (value && (value.type ? ['audio/mpeg', 'audio/wav', 'audio/ogg'].includes(value.type) : true))),
        }),
        onSubmit: (values) => handleSubmit(values, questData,  setQuestData, accessToken),

    });

    useEffect(() => {
        formik.setFieldValue('routeType', selectedRouteType);
        formik.setFieldValue('routeLanguage', selectedRouteLanguage);
    }, [selectedRouteType, selectedRouteLanguage]);

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue('routeAudioTeaser', file);
        formik.setTouched({...formik.touched, routeAudioTeaser: true});
        setAudioFile(file);
        setAudioURL(URL.createObjectURL(file));
    };

    const handleRemoveFile = () => {
        formik.setFieldValue('routeAudioTeaser', '');
        formik.setTouched({...formik.touched, routeAudioTeaser: false});
        setAudioFile('');
        setAudioURL('');
    };


    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div>
                <Input
                    label="Название"
                    placeholder="Введите название маршрута"
                    variant="bordered"
                    name="routeName"
                    value={formik.values.routeName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.routeName && Boolean(formik.errors.routeName)}
                    errorMessage={formik.touched.routeName && formik.errors.routeName ? formik.errors.routeName : null}
                />
            </div>
            <div>
                <Autocomplete
                    isRequired
                    label="Тип маршрута"
                    variant="bordered"
                    defaultItems={pathTypes}
                    placeholder="Выберите тип для маршрута"
                    selectedKey={selectedRouteType}
                    onSelectionChange={setSelectedRouteType}
                    errorMessage={formik.touched.routeType && formik.errors.routeType ? formik.errors.routeType : null}
                    isInvalid={formik.touched.routeType && Boolean(formik.errors.routeType)}
                >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
            </div>
            <div>
                <Autocomplete
                    isRequired
                    label="Язык"
                    variant="bordered"
                    defaultItems={languageList}
                    placeholder="Выберите основной язык маршрута"
                    selectedKey={selectedRouteLanguage}
                    onSelectionChange={setSelectedRouteLanguage}
                    errorMessage={formik.touched.routeLanguage && formik.errors.routeLanguage ? formik.errors.routeLanguage : null}
                    isInvalid={formik.touched.routeLanguage && Boolean(formik.errors.routeLanguage)}
                >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
            </div>
            <div>
                <Textarea
                    label="Описание"
                    placeholder="Введите описание маршрута"
                    variant="bordered"
                    name="routeDescription"
                    value={formik.values.routeDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.routeDescription && Boolean(formik.errors.routeDescription)}
                    errorMessage={formik.touched.routeDescription && formik.errors.routeDescription ? formik.errors.routeDescription : null}
                />
            </div>
            <div className="flex flex-col gap-2">
                {!audioFile ? (
                    <div>
                        <Button as="label" variant="flat" startContent={<FontAwesomeIcon icon={faFileAudio}/>}>
                            Выберите аудиофайл
                            <input
                                type="file"
                                accept="audio/*"
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            />
                        </Button>
                        {formik.touched.routeAudioTeaser && formik.errors.routeAudioTeaser && (
                            <div className="text-danger text-tiny mt-1">{formik.errors.routeAudioTeaser}</div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <audio controls src={audioURL} className="w-full"></audio>
                        <div className="line-clamp-1 font-thin text-gray-500 text-tiny mb-2">{audioFile.name}</div>
                        <div className="flex gap-2">
                            <Button color="primary" onClick={() => {
                                const link = document.createElement('a');
                                link.href = audioURL;
                                link.download = audioFile.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}>
                                <FontAwesomeIcon icon={faDownload}/> Скачать
                            </Button>
                            <Button color="danger" onClick={handleRemoveFile}>
                                <FontAwesomeIcon icon={faTrashAlt}/> Удалить
                            </Button>
                        </div>
                    </div>
                )}
                {formik.touched.routeAudioTeaser && formik.errors.routeAudioTeaser && (
                    <span className="text-danger text-tiny">{formik.errors.routeAudioTeaser}</span>
                )}
            </div>
            <SaveAndPublishButtonGroup/>
        </form>
    );
};

export default RouteInfo;
