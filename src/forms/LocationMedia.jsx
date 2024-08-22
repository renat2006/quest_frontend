import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Button, ButtonGroup,
    Card,
    CardBody,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleLocationSubmit, handlePublishLocation } from "../methods/methods.js";
import { useLocationData } from "../providers/LocationProvider.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";
import { faEye, faSave } from "@fortawesome/free-regular-svg-icons";

export function LocationMedia() {
    const { locationData, setLocationData } = useLocationData();
    const { accessToken } = useAuth();

    const [promoImageFile, setPromoImageFile] = useState(null);
    const [uploadedMediaFiles, setUploadedMediaFiles] = useState([]);

    useEffect(() => {
        if (locationData.promoImage) {
            setPromoImageFile(locationData.promoImage);
        }
        if (locationData.mediaFiles) {
            setUploadedMediaFiles(locationData.mediaFiles);
        }
    }, [locationData]);

    const formik = useFormik({
        initialValues: {
            promoImage: promoImageFile,
            mediaFiles: uploadedMediaFiles,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            promoImage: Yup.mixed()
                .nullable()
                .test('fileSize', 'Размер файла не должен превышать 50 МБ', value => !value || (value && value.size <= 50 * 1024 * 1024))
                .test('fileType', 'Файл должен быть изображением', value => !value || (value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type))),
            mediaFiles: Yup.array()
                .of(
                    Yup.mixed()
                        .nullable()
                        .test('fileSize', 'Размер файла не должен превышать 50 МБ', value => !value || (value && value.size <= 50 * 1024 * 1024))
                        .test('fileType', 'Неверный тип файла. Поддерживаются только изображения и видео', value => !value || (value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'].includes(value.type)))
                ),
        }),
        onSubmit: (values) => {
            const updatedData = {
                ...locationData,
                promoImage: values.promoImage,
                mediaFiles: values.mediaFiles,
            };
            handleLocationSubmit(updatedData, locationData, setLocationData, accessToken);
        },
    });

    const onDropPromo = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPromoImageFile(file);
            formik.setFieldValue('promoImage', file);
            setLocationData(prevData => ({
                ...prevData,
                promoImage: file
            }));
        }
    }, [formik, setLocationData]);

    const onDropMedia = useCallback((acceptedFiles) => {
        const newFiles = [...uploadedMediaFiles, ...acceptedFiles];
        setUploadedMediaFiles(newFiles);
        formik.setFieldValue('mediaFiles', newFiles);
        setLocationData(prevData => ({
            ...prevData,
            mediaFiles: newFiles,
        }));
    }, [uploadedMediaFiles, formik, setLocationData]);

    const handleRemovePromoImage = () => {
        setPromoImageFile(null);
        formik.setFieldValue('promoImage', null);
        setLocationData(prevData => ({
            ...prevData,
            promoImage: null,
        }));
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = uploadedMediaFiles.filter((_, i) => i !== index);
        setUploadedMediaFiles(updatedFiles);
        formik.setFieldValue('mediaFiles', updatedFiles);
        setLocationData(prevData => ({
            ...prevData,
            mediaFiles: updatedFiles
        }));
    };

    const { getRootProps: getPromoRootProps, getInputProps: getPromoInputProps } = useDropzone({
        onDrop: onDropPromo,
        accept: 'image/*',
        maxSize: 50 * 1024 * 1024
    });

    const { getRootProps: getMediaRootProps, getInputProps: getMediaInputProps } = useDropzone({
        onDrop: onDropMedia,
        accept: 'image/*,video/*',
        maxSize: 50 * 1024 * 1024,
        multiple: true
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Card shadow="none" className="w-full">
                <CardBody>
                    <div {...getPromoRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                        <input {...getPromoInputProps()} />
                        <p className="text-large font-bold">Главное изображение точки</p>
                        <p>Перетащите сюда изображение или нажмите, чтобы выбрать файл</p>
                    </div>
                </CardBody>
                {promoImageFile && (
                    <div className="gap-2 flex items-center justify-center mt-4">
                        <Popover placement="top" showArrow={true}>
                            <PopoverTrigger>
                                <Card shadow="sm" isPressable className="w-full max-w-[300px]">
                                    <CardBody className="overflow-visible p-0">
                                        <Image src={URL.createObjectURL(promoImageFile)} alt={promoImageFile.name}
                                               shadow="sm" radius="lg" width="100%"
                                               className="w-full object-cover h-[140px]" />
                                    </CardBody>
                                </Card>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2 flex gap-2">
                                    <Button color="danger" size="sm" onClick={handleRemovePromoImage}>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Удалить
                                    </Button>
                                    <Button color="primary" size="sm" onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = URL.createObjectURL(promoImageFile);
                                        link.download = promoImageFile.name;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}>
                                        <FontAwesomeIcon icon={faDownload} /> Скачать
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
                {formik.touched.promoImage && formik.errors.promoImage && (
                    <div className="text-danger text-tiny mt-2">{formik.errors.promoImage}</div>
                )}
            </Card>

            <Card shadow="none" className="w-full mt-4">
                <CardBody>
                    <div {...getMediaRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                        <input {...getMediaInputProps()} />
                        <p className="text-large font-bold">Медиафайлы</p>
                        <p>Перетащите сюда изображения или видео, или нажмите, чтобы выбрать файлы</p>
                    </div>
                </CardBody>
                {formik.touched.mediaFiles && formik.errors.mediaFiles && (
                    <div className="text-danger text-tiny mt-2">{formik.errors.mediaFiles}</div>
                )}
            </Card>

            {uploadedMediaFiles.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {uploadedMediaFiles.map((file, index) => {
                        const fileExtension = file.name.split('.').pop().toLowerCase();
                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
                        const isVideo = ['mp4', 'webm'].includes(fileExtension);

                        return (
                            <Popover key={index} placement="top" showArrow={true}>
                                <PopoverTrigger>
                                    <div className="relative cursor-pointer">
                                        {isImage ? (
                                            <Image src={URL.createObjectURL(file)} alt={file.name} shadow="sm" radius="lg" className="w-[140px] h-[140px] object-cover" />
                                        ) : isVideo ? (
                                            <video controls className="w-[140px] h-[140px]">
                                                <source src={URL.createObjectURL(file)} type={`video/${fileExtension}`} />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : null}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2 flex gap-2">
                                        <Button color="danger" size="sm" onClick={() => handleRemoveFile(index)}>
                                            <FontAwesomeIcon icon={faTrashAlt} /> Удалить
                                        </Button>
                                        <Button color="primary" size="sm" onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = URL.createObjectURL(file);
                                            link.download = file.name;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}>
                                            <FontAwesomeIcon icon={faDownload} /> Скачать
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        );
                    })}
                </div>
            )}

            <ButtonGroup color="primary" className="mt-4">
                <Button startContent={<FontAwesomeIcon icon={faSave} />} type="submit">Сохранить</Button>
                <Button
                    variant="bordered"
                    onPress={() => handlePublishLocation(locationData, accessToken)}
                    startContent={<FontAwesomeIcon icon={faEye} />}
                >
                    Опубликовать
                </Button>
            </ButtonGroup>
        </form>
    );
}
