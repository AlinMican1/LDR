import { userFetchData } from "@/lib/userFetchData";
import Modal from "../molecules/modal";
import PickDateParent from "../molecules/pickDateParent";
import DisplayMeetDate from "../atoms/displayMeetDate";

interface SetAndDisplayMeetProps {
  meetDate: string | null | undefined;
  addDate: () => void;
}

const SetAndDisplayMeet = ({ meetDate, addDate }: SetAndDisplayMeetProps) => {
  return (
    <div>
      {meetDate ? (
        <div>
          <DisplayMeetDate meetDate={meetDate} />
        </div>
      ) : (
        <Modal buttonName="Set Meet Date">
          <PickDateParent addDate={addDate} />
        </Modal>
      )}
    </div>
  );
};
export default SetAndDisplayMeet;
