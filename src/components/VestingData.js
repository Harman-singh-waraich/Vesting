import {
  useAddress,
  Web3Button,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { addresses, abis } from "../contract";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from '@mui/material/LinearProgress';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import "../styles/VestingData.css";
import { ethers } from "ethers";
import { toast } from "react-toastify";

//load address and abis
const { vestingManagerAddress } = addresses;
const { vestingManager, vesting, token } = abis;



export default function VestingData() {
  const [vestingId, setVestingId] = useState("");
  const [update,setUpdate] = useState(false);
  const address = useAddress();
  
  //load Vesting Ids
  const { contract: VestingManagerContract } = useContract(
    vestingManagerAddress
  );
  const { data: IDs, isLoading: isLoadingIDs } = useContractRead(
    VestingManagerContract,
    "userVestingIds",
    address
  );

  //load vesting contract data
  const { contract: vestingContract } = useContract(vestingId, vesting);
  const { data: start, isLoading: isLoadingStart } = useContractRead(
    vestingContract,
    "start"
  );
  const { data: releasedTokens, isLoading: isLoadingReleased } =
    useContractRead(vestingContract, "released");
  console.log();
  const { data: totalAllocation, isLoading: isLoadingAllocation } =
    useContractRead(vestingContract, "totalAllocation");
  
    //load XYZToken data
  const { data: tokenAddress, isLoading: isLoadingToken } = useContractRead(
    vestingContract,
    "token"
  );
  const { data: beneficiaryCount, isLoading: isLoadingCount } = useContractRead(
    vestingContract,
    "beneficiaryCount"
  );
  const { contract: xyztoken } = useContract(tokenAddress, token);
  const { data: balance, isLoading: isLoadingBalance } = useContractRead(
    xyztoken,
    "balanceOf",
    address
  );

  //handle vestind id change
  const handleChange = (event) => {
    setVestingId(event.target.value);
    console.log(vestingContract);
  };

  //events for success and error
  const success = (result)=>{
    console.log(result);
    setUpdate(true)
    toast.success("Successfully released!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }
  const error = (err)=>{
    console.log(err);
    setUpdate(true)
    toast.error("Release Failed!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }
  return (
    <div className="vestingContainer">
      <main className="main">
        <h1 className="title">Your Vestings</h1>
        <form className="vestingData">
          <Box sx={{ minWidth: 120, flexGrow: 1 }}>
            <FormControl fullWidth className="select">
              <InputLabel id="demo-simple-select-label">Vesting Id</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={vestingId}
                label="Id"
                onChange={handleChange}
              >
                {isLoadingIDs ? (
                  <div><LinearProgress/></div>
                ) : (
                  IDs.map((address) => {
                    return (
                      <MenuItem value={address} key={address}>
                        {" "}
                        {address}
                      </MenuItem>
                    );
                  })
                )}
              </Select>
            </FormControl>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                {vestingId === "" ? (
                  <></>
                ) : isLoadingStart ? (
                  <div>loading</div>
                ) : (
                  <p>Start {new Date(start.toNumber()).toUTCString()}</p>
                )}
              </Grid>
              <Grid item xs={6}>
                {vestingId === "" ? (
                  <></>
                ) : isLoadingStart ? (
                  <div>loading</div>
                ) : (
                  <p>Beneficiaries : {beneficiaryCount.toNumber()}</p>
                )}
              </Grid>
              <Grid item xs={6}>
                {vestingId === "" ? (
                  <></>
                ) : isLoadingStart ? (
                  <div>loading</div>
                ) : (
                  <p>Duration : 12 months</p>
                )}
              </Grid>
              <Grid item xs={6}>
                {vestingId === "" ? (
                  <></>
                ) : isLoadingReleased ? (
                  <div>loading</div>
                ) : (
                  <p>
                    Released :{" "}
                    {Math.round(
                      ethers.utils.formatEther(releasedTokens) * 1e4
                    ) / 1e4}{" "}
                    XYZ
                  </p>
                )}
              </Grid>
              <Grid item xs={6}>
                {vestingId === "" ? (
                  <></>
                ) : isLoadingBalance ? (
                  <div>loading</div>
                ) : (
                  <p>
                    Your Balance :{" "}
                    {Math.round(ethers.utils.formatEther(balance) * 1e4) / 1e4}{" "}
                    XYZ
                  </p>
                )}
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </Box>
        </form>
        {vestingId === "" ? (
          <></>
        ) : isLoadingBalance ? (
          <div>loading</div>
        ) : (
          <Web3Button
            contractAddress={vestingId}
            contractAbi={vesting}
            // Call the name of your smart contract function
            action={async (contract) => {
              await contract.call("release");
            }}
            accentColor="#485CF3"
            colorMode="dark"
            onSuccess={success}
            onError={error}
          >
            Release
          </Web3Button>
        )}
        <div className="drops">
          <div className="drop drop-1"></div>
          <div className="drop drop-2"></div>
          <div className="drop drop-3"></div>
          <div className="drop drop-4"></div>
          <div className="drop drop-5"></div>
        </div>
      </main>
    </div>
  );
}
