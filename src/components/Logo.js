// import logoSvg from './ase.svg'; // If 'ase.svg' is in the 'data' subdirectory
import logoSvg from "./picture/aseglobal_logo.png"; // If 'ase.svg' is in the 'data' subdirectory

const Logo = (props) => (
  <img
    alt="Logo"
    src={logoSvg}
    style={{ width: "50px", height: "auto" }} // 調整圖片的寬度為100像素，高度自動調整
    {...props}
  />
);

export default Logo;
