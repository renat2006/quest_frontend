import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Avatar } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CustomAudioPlayer from "../CustomAudioPlayer/CustomAudioPlayer.jsx";
import Stories from 'react-insta-stories';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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

    return response.blob();
};

export default function QuestInfoModal({ isOpen, onOpenChange, point }) {
    const [audioUrl, setAudioUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [showStories, setShowStories] = useState(false);
    const [imageMediaUrls, setImageMediaUrls] = useState([]);
    const [videoMediaUrls, setVideoMediaUrls] = useState([]);

    useEffect(() => {
        const images = [];
        const videos = [];

        point.mediaFiles?.forEach((file) => {
            if (file.type.startsWith("image/")) {
                images.push(URL.createObjectURL(file));
            } else if (file.type.startsWith("video/")) {
                videos.push(URL.createObjectURL(file));
            }
        });

        setImageMediaUrls(images);
        setVideoMediaUrls(videos);
    }, [point.mediaFiles]);

    const handlePlayAudio = async () => {
        if (!point.description) return;
        setLoading(true);
        try {
            const audioBlob = await synthesizeTextToSpeech(point.description);
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioUrl(audioURL);
            setIsListening(true);
            setAutoPlay(true);
        } catch (error) {
            console.error("Error fetching audio:", error);
            alert("Ошибка при загрузке аудио. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handleReadText = () => {
        setIsListening(true);
        setAutoPlay(false);
    };

    const handleShowStories = () => {
        setShowStories(true);
    };

    const closeStories = () => {
        setShowStories(false);
    };

    const renderMedia = (url) => (
        <Image src={url} alt="Media" className="h-[200px] w-[400px] object-cover" />
    );

    const renderStories = () => {
        const stories = videoMediaUrls.map(url => ({
            url,
            type: 'video'
        }));

        return (
            <Stories
                stories={stories}
                defaultInterval={1500}
                width="100%"
                height="90vh"
                loop
                keyboardNavigation
            />
        );
    };

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
                        <ModalHeader>
                            {!isListening ? (
                                <div className="flex  items-center gap-3  w-full">
                                    {videoMediaUrls.length > 0 && (
                                        <Avatar
                                            isBordered
                                            color="primary"
                                            size="md"

                                            onClick={handleShowStories}
                                            src={URL.createObjectURL(point.promoImage)}
                                            className="cursor-pointer w-12 h-12"
                                        />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-2xl">{point.name}</h3>
                                        <h4 className="text-sm text-slate-500">{getLanguageLabel(point.language)}</h4>
                                    </div>

                                </div>
                            ) : (
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="h-3 cursor-pointer"
                                    onClick={() => setIsListening(false)}
                                />
                            )}
                        </ModalHeader>
                        <ModalBody>
                            {!isListening ? (
                                <>
                                    <p className="line-clamp-3">{point.description}</p>
                                    <div className="flex gap-2 items-center justify-center w-full mt-4">
                                        <Button
                                            color="primary"
                                            className="flex-1"
                                            startContent={<FontAwesomeIcon style={{ width: "16px", height: "16px" }} icon={faPlay} />}
                                            onClick={handlePlayAudio}
                                            isDisabled={loading}
                                        >
                                            {loading ? "Загрузка..." : "Слушать"}
                                        </Button>
                                        <Button
                                            color="default"
                                            className="flex-1"
                                            onClick={handleReadText}
                                        >
                                            Читать
                                        </Button>
                                    </div>
                                    <div className="w-full mt-4">
                                        {imageMediaUrls.length > 0 ? (
                                            <Swiper spaceBetween={5} slidesPerView={1.07}>
                                                {imageMediaUrls.map((url, index) => (
                                                    <SwiperSlide key={index}>
                                                        {renderMedia(url)}
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <Image
                                                src={URL.createObjectURL(point.promoImage)}
                                                alt={point.name}
                                                className="h-[200px] w-[400px] object-cover"
                                            />
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{point.description}</p>
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            {!isListening ? (
                                <Button color="primary" onPress={onClose}>
                                    Понятно
                                </Button>
                            ) : (
                                audioUrl && (
                                    <div className="flex flex-col items-center rounded-lg w-full">
                                        <CustomAudioPlayer audioSrc={audioUrl} autoPlay={autoPlay} />
                                    </div>
                                )
                            )}
                        </ModalFooter>

                        {/* Stories Modal */}
                        {showStories && (
                            <Modal
                                isOpen={showStories}
                                onOpenChange={closeStories}
                                placement="center"
                                className=""
                                aria-labelledby="story-modal"
                                closeButton

                            >
                                <ModalContent>
                                    <ModalHeader>

                                    </ModalHeader>
                                    {renderStories()}
                                </ModalContent>
                            </Modal>
                        )}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
