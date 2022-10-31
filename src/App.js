import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import "./styles/App.css";
import ManagerForm from "./components/ManagerForm";
import VestingData from "./components/VestingData";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
export default function App() {
  const address = useAddress();
  return (
    <div className="App">
      <div className="header">
        <div className="connect">
          <ConnectWallet accentColor="#BB4E9C" colorMode="light" />
        </div>
      </div>
      <div className="forms">
        <ManagerForm />
        {address ? (
          <VestingData />
        ) : (
          <div className="vestingContainer">
            Connect wallet to see your vestings!
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
