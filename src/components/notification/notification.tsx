/**
 * @description Notification component
 */
export const Noty = (props: { type: string; message: string }) => {
  const styles = () =>
    props.type === "success"
      ? "px-4 py-3 text-green-800 bg-green-200"
      : "px-4 py-3 text-red-800 bg-red-200";
  return <div class={styles()}>{props.message}</div>;
};