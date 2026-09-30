import {
  useEffect,
  useRef,
  useState,
} from "react";


interface Option {
  value: string;
  label: string;
}


interface Props {
  id: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}


function Dropdown({
  id,
  value,
  options,
  onChange,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find(
      (option) =>
        option.value === value
    ) ?? options[0];


  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  function selectOption(
    optionValue: string
  ) {
    onChange(optionValue);
    setOpen(false);
  }


  return (
    <div
      className="dropdown"
      ref={dropdownRef}
    >
      <button
        id={id}
        className="dropdown-button"
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          {selectedOption.label}
        </span>

        <span
          className={
            open
              ? "dropdown-arrow open"
              : "dropdown-arrow"
          }
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="dropdown-menu"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map(
            (option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={
                  option.value === value
                }
                className={
                  option.value === value
                    ? "dropdown-option selected"
                    : "dropdown-option"
                }
                onClick={() =>
                  selectOption(
                    option.value
                  )
                }
              >
                {option.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}


export default Dropdown;