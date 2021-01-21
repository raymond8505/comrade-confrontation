import React,{useState,useContext, version} from "react";
import { GameContext } from "../contexts/gameContext";
import Modal from './Modal';

const AboutInfo = ({}) => {

    const [modalOpen,setModalOpen] = useState(false);
    const {versionInfo} = useContext(GameContext);

    return (
        <Modal 
            buttonText="About"
            className="AboutInfo"
            title="Comrade Confrontation"
            >
            <div dangerouslySetInnerHTML={{__html : versionInfo}}></div>
        </Modal>
    );
}

export default AboutInfo;