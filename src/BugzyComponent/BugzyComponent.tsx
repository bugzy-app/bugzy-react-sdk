import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BugzyComponentProps } from "./BugzyComponent.types";
import styles from "./BugzyComponent.module.scss";
import { CategoryGrid } from "./CategoryGrid/CategoryGrid";
import html2canvas from "html2canvas";
import ImageGrid from "./ImageGrid/ImageGrid";
import BugTypeChoice from "./BugTypeChoice/BugTypeChoice";
import { CheckIcon } from "../icons";
import LoadingComponent from "./LoadingComponent/LoadingComponent";

interface BugzyResult {
  issueCategory: "question" | "feedback" | "bug";
  selectedBugType?: "low" | "medium" | "high";
  assets: string[];
  content: string;
  userEmail?: string;
  metadata: {
    url: string;
    innerHeight: number;
    innerWidth: number;
    userAgent: string;
  };
}

export const BugzyComponent = ({
  isOpen,
  setOpen,
  onClose,
  userEmail,
}: BugzyComponentProps): JSX.Element => {
  const [isInternalOpen, setIsInternalOpen] = useState<boolean>(false);
  const [errorString, setErrorString] = useState<string>("");

  const [issueCategory, setIssueCategory] =
    useState<"question" | "feedback" | "bug">("question");
  const [selectedBugType, setSelectedBugType] =
    useState<"low" | "medium" | "high">("low");
  const [content, setContent] = useState<string>("");

  const [uploadingImages, setUploadingImage] = useState<{
    [x: string]: boolean;
  }>({});
  const [defaultScreenshot, setDefaultScreenshot] = useState<string>("");
  const [hideScreenshot, setHideScreenshot] = useState<boolean[]>([]);
  const [renderedImageURLS, setRenderedImageURLs] = useState([]);
  const [webImageURLS, setWebImageURLS] = useState<string[]>([]);

  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  // 1. For the first i.e screenshot, upload it only when its unticked
  // 2. For the rest of the images, upload them when they are selected

  const uploadFileImage = async (image: any, index) => {
    const formData = new FormData();
    formData.append("img", image);
    const response = await fetch("http://localhost:3000/api/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const uploadedURL = data.imgSource;
    console.log(data);

    let uploadImagesObjectCopy = { ...uploadingImages };
    uploadImagesObjectCopy = { ...uploadImagesObjectCopy, [index]: false };
    setUploadingImage(uploadImagesObjectCopy);

    return uploadedURL;
  };

  const onFileChange = async (e) => {
    if (e.target.files.length < 1) return;
    // uploadFileImage(e.target.files[0]);
    const newURLS = [...e.target.files];
    const newURLScopy = [
      ...renderedImageURLS,
      ...newURLS.map((image: any) => URL.createObjectURL(image)),
    ];
    const newImageURLS = [...renderedImageURLS, ...newURLS];

    const newHideScreenshotArray = [
      ...hideScreenshot,
      ...new Array(newURLS.length).fill(false),
    ];

    let diffInLength = newHideScreenshotArray.length - hideScreenshot.length;
    let copy = newImageURLS;
    setRenderedImageURLs(newURLScopy);

    if (diffInLength > 0) {
      let uploadImagesObjectCopy = { ...uploadingImages };
      for (let i = hideScreenshot.length - 1; i <= diffInLength; i++) {
        if (i !== 0) {
          console.log(copy[i]);
          uploadImagesObjectCopy = { ...uploadImagesObjectCopy, [i]: true };

          // newImageURLS[i] = URL.createObjectURL(newImageURLS[i]);
        }
      }
      setUploadingImage(uploadImagesObjectCopy);
      const uploadedURLS = [];
      for (let i = hideScreenshot.length - 1; i <= diffInLength; i++) {
        if (i !== 0) {
          const currentUploadedURL = await uploadFileImage(copy[i], i);
          uploadedURLS.push(currentUploadedURL);
          // newImageURLS[i] = URL.createObjectURL(newImageURLS[i]);
        }
      }
      const copyOfWebImageURLS = [...webImageURLS, ...uploadedURLS];
      setWebImageURLS(copyOfWebImageURLS);
    }

    setHideScreenshot(newHideScreenshotArray);
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
        setRenderedImageURLs([base64image]);
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

  const generateErrorString = () => {
    if (webImageURLS.length === 0) {
      return "Please upload at least one screenshot or explain a bit about your issue.";
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    let result: BugzyResult = {
      issueCategory,
      assets: webImageURLS,
      content: content,
      userEmail,
      metadata: {
        url: window.location.href,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        userAgent: window.navigator.userAgent,
      },
    };

    if (issueCategory === "bug") {
      result = { ...result, selectedBugType };
    }

    const errorString = generateErrorString();
    setErrorString(errorString);
    if (!errorString) {
      return;
    }
  };
  console.log(webImageURLS);
  return (
    <>
      {isInternalOpen &&
        createPortal(
          <div>
            <div className={styles.overlay} onClick={closeBugzy}></div>
            <div className={styles.modal}>
              <form onSubmit={onSubmitForm}>
                <CategoryGrid
                  issueCategory={issueCategory}
                  setIssueCategory={setIssueCategory}
                />
                <div className={styles.inputGrid}>
                  <InputContainer
                    issueCategory={issueCategory}
                    setContent={setContent}
                    content={content}
                    errorString={errorString}
                  />
                  <div className={styles.imageGrid}>
                    <ImageGrid
                      setUploadingImage={setUploadingImage}
                      uploadingImages={uploadingImages}
                      hideScreenshot={hideScreenshot}
                      setHideScreenshot={setHideScreenshot}
                      renderedImageURLS={renderedImageURLS}
                      onFileChange={onFileChange}
                      uploadFileImage={uploadFileImage}
                      setWebImageURLS={setWebImageURLS}
                      webImageURLS={webImageURLS}
                    />
                    <BugTypeChoice
                      issueCategory={issueCategory}
                      selectedBugType={selectedBugType}
                      setSelectedBugType={setSelectedBugType}
                    />
                  </div>
                </div>

                <FooterContainer
                  isSubmittingForm={isSubmittingForm}
                  closeBugzy={closeBugzy}
                />
              </form>
            </div>
          </div>,
          document.body!
        )}
    </>
  );
};

const InputContainer = ({
  setContent,
  content,
  errorString,
  issueCategory,
}) => {
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
        onChange={(e) => setContent(e.target.value)}
        value={content}
      ></textarea>
      {issueCategory === "bug" && (
        <div className={styles.metadataTextContainer}>
          <CheckIcon />
          <p>
            We have already included metadata of your environment to help the
            devs that'll work on these bugs
          </p>
        </div>
      )}
      <p className={styles.errorText}>{errorString}</p>
    </div>
  );
};

const FooterContainer = ({ closeBugzy, isSubmittingForm }) => {
  return (
    <div className={styles.footerContainer}>
      <button type="button" className={styles.closeButton} onClick={closeBugzy}>
        Back
      </button>

      <button
        disabled={isSubmittingForm}
        className={`${styles.submitButtonDefaultStyles}`}
      >
        {isSubmittingForm && <LoadingComponent />}
        Submit
      </button>
    </div>
  );
};
