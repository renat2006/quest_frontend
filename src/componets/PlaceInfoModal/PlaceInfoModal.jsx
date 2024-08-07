import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@nextui-org/react";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {languageList} from "../../data/types.js";


// Utility function to get the language label in Russian
const getLanguageLabel = (languageCode) => {
    const language = languageList.find((lang) => lang.value === languageCode);
    return language ? language.label : languageCode; // Default to language code if not found
};

export default function QuestInfoModal({ isOpen, onOpenChange, point }) {
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
                                >
                                    Слушать
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
