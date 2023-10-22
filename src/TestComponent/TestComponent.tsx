import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TestComponentProps } from "./TestComponent.types";

import styles from "./TestComponent.module.scss";
import categoryStyles from "./Category.module.scss";
import { CategoryGrid } from "./CategoryGrid";
import html2canvas from "html2canvas";
import { HideEyeIcon } from "./icons";

export const TestComponent: React.FC<TestComponentProps> = ({ isOpen }) => {
  const [issueCategory, setIssueCategory] =
    useState<"question" | "feedback" | "bug">("question");
  const [selectedBugType, setSelectedBugType] =
    useState<"low" | "medium" | "high">("low");

  const [isInternalOpen, setIsInternalOpen] = useState<boolean>(false);
  const [defaultScreenshot, setDefaultScreenshot] = useState<string>("");

  const [hideScreenshot, setHideScreenshot] = useState(false);

  const handleChange = () => {
    setHideScreenshot(!hideScreenshot);
  };

  const onBugTypeChange = (e) => {
    setSelectedBugType(e.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `<link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">`
      );

      const screenshotTarget = document.body;

      html2canvas(screenshotTarget, {
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
      }).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        // window.location.href = base64image;
        console.log(base64image);
        setDefaultScreenshot(base64image);
        setIsInternalOpen(true);
      });
    }
  }, [isOpen]);

  return (
    <>
      {isInternalOpen &&
        createPortal(
          <div className={styles.overlay}>
            <form>
              <div className={styles.modal}>
                <CategoryGrid
                  issueCategory={issueCategory}
                  setIssueCategory={setIssueCategory}
                />
                <div className={styles.inputGrid}>
                  <InputContainer />
                  <div className={styles.imageGrid}>
                    <div className={styles.imageContainer}>
                      {!hideScreenshot && (
                        <div className={styles.hideImage}>
                          <HideEyeIcon />
                        </div>
                      )}
                      <img
                        src={defaultScreenshot}
                        className=""
                        width={200}
                        height={"auto"}
                      />
                    </div>
                    <input
                      type="checkbox"
                      onChange={handleChange}
                      checked={hideScreenshot}
                    />
                    <label>Include screenshot</label>
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
                </div>

                <FooterContainer issueType={issueCategory} />
              </div>
            </form>
          </div>,
          document.body!
        )}
    </>
  );
};

const InputContainer = () => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel} htmlFor="main_content">
        What are you running into?
      </label>
      <textarea
        rows={10}
        className={styles.inputTextarea}
        id="main_content"
        placeholder="I am running into this weird thing where...."
      ></textarea>
    </div>
  );
};

const FooterContainer = ({ issueType }) => {
  let activeButtonStyles = "";
  switch (issueType) {
    case "question":
      activeButtonStyles = categoryStyles.questionCategoryStyles;
      break;
    case "feedback":
      activeButtonStyles = categoryStyles.feedbackCategoryStyles;
      break;
    case "bug":
      activeButtonStyles = categoryStyles.bugCategoryStyles;
      break;
    default:
      break;
  }

  return (
    <div className={styles.footerContainer}>
      <button type="button" className={styles.closeButton}>
        Back
      </button>

      <button
        className={`${styles.submitButtonDefaultStyles} ${activeButtonStyles} `}
      >
        Submit{" "}
      </button>
    </div>
  );
};
