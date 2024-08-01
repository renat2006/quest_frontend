import {toast} from "react-hot-toast";
import {createQuest} from "../api/api.js";

export const getLastPathPart = (str) => {
    return str.substring(str.lastIndexOf("/") + 1)
}
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// export async function saveFormikData(values, accessToken) {
//     const toastId = toast.loading("Сохранение...");
//     try {
//         const questData = {
//             quest_id: values.questId,
//             title: values.routeName,
//             description: values.routeDescription,
//             lang: values.routeLanguage,
//             type: values.routeType,
//             audioFile: values.routeAudioTeaser
//         };
//
//         await createQuest(questData, accessToken);
//
//         toast.success("Квест успешно обновлён", {id: toastId});
//
//         setQuestData({
//             ...questData,
//             routeAudioTeaser: audioFile,
//         });
//
//     } catch (error) {
//         console.error("Error creating quest:", error);
//         toast.error("Ошибка при обновлении квеста", {id: toastId});
//     }
// }
//
// ,