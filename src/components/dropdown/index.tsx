import React, { FC, useState } from "react";
import Dropdown from "react-multilevel-dropdown";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
let DropdownItem = Dropdown.Item;
let DropdownSubmenu = Dropdown.Submenu;
let DropdownDivider = Dropdown.Divider;

interface IProps {
  title: string | React.ReactNode;
  buttonClassName?: string;
  menuClassName?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
  showDown?: boolean;
}
const DropdownWrapper: FC<IProps> = (props) => {
  let { title, buttonClassName, wrapperClassName, menuClassName, children } =
    props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Dropdown
      title={
        <div>
          <div className=" flex items-center">
            <span className="mt-[2px] sm:mr-[5px] text-white capitalize font-normal text-[17px]">
              {title}
            </span>

            {isOpen ? (
              <MdKeyboardArrowUp className="text-[20px] text-white" />
            ) : (
              <MdKeyboardArrowDown className="text-[20px] text-white" />
            )}
          </div>
        </div>
      }
      buttonClassName={` ${
        buttonClassName
          ? buttonClassName
          : "!bg-cBlue-special mm-btn w-[115px] ml-3  mb-1 !rounded-2xl !h-12"
      }`}
      menuClassName={`${menuClassName ? menuClassName : "!bg-cBlue-special"}`}
      wrapperClassName={`${wrapperClassName}`}
      onClick={handleToggle}
    >
      {children}
    </Dropdown>
  );
};

export { DropdownWrapper, DropdownItem, DropdownSubmenu, DropdownDivider };
