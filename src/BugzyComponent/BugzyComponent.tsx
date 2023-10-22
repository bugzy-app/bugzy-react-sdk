import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BugzyComponentProps } from "./BugzyComponent.types";

import styles from "./BugzyComponent.module.scss";
import categoryStyles from "./CategoryGrid/CategoryGrid.module.scss";
import { CategoryGrid } from "./CategoryGrid/CategoryGrid";
import html2canvas from "html2canvas";
import ImageGrid from "./ImageGrid/ImageGrid";

export const BugzyComponent = ({
  isOpen,
  setOpen,
  onClose,
}: BugzyComponentProps): JSX.Element => {
  const [issueCategory, setIssueCategory] =
    useState<"question" | "feedback" | "bug">("question");
  const [selectedBugType, setSelectedBugType] =
    useState<"low" | "medium" | "high">("low");

  const [isInternalOpen, setIsInternalOpen] = useState<boolean>(false);
  const [defaultScreenshot, setDefaultScreenshot] = useState<string>("");

  const [hideScreenshot, setHideScreenshot] = useState<boolean[]>([]);
  const [imageURLS, setImageURLs] = useState([]);

  const onBugTypeChange = (e) => {
    setSelectedBugType(e.target.value);
  };

  const onFileChange = (e) => {
    if (e.target.files.length < 1) return;
    const newURLS = [...e.target.files].map((image: any) =>
      URL.createObjectURL(image)
    );
    const newImageURLS = [...imageURLS, ...newURLS];
    setHideScreenshot([
      ...hideScreenshot,
      ...new Array(newURLS.length).fill(false),
    ]);
    setImageURLs(newImageURLS);
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
        setImageURLs([base64image]);
        setHideScreenshot([true]);
        setDefaultScreenshot(base64image);
        setIsInternalOpen(true);
      });
    }
  }, [isOpen]);

  const closeBugzy = () => {
    setIsInternalOpen(false);
    onClose && onClose();
    setOpen(false);
  };

  return (
    <>
      {isInternalOpen &&
        createPortal(
          <div>
            <div className={styles.overlay} onClick={closeBugzy}></div>
            <div className={styles.modal}>
              <form>
                <CategoryGrid
                  issueCategory={issueCategory}
                  setIssueCategory={setIssueCategory}
                />
                <div className={styles.inputGrid}>
                  <InputContainer />
                  <div className={styles.imageGrid}>
                    <ImageGrid
                      hideScreenshot={hideScreenshot}
                      setHideScreenshot={setHideScreenshot}
                      imageURLS={imageURLS}
                      onFileChange={onFileChange}
                    />

                    <div
                      style={{
                        visibility:
                          issueCategory === "bug" ? "visible" : "hidden",
                      }}
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
                  </div>
                </div>

                <FooterContainer closeBugzy={closeBugzy} />
              </form>
            </div>
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

const FooterContainer = ({ closeBugzy }) => {
  return (
    <div className={styles.footerContainer}>
      <button type="button" className={styles.closeButton} onClick={closeBugzy}>
        Back
      </button>

      <button className={`${styles.submitButtonDefaultStyles}`}>Submit</button>
    </div>
  );
};
