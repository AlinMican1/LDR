import React from "react";
import "./loadingSkeletons.css";

export const LoadingSkeleton1 = () => {
  return (
    <div>
      <div className="loadingAnimation loadingSkeletonProfilePic"></div>
      <div className="loadingCard1">
        <div className="loadingAnimation loadingSkeletonTitle1"></div>
        <div className="loadingAnimation loadingSkeletonDescription1"></div>
        <div className="loadingAnimation loadingSkeletonCard1"></div>
        <div className="loadingAnimation loadingSkeletonDescription1"></div>
        <div className="loadingAnimation loadingSkeletonDescription2"></div>
      </div>
    </div>
  );
};

export const LoadingSkeleton2 = () => {
  return <div></div>;
};
