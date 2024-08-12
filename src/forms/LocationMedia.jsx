import React, {useState, useCallback, useEffect} from "react";
import {useDropzone} from "react-dropzone";
import {
    Button, ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faDownload} from "@fortawesome/free-solid-svg-icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import {handleLocationSubmit, handlePublishLocation, handlePublishQuest} from "../methods/methods.js";
import {useLocationData} from "../providers/LocationProvider.jsx";
import {useAuth} from "../providers/AuthProvider.jsx";
import {faEye, faSave} from "@fortawesome/free-regular-svg-icons";


export function LocationMedia() {
    const [fileError, setFileError] = useState("");
    const {locationData, setLocationData} = useLocationData();
    const {promoImage} = locationData;

    const [promoImageFile, setPromoImageFile] = useState(promoImage instanceof File ? promoImage : null);
    const {accessToken} = useAuth();

    useEffect(() => {
        if (promoImage && !(promoImage instanceof File)) {
            const fetchImage = async () => {
                try {
                    const response = await fetch(promoImage);
                    const blob = await response.blob();
                    const file = new File([blob], "promoImage", {type: blob.type});
                    setPromoImageFile(file);
                    formik.setFieldValue('promoImage', file);
                } catch (error) {
                    console.error("Error fetching promo image:", error);
                }
            };
            fetchImage();
        } else if (promoImage instanceof File) {
            setPromoImageFile(promoImage);
            formik.setFieldValue('promoImage', promoImage);
        }
    }, [promoImage]);

    const formik = useFormik({
        initialValues: {
            promoImage: promoImageFile,
        },
        validationSchema: Yup.object({
            promoImage: Yup.mixed()
                .test('fileSize', 'Размер файла не должен превышать 50 МБ', value => !value || (value && value.size <= 50 * 1024 * 1024))
                .test('fileType', 'Файл должен быть изображением', value => !value || (value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type))),
        }),
        onSubmit: (values) => handleLocationSubmit(values, locationData, setLocationData, accessToken),
    });

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPromoImageFile(file);
            formik.setFieldValue('promoImage', file);
            setLocationData(prevData => ({
                ...prevData,
                promoImage: file
            }));
            setFileError("");
        }

        if (fileRejections.length > 0) {
            const errorMessage = fileRejections[0].errors.map(e => {
                if (e.code === 'file-too-large') {
                    return 'Файл превышает допустимый размер 50 МБ';
                } else if (e.code === 'file-invalid-type') {
                    return 'Неверный тип файла. Поддерживаются только изображения';
                }
                return e.message;
            }).join(', ');
            setFileError(errorMessage);
        } else {
            setFileError("");
        }
    }, [formik, setLocationData]);

    const handleRemoveFile = () => {
        setPromoImageFile("");
        formik.setFieldValue('promoImage', "");
        setLocationData(prevData => ({
            ...prevData,
            promoImage: ""
        }));
        setFileError("");
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*',
        maxSize: 50 * 1024 * 1024
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Card shadow="none" className="w-full">
                <CardBody>
                    <div {...getRootProps()}
                         className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p className="text-large font-bold">Изображение точки</p>
                        <p>Перетащите сюда изображение или нажмите, чтобы выбрать файл</p>
                    </div>
                    {fileError && (
                        <div className="text-danger text-tiny">
                            {fileError}
                        </div>
                    )}
                </CardBody>
                {formik.touched.promoImage && formik.errors.promoImage && (
                    <div className="text-danger text-tiny mt-2">{formik.errors.promoImage}</div>
                )}
            </Card>

            {promoImageFile && (
                <div className="gap-2 flex items-center justify-center">
                    <Popover placement="top" showArrow={true}>
                        <PopoverTrigger>
                            <Card shadow="sm" isPressable className="w-full max-w-[300px]">
                                <CardBody className="overflow-visible p-0">
                                    <Image src={URL.createObjectURL(promoImageFile)} alt={promoImageFile.name}
                                           shadow="sm" radius="lg" width="100%"
                                           className="w-full object-cover h-[140px]"/>
                                </CardBody>
                                <CardFooter className="text-small justify-between">
                                    <p className="line-clamp-1 font-thin text-gray-500 text-tiny mb-2">{promoImageFile.name}</p>
                                </CardFooter>
                            </Card>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2 flex gap-2">
                                <Button color="danger" size="sm" onClick={handleRemoveFile}>
                                    <FontAwesomeIcon icon={faTrashAlt}/> Удалить
                                </Button>
                                <Button color="primary" size="sm" onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(promoImageFile);
                                    link.download = promoImageFile.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}>
                                    <FontAwesomeIcon icon={faDownload}/> Скачать
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <ButtonGroup color="primary">
                <Button startContent={<FontAwesomeIcon icon={faSave}/>} type="submit">Сохранить</Button>
                <Button
                    variant="bordered"
                    onPress={() => handlePublishLocation(locationData, accessToken)}
                    startContent={<FontAwesomeIcon icon={faEye}/>}
                >
                    Опубликовать
                </Button>
            </ButtonGroup>
        </form>
    );
}
