import React from "react";

interface DisplayMeetDateProps {
  meetDate: string | null | undefined;
}
const DisplayMeetDate = ({ meetDate }: DisplayMeetDateProps) => {
  return <div>{meetDate} </div>;
};

export default DisplayMeetDate;
