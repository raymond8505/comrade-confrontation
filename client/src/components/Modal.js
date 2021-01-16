import React,{useRef,useState} from "react";

const Modal = ({children,
                buttonText,
                defaultState = 'closed',
                className='',
                buttonClassName='',
                title,
                theme  = 'default'
            }) => {

    const [open,setOpen] = useState(defaultState === 'open');
    
    
    
    return (<div className="Modal__wrap"><button className={`Modal__button ${buttonClassName}`} onClick={e=>{
            setOpen(!open);
        }}>{buttonText}</button>
        <dialog className={`modal Modal Modal--${theme} ${className}`} open={open}>
            <div class="modal__inner Modal__inner">
                <button className="Modal__close" onClick={e=>{
                    setOpen(false);
                }}>&times;</button>
                {title === undefined ? null : <h2 className="Modal__title">{title}</h2>}
                {children}
            </div>
        </dialog></div>);
}

export default Modal;