import {
  ConnectWallet,
  useAddress,
  Web3Button,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { addresses, abis } from "../contract";
import "../styles/ManagerForm.css";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
//load address and abis
const { vestingManagerAddress } = addresses;
const { vestingManager } = abis;

export default function ManagerForm() {
  const [placeholders, setPlaceholders] = useState(["Address 1"]);
  const [beneficiaryAddresses, setBeneficiaryAddresses] = useState([]);

  const address = useAddress();
  const { contract } = useContract(vestingManagerAddress);

  //add address field
  const addAddress = () => {
    if (placeholders.length === 12) return;
    success();
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

    //remove value from address
    const tempAddresses = beneficiaryAddresses;
    tempAddresses.pop();
    setBeneficiaryAddresses([...tempAddresses]);
    console.log(beneficiaryAddresses);
  };

  //handle address input
  const handleAddress = (e) => {
    const _address = e.target.value;
    const classname = e.target.className;

    let index = classname.match(/\d+/)[0]; // get index from classname
    index--; //addresses classnames are 1 based

    //update addresses
    const temp = beneficiaryAddresses;
    temp[index] = _address;
    setBeneficiaryAddresses([...temp]);
    console.log(beneficiaryAddresses);
  };

  //Vest
  const vest = async (contract) => {
    const ids = await contract.call("vest", beneficiaryAddresses);
    console.log("ids", ids);
  };
  const success = (result) => {};
  const error = (err) => {
    let s = err.message.search(":");
    let e = err.message.search("Transaction");

    toast.error(err.message.substring(s + 2, e - 4), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Vesting</h1>
        <form>
          <p>Add beneficiary addresses</p>
          {placeholders.map((address) => {
            return (
              <input
                type="text"
                className={address}
                placeholder={address}
                onChange={handleAddress}
                key={address}
                required
              />
            );
          })}
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
        </form>

        <div className="drops">
          <div className="drop drop-1"></div>
          <div className="drop drop-2"></div>
          <div className="drop drop-3"></div>
          <div className="drop drop-4"></div>
          <div className="drop drop-5"></div>
        </div>
        {/* submit button */}
        <Web3Button
          className="Submit"
          contractAddress={vestingManagerAddress}
          contractAbi={vestingManager}
          // Call the name of your smart contract function
          action={vest}
          accentColor="#485CF3"
          colorMode="light"
          onSuccess={(result) => {
            console.log(result);
            setPlaceholders(["Address 1"]);
            setBeneficiaryAddresses([]);
            toast.success("Successfully vested!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }}
          onError={(err) => {
            error(err);
          }}
        >
          Vest
        </Web3Button>
      </main>
    </div>
  );
}
