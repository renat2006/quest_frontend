import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {handleSubmit} from "../methods/methods.js";
import {useQuest} from "../providers/RouteProvider.jsx";
import {useAuth} from "../providers/AuthProvider.jsx";

export function RouteMedia() {
    const [promoImage, setPromoImage] = useState("");
    const [fileError, setFileError] = useState("");
    const {questData, setQuestData} = useQuest();
    const {accessToken} = useAuth();
    const formik = useFormik({
        initialValues: {
            promoImage: "",
        },
        validationSchema: Yup.object({
            promoImage: Yup.mixed()
                .test('fileSize', 'Размер файла не должен превышать 50 МБ', value => !value || (value && value.size <= 50 * 1024 * 1024))
                .test('fileType', 'Файл должен быть изображением', value => !value || (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))),
        }),
        onSubmit: (values) => handleSubmit({...questData, promoImage}, questData.questId, accessToken, setQuestData,questData.routeAudioTeaser),
    });

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPromoImage(file);
            formik.setFieldValue('promoImage', file);
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
    }, [formik]);

    const handleRemoveFile = () => {
        setPromoImage("");
        formik.setFieldValue('promoImage', "");
        setFileError("");
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxSize: 50 * 1024 * 1024
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Card shadow="none" className="w-full">
                <CardBody>
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                        <input {...getInputProps()} />
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

            {promoImage && (
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                    <Popover placement="top" showArrow={true}>
                        <PopoverTrigger>
                            <Card shadow="sm" isPressable>
                                <CardBody className="overflow-visible p-0">
                                    <Image src={URL.createObjectURL(promoImage)} alt={promoImage.name} shadow="sm" radius="lg" width="100%" className="w-full object-cover h-[140px]" />
                                </CardBody>
                                <CardFooter className="text-small justify-between">
                                    <p className="line-clamp-1 font-thin text-gray-500 text-tiny mb-2">{promoImage.name}</p>
                                </CardFooter>
                            </Card>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2 flex gap-2">
                                <Button color="danger" size="sm" onClick={handleRemoveFile}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Удалить
                                </Button>
                                <Button color="primary" size="sm" onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(promoImage);
                                    link.download = promoImage.name;
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

            <Button type="submit" color="primary">Сохранить</Button>
        </form>
    );
}
