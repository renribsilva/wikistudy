const Home = ({ width = "24px", height = "24px", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
    {...props}
  >
    {/*eslint-disable-next-line*/}
    <path d="M6,19H9V13h6v6h3V10L12,5.5L6,10v9ZM4,21V9l8-6l8,6V21H13V15H11v6H4Zm8-8.75Z" />
  </svg>
);

export default Home;
