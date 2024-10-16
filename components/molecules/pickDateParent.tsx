import { useState } from "react";
import PickDate from "../atoms/pickDate";
import { useSession } from "next-auth/react";
import axios from "axios";

const PickDateParent = () => {
  const [selectedYear, setSelectedYear] = useState<number | string>("");
  const [selectedMonth, setSelectedMonth] = useState<number | string>("");
  const [selectedDay, setSelectedDay] = useState<number | string>("");
  const [confirmYear, setConfirmYear] = useState(false);
  const [confirmMonth, setConfirmMonth] = useState(false);
  const [confirmDay, setConfirmDay] = useState(false);

  // Get session data here
  const { data: session } = useSession();

  const todayYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 8 }, (_, i) => todayYear + i);

  const todayMonth = new Date().getMonth();
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
  if ((selectedMonth as string) === "Feb" && leapYear) {
    dayCount = 29;
  } else if ((selectedMonth as string) === "Feb" && !leapYear) {
    dayCount = 28;
  } else {
    dayCount = monthDayCount;
  }

  for (let days = 1; days <= dayCount; days++) {
    dayArray.push(days);
  }

  const AddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDay(true);

    // Create a Date object in local time
    const dateString = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    const date = new Date(dateString);
    console.log(date);
    // Convert to UTC string for saving to the database
    const utcDateString = date.toISOString();

    const test = {
      date: utcDateString, // Send the date in UTC format
      email: session?.user?.email, // Use the session variable here
    };

    try {
      const response = await axios.post("/api/users/meetdate", test);
      console.log("Date added:", response.data); // Optional: handle response
    } catch (error: any) {
      console.error("Error adding date:", error); // Optional: handle error
    }
  };

  return (
    <div>
      <h1>Select Date</h1>
      {!confirmYear ? (
        <PickDate
          name="year"
          array={yearsArray}
          value={selectedYear}
          onChange={setSelectedYear} // Update the selected year in parent state
        />
      ) : null}
      {selectedYear && !confirmYear ? (
        <button onClick={() => setConfirmYear(true)}>Confirm Year</button>
      ) : null}

      {/* Pick Month (Only show after year is selected) */}
      {selectedYear && confirmYear && !confirmMonth ? (
        <PickDate
          name="month"
          array={monthsArray}
          value={selectedMonth}
          onChange={setSelectedMonth} // Update the selected month in parent state
        />
      ) : null}
      {selectedMonth && !confirmMonth ? (
        <button onClick={() => setConfirmMonth(true)}>Confirm Month</button>
      ) : null}
      {selectedMonth && confirmMonth && !confirmDay ? (
        <PickDate
          name="day"
          array={dayArray}
          value={selectedDay}
          onChange={setSelectedDay} // Update the selected day in parent state
        />
      ) : null}
      {selectedDay && !confirmDay ? (
        <button onClick={AddDate}>Confirm Date</button>
      ) : null}
    </div>
  );
};

export default PickDateParent;
