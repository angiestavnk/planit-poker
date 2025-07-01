import { useEffect, useState } from "react";
import './ParticipantCard.css'

type Props = {
  name: string;
  vote: any;
  revealed: boolean;
}

export const ParticipantCard = ({ name, vote, revealed }: Props) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => setFlipped(true), 300);
      return () => clearTimeout(timer);
    } else {
      setFlipped(false);
    }
  }, [revealed]);

  return (
    <div
      className="w-24 h-32 perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full card-inner ${flipped ? "flipped" : ""}`}>
        <div className="absolute w-full h-full bg-gray-300 rounded shadow flex flex-col justify-center items-center card-face">
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-3xl mt-4">?</div>
        </div>

        <div className="absolute w-full h-full bg-blue-700 text-white rounded shadow flex flex-col justify-center items-center card-face card-back">
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-3xl mt-4">{vote}</div>
        </div>
      </div>
    </div>
  );
};
