import React, { useRef } from "react";
import styles from "./ImageGrid.module.scss";
import { HideEyeIcon } from "../../icons";

const ImageGrid = ({
  hideScreenshot,
  setHideScreenshot,
  imageURLS,
  onFileChange,
}) => {
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleVisibilityOfScreenshots = (e) => {
    const index = e.target.value;
    const newHideScreenshot = [...hideScreenshot];
    newHideScreenshot[index] = !newHideScreenshot[index];
    setHideScreenshot(newHideScreenshot);
  };
  return (
    <React.Fragment>
      <div className={styles.scrollableGrid}>
        {imageURLS.map((imageSrc, index) => (
          <div>
            <div className={styles.imageContainer}>
              {hideScreenshot[index] && (
                <div className={styles.hideImage}>
                  <HideEyeIcon />
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
