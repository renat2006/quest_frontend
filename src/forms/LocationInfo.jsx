// LocationInfo.jsx

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {Autocomplete, AutocompleteItem, Button, ButtonGroup, Input, Textarea} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useLocationData } from "../providers/LocationProvider.jsx";
import {handleLocationSubmit, handlePublishQuest} from "../methods/methods.js";
import { languageList } from "../data/types.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faSave} from "@fortawesome/free-regular-svg-icons";

const LocationInfo = () => {
    const { locationData, setLocationData } = useLocationData();
    const navigate = useNavigate();
    const { locationName, locationLanguage, locationDescription, locationId } = locationData;

    const { accessToken } = useAuth();
    const [selectedLocationLanguage, setSelectedLocationLanguage] = useState(locationLanguage || '');

    const formik = useFormik({
        initialValues: {
            locationName: locationName || '',
            locationLanguage: selectedLocationLanguage,
            locationDescription: locationDescription || '',
        },
        validationSchema: Yup.object({
            locationName: Yup.string()
                .required("Название точки обязательно")
                .max(30, "Название точки не может превышать 30 символов"),
            locationLanguage: Yup.string().required("Язык точки обязателен"),
            locationDescription: Yup.string()
                .max(200, "Описание не может превышать 200 символов"),
        }),
        onSubmit: (values) => handleLocationSubmit(values, locationData, setLocationData, accessToken),
    });

    useEffect(() => {
        formik.setFieldValue('locationLanguage', selectedLocationLanguage);
    }, [selectedLocationLanguage]);

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div>
                <Input
                    label="Название"
                    placeholder="Введите название точки"
                    variant="bordered"
                    name="locationName"
                    value={formik.values.locationName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.locationName && Boolean(formik.errors.locationName)}
                    errorMessage={formik.touched.locationName && formik.errors.locationName ? formik.errors.locationName : null}
                />
            </div>
            <div>
                <Autocomplete
                    isRequired
                    label="Язык"
                    variant="bordered"
                    defaultItems={languageList}
                    placeholder="Выберите язык для точки"
                    selectedKey={selectedLocationLanguage}
                    onSelectionChange={setSelectedLocationLanguage}
                    errorMessage={formik.touched.locationLanguage && formik.errors.locationLanguage ? formik.errors.locationLanguage : null}
                    isInvalid={formik.touched.locationLanguage && Boolean(formik.errors.locationLanguage)}
                >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
            </div>
            <div>
                <Textarea
                    label="Описание"
                    placeholder="Введите описание точки"
                    variant="bordered"
                    name="locationDescription"
                    value={formik.values.locationDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.locationDescription && Boolean(formik.errors.locationDescription)}
                    errorMessage={formik.touched.locationDescription && formik.errors.locationDescription ? formik.errors.locationDescription : null}
                />
            </div>
            <ButtonGroup color="primary">
                <Button startContent={<FontAwesomeIcon icon={faSave}/>} type="submit">Сохранить</Button>
                <Button variant="bordered" onPress={() => handlePublishQuest(questData, accessToken)}
                        startContent={<FontAwesomeIcon icon={faEye}/>}>Опубликовать</Button>
            </ButtonGroup>
        </form>
    );
};

export default LocationInfo;
