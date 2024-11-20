import { userFetchData } from "@/lib/userFetchData";
import Modal from "../molecules/modal";
import PickDateParent from "../molecules/pickDateParent";
const HomeUnlocked = () => {
  const { user } = userFetchData();
  let tur = true;

  return (
    <div>
      {tur ? (
        <Modal buttonName="Set Meet Date">
          <PickDateParent />
        </Modal>
      ) : (
        <p>{user?.meetDate}</p>
      )}
    </div>
  );
};
export default HomeUnlocked;
