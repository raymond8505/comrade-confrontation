import React,{useContext,useRef} from "react";

const Buzzer = ({onClick}) => {

    return (<div className="Buzzer">
        <button type="button" className="Buzzer__btn" onClick={onClick}><span>BUZZ</span></button>
    </div>);
}

export default Buzzer;