import { CircleLoader } from "react-spinners";
export default function Loading() {
  return (
    <div className="LoadingScreen">
      <CircleLoader color="#000000" speedMultiplier={1} loading={true} />
    </div>
  );
}
