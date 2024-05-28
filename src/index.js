// 載入ReactDOM渲染HTML<div id="root"></div>
import ReactDOM from "react-dom";

// BrowserRouter建立路由規則 控制切換頁面時的網址路徑
import { BrowserRouter } from "react-router-dom";

// 要載入的頁面
import App from "./App";

// 要傳入React的DOM，必須import react-dom
ReactDOM.render(
  // ReactDOM.render((要渲染的ReactDOM), 被渲染的HTMLDOM);
  <BrowserRouter>
    <App />
    {/* BrowserRouter讀取到App頁面裡import的routes頁面才知道怎麼切換頁面 */}
  </BrowserRouter>,
  document.getElementById("root")
); // 把DOM渲染到root div
