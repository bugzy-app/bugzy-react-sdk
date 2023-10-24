import React from "react";
import styles from "./LoadingComponent.module.scss";
const LoadingComponent = () => {
  return (
    <div className={styles.lds_dual_ring}>
      <div></div>
      <div></div>
    </div>
  );
};
export default LoadingComponent;
