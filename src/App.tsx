import { copyFile } from "fs";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

declare const window: any;

interface account {
  name: string;
  address: string;
}

const App = () => {
  let startingAccounts = [] as account[];
  const savedAccounts = localStorage.getItem("accounts");
  if (savedAccounts && savedAccounts !== "") {
    startingAccounts = JSON.parse(savedAccounts);
  }
  const [accounts, setAccounts] = useState(startingAccounts);

  const [importing, setImporting] = useState(false);
  const [importData, setImportData] = useState("");

  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  function onUnlockWallet() {
    try {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch((err: string) => {
            alert(err);
            console.error(err);
          });

        window.ethereum.on("chainChanged", handleNetworkChange);
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
    } catch (error) {
      alert(error);
    } finally {
      console.log("success");
    }
  }

  // metamask event handlers
  function handleNetworkChange() {
    window.location.reload();
  }
  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  }

  function saveAccount() {
    const existingIndex = accounts.findIndex((a) => a.address === account);
    if (existingIndex > -1) {
      accounts[existingIndex].name = name;
    } else {
      accounts.push({ address: account, name: name });
    }
    setAccounts([...accounts]);
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  return (
    <div style={{ margin: "0 auto", marginTop: "50px", width: "800px" }}>
      <div style={{ marginBottom: "10px" }}>
        <span>current wallet: </span>
        <span style={{ marginLeft: "10px" }}>
          {!!account ? (
            account
          ) : (
            <button onClick={onUnlockWallet}>unlock wallet</button>
          )}
        </span>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="name-input">name:</label>
        <input
          id="name-input"
          onChange={(e) => setName(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              saveAccount();
            }
          }}
        />

        <button onClick={saveAccount} style={{ marginLeft: "10px" }}>
          [+]
        </button>
      </div>

      <hr />

      <div>all accounts:</div>

      <div>
        <div>
          <label htmlFor="export-btn">export:</label>
          <CopyToClipboard
            onCopy={() => {
              console.log("copied");
              alert(
                "copied accounts object. save this json string to a text file to import in the future."
              );
            }}
            text={JSON.stringify(accounts)}
          >
            <button id="export-btn" style={{ marginLeft: "10px" }}>
              EXPORT
            </button>
          </CopyToClipboard>
        </div>

        <div>
          <label htmlFor="import-btn">import:</label>
          <button
            id="import-btn"
            style={{ marginLeft: "10px" }}
            onClick={() => setImporting(true)}
          >
            IMPORT
          </button>
        </div>
      </div>

      {importing ? (
        <div>
          <label htmlFor="import-txt-area">paste here</label>
          <input
            id="import-txt-area"
            onChange={(e) => setImportData(e.target.value)}
            value={importData}
          />
          <button
            onClick={() => {
              const importAccounts = JSON.parse(importData);
              const importLength = importAccounts.length;
              const storageAccounts = localStorage.getItem("accounts");
              if (storageAccounts && storageAccounts !== "") {
                const storageAccountsObj = JSON.parse(storageAccounts);
                const currentCount = storageAccountsObj.length;
                const isConfirmed = window.confirm(
                  `importing will overwrite your saved addresses. you have ${currentCount} addresses saved currently and would be importing ${importLength} new accounts`
                );
                if (!isConfirmed) {
                  setImportData("");
                  return;
                }
              }
              localStorage.setItem("accounts", importData);
              const newAccounts = localStorage.getItem("accounts");
              if (newAccounts) {
                const importedData = JSON.parse(newAccounts);
                setAccounts(importedData);
              }
              setImportData("");
              setImporting(false);
            }}
          >
            SAVE
          </button>
        </div>
      ) : (
        <div />
      )}

      <ol>
        {accounts.map((a) => (
          <li style={{ fontFamily: "Consolas" }} key={a.name}>
            {a.address} : {a.name}
            <button
              onClick={() => {
                const newAccounts = accounts.filter(
                  (s) => s.address !== a.address
                );
                setAccounts(newAccounts);
                localStorage.setItem("accounts", JSON.stringify(accounts));
              }}
              style={{ marginLeft: "10px" }}
            >
              [-]
            </button>
          </li>
        ))}
      </ol>

      <div>
        <button
          onClick={() => {
            const isConfirmed = window.confirm(
              "NOTE: make sure you have exported your addresses if you want to use them again, or you'll have to re-enter each one manually again after clearing the list."
            );
            if (isConfirmed) {
              setAccounts([]);
              localStorage.setItem("accounts", "[]");
            }
          }}
        >
          clear accounts
        </button>
      </div>

      {/* <div>
        <button
          onClick={() => {
            // todo: save old accounts in like accounts.bak to allow for a redo
            // otherwise this is pretty fragile
            localStorage.setItem("accounts", JSON.stringify(accounts));
          }}
        >
          save accounts
        </button>
      </div> */}
    </div>
  );
};

export default App;
function copy(accountsInStorage: string) {
  throw new Error("Function not implemented.");
}
