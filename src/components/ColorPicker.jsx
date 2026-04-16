const colors = ["#003049", "#d62828", "#f77f00", "#fcbf49", "#2a9d8f"];

const ColorPicker = ({ selectedColor, onChange }) => {
  return (
    <div className="flex gap-2">
      {colors.map((color, i) => (
        <div
          key={i}
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
            selectedColor === color
              ? "border-black scale-110"
              : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
export default ColorPicker;
