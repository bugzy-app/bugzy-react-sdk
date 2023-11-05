import React, { useEffect, useState } from "react";
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
  type: "question" | "feedback" | "bug";
  title: string;
  description: string;
  projectID: string;
  urgencyLevel?: "low" | "medium" | "high";
  assets: string[];
  email?: string;
  deviceInfo: {
    url: string;
    innerHeight: number;
    innerWidth: number;
    userAgent: string;
  };
  externalConfig: {
    [key: string]: any;
  };
  note: string;
}

const DOMAIN = "https://www.bugzy.app";

export const BugzyComponent = ({
  isOpen,
  setOpen,
  onClose,
  userEmail,
  customMetaData,
  projectID,
}: BugzyComponentProps): JSX.Element => {
  const [isInternalOpen, setIsInternalOpen] = useState<boolean>(false);
  const [errorString, setErrorString] = useState<string>("");
  const [issueCategory, setIssueCategory] =
    useState<"question" | "feedback" | "bug">("question");
  const [selectedBugType, setSelectedBugType] =
    useState<"low" | "medium" | "high">("low");
  const [email, setEmail] = useState(userEmail);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

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
    const response = await fetch(`${DOMAIN}/api/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const uploadedURL = data.imgSource;

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
          uploadImagesObjectCopy = { ...uploadImagesObjectCopy, [i]: true };
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
    if (issueCategory === "question") {
      if (email && !email.includes("@")) {
        return "Please enter a valid email";
      }
      if (!title) {
        return "Please enter a title";
      }
    } else {
      if (email && !email.includes("@")) {
        return "Please enter a valid email";
      }
      if (webImageURLS.length === 0 && content.length === 0) {
        return "Please upload at least one screenshot or explain a bit about your issue.";
      }
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const errorString = generateErrorString();
    setErrorString(errorString);
    if (errorString) {
      return;
    }
    setIsSubmittingForm(true);
    let result: BugzyResult = {
      projectID,
      title: issueCategory === "question" ? title : content.substring(0, 50),
      description: content,
      type: issueCategory,
      assets: webImageURLS,
      email,
      externalConfig: customMetaData,
      deviceInfo: {
        url: window.location.href,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        userAgent: window.navigator.userAgent,
      },
      note: `Submitted from Bugzy at version: 0.0.5`,
    };

    if (issueCategory === "bug") {
      result = { ...result, urgencyLevel: selectedBugType };
    }

    const response = await fetch(`${DOMAIN}/api/issue/submit`, {
      method: "POST",
      body: JSON.stringify(result),
    });

    const data = await response.json().catch((err) => {
      console.log(err);
      setIsSubmittingForm(false);
    });
    setIsSubmittingForm(false);
    clearForm();
    closeBugzy();
  };

  const clearForm = () => {
    setContent("");
    setTitle("");
    setWebImageURLS([]);
    setRenderedImageURLs([]);
    setHideScreenshot([]);
    setSelectedBugType("low");
    setEmail("");
  };

  return (
    <>
      {isInternalOpen &&
        createPortal(
          <div>
            <div className={styles.overlay} onClick={closeBugzy}></div>
            <div className={styles.modal}>
              <div className={styles.header}>
                <p> Powered by </p>
                <a
                  href="https://www.bugzy.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="44"
                    height="17"
                    viewBox="0 0 44 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.bugzyLogo}
                  >
                    <path
                      d="M8.12347 11.1233C7.52681 11.1233 6.95459 10.8862 6.53268 10.4643C6.11078 10.0424 5.87376 9.47021 5.87376 8.87355V7.37374M8.12347 11.1233C8.72013 11.1233 9.29236 10.8862 9.71426 10.4643C10.1362 10.0424 10.3732 9.47021 10.3732 8.87355V7.37374M8.12347 11.1233V7.37374M5.87376 7.37374C5.87376 6.77708 6.11078 6.20485 6.53268 5.78295C6.95459 5.36105 7.52681 5.12402 8.12347 5.12402C8.72013 5.12402 9.29236 5.36105 9.71426 5.78295C10.1362 6.20485 10.3732 6.77708 10.3732 7.37374M5.87376 7.37374H10.3732M10.4272 8.12364H11.498M4.7489 8.12364H5.87376M10.3732 9.9984L11.1231 10.3734M5.87376 9.9984L5.12385 10.3734M10.3732 6.24888L11.1231 5.87393M5.87376 6.24888L5.12385 5.87393M13.3728 13.373L15.9975 15.9976"
                      stroke="#5A5252"
                      stroke-linecap="round"
                    />
                    <path
                      d="M4.56154 1.95175C6.05842 1.08795 7.81826 0.79774 9.51324 1.13517C11.2082 1.4726 12.7227 2.41467 13.7747 3.78588C14.8266 5.1571 15.3442 6.86395 15.2311 8.58847C15.118 10.313 14.3818 11.9376 13.1598 13.1597C11.9377 14.3817 10.3131 15.1179 8.5886 15.231C6.86407 15.3441 5.15722 14.8265 3.78601 13.7745C2.41479 12.7226 1.47273 11.2081 1.13529 9.51311C0.797862 7.81814 1.08808 6.0583 1.95188 4.56142"
                      stroke="#5A5252"
                      stroke-linecap="round"
                    />
                    <path
                      d="M18.533 3.9H20.691C21.4277 3.9 21.965 4.07333 22.303 4.42C22.641 4.758 22.81 5.28233 22.81 5.993V6.357C22.81 6.825 22.732 7.20633 22.576 7.501C22.4287 7.79567 22.199 8.008 21.887 8.138V8.164C22.5977 8.40667 22.953 9.03933 22.953 10.062V10.842C22.953 11.544 22.7667 12.0813 22.394 12.454C22.03 12.818 21.4927 13 20.782 13H18.533V3.9ZM20.522 7.605C20.808 7.605 21.0203 7.53133 21.159 7.384C21.3063 7.23667 21.38 6.98967 21.38 6.643V6.136C21.38 5.80667 21.3193 5.56833 21.198 5.421C21.0853 5.27367 20.9033 5.2 20.652 5.2H19.963V7.605H20.522ZM20.782 11.7C21.0333 11.7 21.2197 11.635 21.341 11.505C21.4623 11.3663 21.523 11.1323 21.523 10.803V10.01C21.523 9.594 21.4493 9.308 21.302 9.152C21.1633 8.98733 20.9293 8.905 20.6 8.905H19.963V11.7H20.782ZM25.8689 13.13C25.1755 13.13 24.6469 12.935 24.2829 12.545C23.9189 12.1463 23.7369 11.5787 23.7369 10.842V3.9H25.1669V10.946C25.1669 11.258 25.2275 11.4833 25.3489 11.622C25.4789 11.7607 25.6609 11.83 25.8949 11.83C26.1289 11.83 26.3065 11.7607 26.4279 11.622C26.5579 11.4833 26.6229 11.258 26.6229 10.946V3.9H28.0009V10.842C28.0009 11.5787 27.8189 12.1463 27.4549 12.545C27.0909 12.935 26.5622 13.13 25.8689 13.13ZM31.0473 13.13C30.354 13.13 29.8253 12.935 29.4613 12.545C29.0973 12.1463 28.9153 11.5787 28.9153 10.842V6.058C28.9153 5.32133 29.0973 4.758 29.4613 4.368C29.8253 3.96933 30.354 3.77 31.0473 3.77C31.7407 3.77 32.2693 3.96933 32.6333 4.368C32.9973 4.758 33.1793 5.32133 33.1793 6.058V6.838H31.8273V5.967C31.8273 5.369 31.5803 5.07 31.0863 5.07C30.5923 5.07 30.3453 5.369 30.3453 5.967V10.946C30.3453 11.5353 30.5923 11.83 31.0863 11.83C31.5803 11.83 31.8273 11.5353 31.8273 10.946V9.165H31.1123V7.865H33.1793V10.842C33.1793 11.5787 32.9973 12.1463 32.6333 12.545C32.2693 12.935 31.7407 13.13 31.0473 13.13Z"
                      fill="#5A5252"
                    />
                    <path
                      d="M33.8115 11.726L36.4635 5.2H33.9415V3.9H37.9975V5.174L35.3455 11.7H37.9975V13H33.8115V11.726ZM40.1204 9.126L38.3914 3.9H39.9124L40.8874 7.241H40.9134L41.8884 3.9H43.2794L41.5504 9.126V13H40.1204V9.126Z"
                      fill="#312318"
                    />
                  </svg>
                </a>
              </div>
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
                    title={title}
                    setTitle={setTitle}
                    setEmail={setEmail}
                    email={email}
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
  title,
  setTitle,
  email,
  setEmail,
}) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel} htmlFor="user_email">
        Email
      </label>
      <input
        style={{
          marginBottom: "0",
        }}
        id="user_email"
        className={`${styles.inputTextarea} ${styles.titleInputStyles}`}
        placeholder="What's your email?"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p id="email_desc">
        We take emails to give out further updates on your issue
      </p>
      {issueCategory === "question" && (
        <>
          <label className={styles.inputLabel} htmlFor="question_title">
            Title
          </label>
          <input
            style={{
              height: "fit-content",
            }}
            id="question_title"
            className={`${styles.inputTextarea} ${styles.titleInputStyles}`}
            placeholder="What's the question about?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </>
      )}
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
