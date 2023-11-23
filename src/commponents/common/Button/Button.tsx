import React, {ReactNode} from 'react';

interface ButtonInterface {
    children: ReactNode;
    onClick?: () => void;
}

const Button = ({children, onClick}: ButtonInterface) => {
    return (
        <button
            className="py-2 px-3 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;