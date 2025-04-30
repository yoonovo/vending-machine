type ButtonBoxProp = {
  id: string;
  buttons: {
    title: string;
    onClick: () => void;
    isVisible?: boolean;
    isHighlight?: boolean;
  }[];
};

const ButtonBox = ({ id, buttons }: ButtonBoxProp) => {
  return (
    <div className="button-box">
      {buttons.map(
        ({ title, onClick, isVisible = true, isHighlight = false }, idx) =>
          isVisible && (
            <button
              key={`btn_${id}_${idx}`}
              className={`button ${isHighlight ? "highlight" : ""}`}
              onClick={onClick}
            >
              {title}
            </button>
          )
      )}
    </div>
  );
};

export default ButtonBox;
