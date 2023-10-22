import React from "react";
import styles from "./Category.module.scss";
import { BugIcon, FeedbackIcon, QuestionIcon } from "./icons";

export const CategoryGrid = ({ issueCategory, setIssueCategory }) => {
  return (
    <div className={styles.outerCategoryContainer}>
      <div className={styles.categoryGrid}>
        <div
          className={`${styles.categoryContainer} ${
            issueCategory === "question"
              ? styles.questionCategoryStyles
              : styles.questionCategoryDefaultStyles
          }  `}
          onClick={() => setIssueCategory("question")}
        >
          <QuestionIcon />
          <div>
            Question
            {/* <p>How does this...</p> */}
          </div>
        </div>
        <div
          className={`${styles.categoryContainer} ${
            issueCategory === "feedback"
              ? styles.feedbackCategoryStyles
              : styles.feedbackCategoryDefaultStyles
          }  `}
          onClick={() => setIssueCategory("feedback")}
        >
          <FeedbackIcon />
          <div>
            Feedback
            {/* <p>What if we..</p> */}
          </div>
        </div>
        <div
          className={`${styles.categoryContainer} ${
            issueCategory === "bug"
              ? styles.bugCategoryStyles
              : styles.bugCategoryDefaultStyles
          }  `}
          onClick={() => setIssueCategory("bug")}
        >
          <BugIcon />
          <div>
            Bug
            {/* <p>When I do this...</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};
