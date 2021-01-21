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
    
    
    
    return (<div className={`Modal__wrap ${className}`}><button className={`Modal__button ${buttonClassName}`} onClick={e=>{
            setOpen(!open);
        }}>{buttonText}</button>
        {open ? <dialog className={`Modal Modal--${theme} `} open>
            <div className="Modal__inner">
                <header className="Modal__header">
                    <button className="Modal__close" onClick={e=>{
                        setOpen(false);
                    }}>&times;</button>
                    {title === undefined ? null : <h2 className="Modal__title">{title}</h2>}
                </header>
                {children}
            </div>
        </dialog> : null}</div>);
}

export default Modal;