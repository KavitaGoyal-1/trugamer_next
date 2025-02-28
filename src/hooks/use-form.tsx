import { useState } from 'react';


export const useForm = ( initialState = {} ):any => {
    
    const [values, setValues] = useState( initialState );

    const reset = () => {
        setValues( initialState );
    }

    const handleImputChange = ({ target }:any) => {
        setValues({
            ...values,
            [ target.name ] : target.value 
        });
    }

    return [ values, handleImputChange, reset ];
}