import Lottie from "react-lottie-player";
import catJson from './cat.json'

export default function Cat() {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24">
      <Lottie loop animationData={catJson} play />
    </div>
  );
}
