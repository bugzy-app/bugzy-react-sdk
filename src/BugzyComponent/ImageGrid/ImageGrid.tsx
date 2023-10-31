import React, { useEffect, useRef, useState } from "react";
import styles from "./ImageGrid.module.scss";
import { HideEyeIcon } from "../../icons";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const ImageGrid = ({
  hideScreenshot,
  setHideScreenshot,
  renderedImageURLS,
  onFileChange,
  setUploadingImage,
  uploadingImages,
  uploadFileImage,
  webImageURLS,
  setWebImageURLS,
}) => {
  const hiddenFileInput = useRef(null);
  async function dataUrlToFile(
    dataUrl: string,
    fileName: string
  ): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleVisibilityOfScreenshots = async (e) => {
    const index = e.target.value;
    const newHideScreenshot = [...hideScreenshot];
    newHideScreenshot[index] = !newHideScreenshot[index];
    setHideScreenshot(newHideScreenshot);
    if (index === "0") {
      // start uploading the image when you untick the first image
      setUploadingImage({ ...uploadingImages, [index]: true });
      const uploadedURL = await uploadFileImage(
        await dataUrlToFile(renderedImageURLS[index], "screenshot"),
        index
      );
      const copyOfWebImageURLS = [...webImageURLS, uploadedURL];
      setWebImageURLS(copyOfWebImageURLS);
    }
  };

  return (
    <React.Fragment>
      <div className={styles.scrollableGrid}>
        {renderedImageURLS.map((imageSrc, index) => (
          <div>
            <div className={styles.imageContainer}>
              {hideScreenshot[index] && (
                <div className={styles.hideImage}>
                  <HideEyeIcon />
                </div>
              )}
              {!hideScreenshot[index] && uploadingImages?.[index] && (
                <div className={styles.uploadingImageOverlay}>
                  <LoadingComponent />
                  <p>Uploading...</p>
                </div>
              )}
              <img src={imageSrc} height={"auto"} />
            </div>
            <input
              id={`hide_screenshot_${index}`}
              type="checkbox"
              onChange={handleVisibilityOfScreenshots}
              value={index}
              checked={!hideScreenshot[index]}
            />
            <label
              htmlFor={`hide_screenshot_${index}`}
              className={styles.hideImageLabel}
            >
              Include image
            </label>
          </div>
        ))}
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFileChange}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className={styles.uploadButton}
        onClick={handleClick}
      >
        Add more Images
      </button>
    </React.Fragment>
  );
};

export default ImageGrid;
