import { userFetchData } from "@/lib/userFetchData";
import Modal from "../molecules/modal";
import PickDateParent from "../molecules/pickDateParent";
import DisplayMeetDate from "../atoms/displayMeetDate";

interface SetAndDisplayMeetProps {
  meetDate: string | null | undefined;
  test: () => void;
}

const SetAndDisplayMeet = ({ meetDate, test }: SetAndDisplayMeetProps) => {
  let tur = true;

  return (
    <div>
      {meetDate ? (
        <div>
          <DisplayMeetDate meetDate={meetDate} />
        </div>
      ) : (
        <Modal buttonName="Set Meet Date">
          <PickDateParent test={test} />
        </Modal>
      )}
    </div>
  );
};
export default SetAndDisplayMeet;
