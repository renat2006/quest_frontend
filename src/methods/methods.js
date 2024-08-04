import {toast} from "react-hot-toast";
import {createQuest, publishQuest} from "../api/api.js";
import {useQuest} from "../providers/RouteProvider.jsx";
import {useAuth} from "../providers/AuthProvider.jsx";

export const getLastPathPart = (str) => {
    return str.substring(str.lastIndexOf("/") + 1)
}
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const handleSubmit = async (values, questData, setQuestData, accessToken) => {
    const toastId = toast.loading("Сохранение...");

    try {
        const newValues = {...questData, ...values};

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
            promoImage: newValues.promoImage
        };

        console.log("New Quest Data:", newQuestData);

        await createQuest(newQuestData, accessToken);
        setQuestData(newValues);

        toast.success("Квест успешно обновлён", {id: toastId});


    } catch (error) {
        console.error("Error creat ing quest:", error);
        toast.error("Ошибка при обновлении квеста", {id: toastId});
    }
};
export const handlePublishQuest = async (formik, questData, selectedRouteType, selectedRouteLanguage, promoImage, accessToken) => {
    if (!formik.values.routeName || !formik.values.routeDescription || !selectedRouteType || !selectedRouteLanguage || !promoImage) {
        toast.error('Все обязательные поля должны быть заполнены.');
        return;
    }
    const toastId = toast.loading("Сохранение...");

    try {
        const response = await publishQuest(questData.questId, accessToken);
        toast.success(response.message, {id: toastId});
    } catch (error) {
        toast.error(error.message, {id: toastId});
    }
};