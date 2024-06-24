import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image} from "@nextui-org/react";
import {faHouse, faPlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function QuestInfoModal({isOpen, onOpenChange}) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} placement="auto"
               scrollBehavior="inside" isKeyboardDismissDisabled={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1"><h3 className="font-bold text-2xl">Кремль</h3><h4
                            className="text-sm text-slate-500">Казань, Кремль, а/я 522.</h4></ModalHeader>
                        <ModalBody>
                            <p className="">
                                Древнейшая часть и цитадель Казани, комплекс архитектурных, исторических и
                                археологических памятников.
                                Сегодня на его территории действуют и мечеть, и православный храм.
                                В 2000 году Казанскому кремлю присвоили статус объекта Всемирного наследия ЮНЕСКО.
                            </p>
                            <div className="flex gap-2 items-center justify-center w-full">
                                <Button color="primary" className="flex-1"
                                        startContent={<FontAwesomeIcon style={{width: "16px", height: "16px"}}
                                                                       icon={faPlay}/>}>
                                    Слушать
                                </Button>
                                <Button color="default" className="flex-1">
                                    Читать
                                </Button>
                            </div>
                            <div className="flex justify-center max-w-[400px]">
                                <Image


                                    src="https://kuda-kazan.ru/uploads/16aabdeb496192e6d8ddd391118f6de8.jpg"

                                    alt="Kremlin"

                                    className="h-[200px] w-[400px] object-cover"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Понятно
                            </Button>
                            {/*<Button color="primary" onPress={onClose}>*/}
                            {/*    д*/}
                            {/*</Button>*/}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
