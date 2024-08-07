import { toast } from "react-hot-toast";
import { createQuest, publishQuest, createLocation, updateLocation } from "../api/api.js";

export const getLastPathPart = (str) => {
    return str.substring(str.lastIndexOf("/") + 1);
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const handleSubmit = async (values, questData, setQuestData, accessToken) => {
    const toastId = toast.loading("Сохранение...");

    try {
        const newValues = { ...questData, ...values };

        console.log("New values:", newValues);
        console.log("Old values:", values);
        console.log("Quest Data:", questData);

        const newQuestData = {
            quest_id: questData.questId,
            title: newValues.routeName,
            description: newValues.routeDescription,
            lang: newValues.routeLanguage,
            type: newValues.routeType,
            audioFile: newValues.routeAudioTeaser,
            promoImage: newValues.promoImage,
            locations: newValues.routeLocations,
        };

        console.log("New Quest Data:", newQuestData);

        await createQuest(newQuestData, accessToken);
        setQuestData(newValues);

        toast.success("Квест успешно обновлён", { id: toastId });

    } catch (error) {
        console.error("Error creating quest:", error);
        toast.error("Ошибка при обновлении квеста", { id: toastId });
    }
};

export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const handlePublishQuest = async (questData, accessToken) => {
    if (!questData.routeName || !questData.routeDescription || !questData.routeType || !questData.routeLanguage || !questData.promoImage) {
        toast.error('Все обязательные поля должны быть заполнены.');
        return;
    }
    const toastId = toast.loading("Сохранение...");

    try {
        const response = await publishQuest(questData.questId, accessToken);
        toast.success(`Квест "${questData.routeName}" успешно опубликован`, { id: toastId });
    } catch (error) {
        toast.error("Произошла ошибка при публикации квеста", { id: toastId });
    }
};

export const handleLocationSubmit = async (values, locationData, setLocationData, accessToken) => {
    const toastId = toast.loading("Сохранение точки...");

    try {
        const newValues = { ...locationData, ...values };

        console.log("New location values:", newValues);
        console.log("Old location values:", values);
        console.log("Location Data:", locationData);

        const newLocationData = {

            title: newValues.locationName,
            description: newValues.locationDescription,
            lang: newValues.locationLanguage,
            coords: newValues.locationCoordinates,
            promoImage: newValues.promoImage,

        };

        console.log("New Location Data:", newLocationData);

        if (!locationData.locationId) {
            // If there is no locationId, create a new location
            await createLocation(newLocationData, accessToken);
            toast.success("Точка успешно создана", { id: toastId });
        } else {
            // If locationId exists, update the existing location
            await updateLocation(locationData.locationId, newLocationData, accessToken);
            toast.success("Точка успешно обновлена", { id: toastId });
        }

        setLocationData(newValues);

    } catch (error) {
        console.error("Error creating or updating location:", error);
        toast.error("Ошибка при сохранении точки", { id: toastId });
    }
};
