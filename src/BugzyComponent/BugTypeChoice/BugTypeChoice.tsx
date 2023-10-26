import React from "react";
import styles from "./BugTypeChoice.module.scss";

const BugTypeChoice = ({
  issueCategory,
  setSelectedBugType,
  selectedBugType,
}) => {
  const onBugTypeChange = (e) => {
    setSelectedBugType(e.target.value);
  };
  return (
    <div
      className={`${styles.bugTypeChoiceContainer} ${
        issueCategory === "bug" ? styles.showContainer : styles.hideContainer
      }`}
    >
      <p>Type of bug</p>
      <div className={`${styles.urgentContainer}`}>
        <input
          type="radio"
          id="low_bug"
          name="low"
          value="low"
          onChange={onBugTypeChange}
          checked={selectedBugType === "low"}
        />
        <div>
          <label htmlFor="low_bug">Low</label>
          <p>Something's a little off</p>
        </div>
      </div>
      <div className={`${styles.urgentContainer}`}>
        <input
          type="radio"
          id="medium_bug"
          name="medium"
          value="medium"
          onChange={onBugTypeChange}
          checked={selectedBugType === "medium"}
        />
        <div>
          <label htmlFor="medium_bug">Medium</label>
          <p>I'm annoyed, but I'll live</p>
        </div>
      </div>
      <div className={`${styles.urgentContainer}`}>
        <input
          type="radio"
          id="high_bug"
          name="high"
          value="high"
          onChange={onBugTypeChange}
          checked={selectedBugType === "high"}
        />
        <div>
          <label htmlFor="high_bug">High</label>
          <p>I can't use anything</p>
        </div>
      </div>
    </div>
  );
};

export default BugTypeChoice;
