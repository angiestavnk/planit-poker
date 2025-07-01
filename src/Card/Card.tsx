
type CardProps = {
  value: string | number;
  selected?: boolean;
  onVote?: (val: number | string) => void;
  revealed?: boolean;
  disabled?: boolean;
};

const Card = ({ value, selected = false, onVote, disabled, revealed }: CardProps) => {
  return (
    <button
      onClick={() => onVote && onVote(value)}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={`w-24 h-32 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center text-3xl font-bold transition transform hover:-translate-y-1
        ${selected ? 'bg-blue-700 text-white' : 'bg-white text-blue-900'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'}
        ${revealed ? 'scale-110' : ''}
        `}
    >
      {value === "coffee" ? "🍵" : value}
    </button>
  );
};

export default Card;
