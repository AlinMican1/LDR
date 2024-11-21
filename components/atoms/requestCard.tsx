import "./requestCard.css";

interface RequestCardProps {
  children: React.ReactNode;
}

const RequestCard = ({ children }: RequestCardProps) => {
  return <div className={`${"roboto-font"} ${"requestCard"}`}>{children}</div>;
};
export default RequestCard;
