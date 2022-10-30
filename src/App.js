import { ConnectWallet,useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import {vestingManagerAddress,vestingManager,vesting,token} from "./contract"
import "./styles/App.css";

export default function App() {
  const [placeholders, setPlaceholders] = useState(["Address 1"]);
  const address = useAddress();
  console.log(address);
  
  //add address field
  const addAddress = () => {
    if (placeholders.length === 12) return;

    setPlaceholders(() => [
      ...placeholders,
      `Address ${placeholders.length + 1}`,
    ]);
  };

  //remove address field
  const removeAddress = () => {
    if (placeholders.length === 1) return;

    const temp = placeholders;
    temp.pop();
    console.log(temp);
    setPlaceholders([...temp]);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="connect">
          <ConnectWallet accentColor="#BB4E9C" colorMode="light" />
        </div>
      </div>
      <div className="container">
        <main className="main">
          <h1 className="title">Vesting</h1>

          <form>
            <p>Vest</p>
            {placeholders.map((address) => {
              return <input type="text" placeholder={address} />;
            })}
            {/* <input type="password" placeholder="Password" /> */}
            <br />
            <input
              type="button"
              className="address"
              value="Add"
              onClick={addAddress}
            />
            <input
              type="button"
              className="address"
              value="Remove"
              onClick={removeAddress}
            />
            <br />
            <input type="button" value="Submit" />
          </form>

          <div className="drops">
            <div className="drop drop-1"></div>
            <div className="drop drop-2"></div>
            <div className="drop drop-3"></div>
            <div className="drop drop-4"></div>
            <div className="drop drop-5"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
