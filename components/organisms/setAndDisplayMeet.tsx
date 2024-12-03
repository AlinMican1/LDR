import { userFetchData } from "@/lib/userFetchData";
import Modal from "../molecules/modal";
import PickDateParent from "../molecules/pickDateParent";
import DisplayMeetDate from "../atoms/displayMeetDate";

interface SetAndDisplayMeetProps {
  meetDate: string | null | undefined;
}

const SetAndDisplayMeet = ({ meetDate }: SetAndDisplayMeetProps) => {
  let tur = true;

  return (
    <div>
      {meetDate ? (
        <div>
          <DisplayMeetDate meetDate={meetDate} />
        </div>
      ) : (
        <Modal buttonName="Set Meet Date">
          <PickDateParent />
        </Modal>
      )}
    </div>
  );
};
export default SetAndDisplayMeet;
