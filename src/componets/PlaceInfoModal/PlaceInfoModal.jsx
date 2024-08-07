import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@nextui-org/react";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { languageList } from "../../data/types.js";


const getLanguageLabel = (languageCode) => {
    const language = languageList.find((lang) => lang.value === languageCode);
    return language ? language.label : languageCode;
};


const synthesizeTextToSpeech = async (text) => {
    const apiKey = import.meta.env.VITE_AIMYVOICE_API;
    const url = "https://aimyvoice.com/api/v1/synthesize";
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "api-key": apiKey,
    };

    const payload = new URLSearchParams();
    payload.append("text", text);

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: payload,
    });

    if (!response.ok) {
        throw new Error("Failed to generate audio");
    }

    return response.blob(); // Return the audio as a blob
};

export default function QuestInfoModal({ isOpen, onOpenChange, point }) {
    const [audioUrl, setAudioUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePlayAudio = async () => {
        if (!point.description) return;
        setLoading(true);
        try {
            const audioBlob = await synthesizeTextToSpeech(point.description);
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioUrl(audioURL);
        } catch (error) {
            console.error("Error fetching audio:", error);
            alert("Ошибка при загрузке аудио. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    if (!point) return null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            placement="auto"
            scrollBehavior="inside"
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="font-bold text-2xl">{point.name}</h3>
                            <h4 className="text-sm text-slate-500">{getLanguageLabel(point.language)}</h4>
                        </ModalHeader>
                        <ModalBody>
                            <p className="">{point.description}</p>
                            <div className="flex gap-2 items-center justify-center w-full">
                                <Button
                                    color="primary"
                                    className="flex-1"
                                    startContent={<FontAwesomeIcon style={{ width: "16px", height: "16px" }} icon={faPlay} />}
                                    onClick={handlePlayAudio}
                                    isDisabled={loading} // Disable button while loading
                                >
                                    {loading ? 'Загрузка...' : 'Слушать'}
                                </Button>
                                <Button color="default" className="flex-1">
                                    Читать
                                </Button>
                            </div>
                            <div className="flex justify-center max-w-[400px]">
                                <Image
                                    src={point.promoUrl}
                                    alt={point.name}
                                    className="h-[200px] w-[400px] object-cover"
                                />
                            </div>
                            {audioUrl && (
                                <audio controls src={audioUrl} className="w-full mt-4">
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Понятно
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
