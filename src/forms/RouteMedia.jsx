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

export function RouteMedia() {
    const [files, setFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);

    const formik = useFormik({
        initialValues: {
            mediaFiles: [],
        },
        validationSchema: Yup.object({
            mediaFiles: Yup.array()
                .min(1, 'Необходимо добавить хотя бы один медиа-файл')
                .of(
                    Yup.mixed()
                        .test('fileSize', 'Размер файла не должен превышать 50 МБ',
                            value => !value || (value && value.size <= 50 * 1024 * 1024))
                        .test('fileType', 'Файл должен быть изображением или видео',
                            value => !value || (value && ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(value.type))),
                ),
        }),
        onSubmit: values => {
            console.log(values);
        },
    });

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        const validFiles = acceptedFiles.filter(file =>
            ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type) &&
            file.size <= 50 * 1024 * 1024
        );

        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        formik.setFieldValue('mediaFiles', updatedFiles);

        if (fileRejections.length > 0) {
            const errors = fileRejections.map(rej => {
                const errorMessage = rej.errors.map(e => {
                    if (e.code === 'file-too-large') {
                        return 'Файл превышает допустимый размер 50 МБ';
                    } else if (e.code === 'file-invalid-type') {
                        return 'Неверный тип файла. Поддерживаются только изображения и видео';
                    }
                    return e.message;
                }).join(', ');
                return { file: rej.file, error: errorMessage };
            });
            setFileErrors(errors);
        } else {
            setFileErrors([]);
        }
    }, [files, formik]);

    const handleRemoveFile = (file) => {
        const updatedFiles = files.filter(f => f !== file);
        setFiles(updatedFiles);
        formik.setFieldValue('mediaFiles', updatedFiles);
        setFileErrors(fileErrors.filter(err => err.file !== file));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': []
        },
        maxSize: 50 * 1024 * 1024
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <Card shadow="none">
                <CardBody>
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p>Перетащите сюда файлы или нажмите, чтобы выбрать файлы</p>
                    </div>
                    {fileErrors.length > 0 && (
                        <div className="text-danger text-tiny">
                            {fileErrors.map((error, index) => (
                                <div key={index}>{error.file.name}: {error.error}</div>
                            ))}
                        </div>
                    )}
                </CardBody>
                {formik.touched.mediaFiles && formik.errors.mediaFiles && (
                    <div className="text-danger text-tiny mt-2">{formik.errors.mediaFiles}</div>
                )}
            </Card>

            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {files.map((file, index) => (
                    <Popover placement="top" key={index} showArrow={true}>
                        <PopoverTrigger>
                            <Card shadow="sm" isPressable>
                                <CardBody className="overflow-visible p-0">
                                    {file.type.startsWith('image') && (
                                        <Image src={URL.createObjectURL(file)} alt={file.name} shadow="sm" radius="lg" width="100%" className="w-full object-cover h-[140px]" />
                                    )}
                                    {file.type.startsWith('video') && (
                                        <video controls src={URL.createObjectURL(file)} width="100%" className="w-full h-[140px]" />
                                    )}
                                </CardBody>
                                <CardFooter className="text-small justify-between">
                                    <p className="line-clamp-1 font-thin text-gray-500 text-tiny mb-2">{file.name}</p>
                                </CardFooter>
                            </Card>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2 flex gap-2">
                                <Button color="danger" size="sm" onClick={() => handleRemoveFile(file)}>
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
                ))}
            </div>

            <Button type="submit" color="primary">Сохранить</Button>
        </form>
    );
}
