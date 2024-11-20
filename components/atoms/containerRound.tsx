import "./containerRound.css";

interface ContainerRoundProps {
  children: React.ReactNode;
}
// A box with round edges that starts at the bottom of the page and fills upwards as we add children.
const ContainerRound = ({ children }: ContainerRoundProps) => {
  return (
    <div role="region" className="roundBox">
      {children}
    </div>
  );
};
export default ContainerRound;
