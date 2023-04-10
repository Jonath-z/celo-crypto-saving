import React, { HTMLProps, FC } from "react";
import { BsDot } from "react-icons/bs";

interface IButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, "type"> {
  icon?: JSX.Element;
  isActive?: boolean;
}

const Button: FC<IButtonProps> = ({ icon, isActive, ...props }) => {
  return (
    <button {...props}>
      {isActive && <BsDot />}
      {icon}
    </button>
  );
};

export default Button;
