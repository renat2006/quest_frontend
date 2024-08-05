import {Button, ButtonGroup} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faSave} from "@fortawesome/free-regular-svg-icons";
import {handlePublishQuest} from "../../methods/methods.js";
import React from "react";
import {useQuest} from "../../providers/RouteProvider.jsx";
import {useAuth} from "../../providers/AuthProvider.jsx";

const SaveAndPublishButtonGroup = () => {
    const {questData} = useQuest();

    const {accessToken} = useAuth();
    return (<ButtonGroup color="primary">
        <Button startContent={<FontAwesomeIcon icon={faSave}/>} type="submit">Сохранить</Button>
        <Button variant="bordered" onPress={() => handlePublishQuest(questData, accessToken)}
                startContent={<FontAwesomeIcon icon={faEye}/>}>Опубликовать</Button>
    </ButtonGroup>)
}
export default SaveAndPublishButtonGroup