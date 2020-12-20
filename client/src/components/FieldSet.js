import React from "react";

const FieldSet = (props) => {
    
    const {
            legend = '', //the text to put in the legend tag
            extraClasses = [], //any extra classes to put on the fieldset tag
            children
        } = props;
    
    return (<fieldset className={`FieldSet ${extraClasses.join(' ')}`}>
                {legend === '' ? null : <legend>{legend}</legend>}
                {children}
            </fieldset>);
}

export default FieldSet;