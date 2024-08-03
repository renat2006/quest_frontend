import {toast} from "react-hot-toast";
import {createQuest} from "../api/api.js";
import {useQuest} from "../providers/RouteProvider.jsx";

export const getLastPathPart = (str) => {
    return str.substring(str.lastIndexOf("/") + 1)
}
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const handleSubmit = async (values, accessToken) => {
    const toastId = toast.loading("Сохранение...");
    const {questData, setQuestData} = useQuest();
    try {
        const newQuestData = {
            quest_id: questData.quest_id,
            title: values.routeName,
            description: values.routeDescription,
            lang: values.routeLanguage,
            type: values.routeType,
            audioFile: values.routeAudioTeaser,
            promoImage: values.promoImage
        };
        console.log("123", newQuestData)

        await createQuest(newQuestData, accessToken);

        toast.success("Квест успешно обновлён", {id: toastId});

        setQuestData({...questData, ...values});


    } catch (error) {
        console.error("Error creating quest:", error);
        toast.error("Ошибка при обновлении квеста", {id: toastId});
    }
};
