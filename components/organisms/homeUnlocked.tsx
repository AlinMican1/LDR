import { userFetchData } from "@/lib/userFetchData";
import Modal from "../molecules/modal";
import PickDateParent from "../molecules/pickDateParent";
const HomeUnlocked = () => {
  const { user } = userFetchData();
  let tur = true;
  return (
    <div>
      {tur ? (
        <Modal>
          <PickDateParent />
        </Modal>
      ) : (
        <p>{user?.meetDate}</p>
      )}
    </div>
  );
};
export default HomeUnlocked;
