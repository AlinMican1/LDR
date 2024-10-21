import { useState } from "react";
import PickDate from "../atoms/pickDate";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../atoms/customButton";

const PickDateParent = () => {
  const [selectedYear, setSelectedYear] = useState<number | string>("");
  const [selectedMonth, setSelectedMonth] = useState<number | string>("");
  const [selectedDay, setSelectedDay] = useState<number | string>("");
  const [confirmYear, setConfirmYear] = useState(false);
  const [confirmMonth, setConfirmMonth] = useState(false);
  const [confirmDay, setConfirmDay] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const todayYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 8 }, (_, i) => todayYear + i);

  const todayMonth = new Date().getMonth();
  const todayDay = new Date().getDate();
  const myMap = new Map<number, string>([
    [1, "Jan"],
    [2, "Feb"],
    [3, "Mar"],
    [4, "Apr"],
    [5, "May"],
    [6, "Jun"],
    [7, "Jul"],
    [8, "Aug"],
    [9, "Sep"],
    [10, "Oct"],
    [11, "Nov"],
    [12, "Dec"],
  ]);

  const monthsArray: string[] = [];
  let i = 1;
  if (selectedYear == todayYear) {
    i = todayMonth + 1;
  }
  for (i; i <= 12; i++) {
    monthsArray.push(myMap.get(i) as string);
  }

  // This part is to get the number of days per month
  const dayArray: number[] = [];
  const leapYear = (selectedYear as number) % 4 === 0;
  const monthsWith31Days = ["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"];
  const monthDayCount = monthsWith31Days.includes(selectedMonth as string)
    ? 31
    : 30;

  let dayCount = 0;
  let days = 1;
  if ((selectedMonth as string) === "Feb" && leapYear) {
    dayCount = 29;
  } else if ((selectedMonth as string) === "Feb" && !leapYear) {
    dayCount = 28;
  } else {
    dayCount = monthDayCount;
  }
  //doing todayMonth + 1 because date uses 0 index
  if (
    selectedMonth === myMap.get(todayMonth + 1) &&
    todayYear === selectedYear
  ) {
    days = todayDay;
  }

  for (days; days <= dayCount; days++) {
    dayArray.push(days);
  }

  const AddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDay(true);

    const dateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    const dateData = {
      date: dateString,
      email: session?.user?.email,
    };

    try {
      const response = await axios.post("/api/users/meetdate", dateData);
      if (response.status == 200) {
        router.refresh();
      }
    } catch (error: any) {}
  };

  return (
    <div>
      {!confirmYear ? (
        <PickDate
          name="Year"
          array={yearsArray}
          value={selectedYear}
          onChange={setSelectedYear} // Update the selected year in parent state
        />
      ) : null}
      {selectedYear && !confirmYear ? (
        <IconButton onclick={() => setConfirmYear(true)} icon={faCheck} />
      ) : // <button onClick={() => setConfirmYear(true)}>Confirm Year</button>
      null}

      {/* Pick Month (Only show after year is selected) */}
      {selectedYear && confirmYear && !confirmMonth ? (
        <PickDate
          name="Month"
          array={monthsArray}
          value={selectedMonth}
          onChange={setSelectedMonth} // Update the selected month in parent state
        />
      ) : null}
      {selectedMonth && !confirmMonth ? (
        <IconButton onclick={() => setConfirmMonth(true)} icon={faCheck} />
      ) : null}
      {selectedMonth && confirmMonth && !confirmDay ? (
        <PickDate
          name="Day"
          array={dayArray}
          value={selectedDay}
          onChange={setSelectedDay} // Update the selected day in parent state
        />
      ) : null}
      {selectedDay && !confirmDay ? (
        <IconButton onclick={AddDate} icon={faCheck} />
      ) : // <button onClick={AddDate}>Confirm Date</button>
      null}
      {confirmDay ? (
        <h1 className="loadMessage"> LOADING PLEASE WAIT</h1>
      ) : null}
    </div>
  );
};

export default PickDateParent;
