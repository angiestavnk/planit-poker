
type CardProps = {
  value: string | number;
  onClick?: () => void;
};

const Card = ({ value, onClick }: CardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-24 h-32 bg-white rounded-xl shadow-md hover:shadow-lg flex items-center justify-center text-3xl font-bold transition transform hover:-translate-y-1"
    >
      {value === "teacup" ? "🍵" : value}
    </button>
  );
};

export default Card;
