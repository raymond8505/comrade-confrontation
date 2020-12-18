import React,{useState,useContext, version} from "react";
import { GameContext } from "../contexts/gameContext";

const AboutInfo = ({}) => {

    const [modalOpen,setModalOpen] = useState(false);
    const {versionInfo} = useContext(GameContext);

    return (<div className="AboutInfo">
        <button type="button" className={`AboutInfo__btn${versionInfo !== '' ? ' AboutInfo--show' : ''}`} onClick={e=>{

            setModalOpen(true);

        }}>About</button>

        <dialog className="modal" open={modalOpen}>
            <div className="modal__inner AboutInfo__inner">
                <button type="button" className="btn--blank AboutInfo__close-modal" onClick={e=>{
                        console.log('close',modalOpen);

                        setModalOpen(false);
                    }}>
                    <span className="fas fa-times-circle"></span>
                </button>
                <div dangerouslySetInnerHTML={{__html : versionInfo}}></div>
            </div>
        </dialog>
    </div>);
}

export default AboutInfo;