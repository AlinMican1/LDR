import React, { useState } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const VibrateAction = () => {
  const [click, setClick] = useState(0);
  const hapticsVibrate = async () => {
    await Haptics.vibrate();
    setClick(click + 1);
  };
  return <button onClick={hapticsVibrate}>VibrateAction - {click}</button>;
};

export default VibrateAction;
