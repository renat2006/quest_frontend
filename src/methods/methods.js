import {toast} from "react-hot-toast";
import {createQuest} from "../api/api.js";
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
            promoImage: newValues.promoImage
        };

        console.log("New Quest Data:", newQuestData);

        await createQuest(newQuestData, accessToken);

        toast.success("Квест успешно обновлён", { id: toastId });

        setQuestData(newValues);
    } catch (error) {
        console.error("Error creating quest:", error);
        toast.error("Ошибка при обновлении квеста", { id: toastId });
    }
};