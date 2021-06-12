import React, { useCallback, useEffect, useState } from 'react'
// import MyWalletProvider from './contexts/MyWalletProvider'

declare const window: any;

const App = () => {
  const [accounts, setAccounts] = useState([]);

  const [name, setName] = '';
  const [account, setAccount] = useState('');
  function onUnlockWallet() {
    try {
      if (window.ethereum) {
        // need this? await window.ethereum.enable();
        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err: string) => {
          alert(err)
          console.error(err)
        })

        // register metamask events
        // important: do this inside unlock wallet, otherwise you'll end up registering a ton of events
        // there's probably a clean js way to ensure you only subscribe once but idk it right now
        window.ethereum.on('chainChanged', handleNetworkChange)
        window.ethereum.on('accountsChanged', handleAccountsChanged)
      }
    } catch (error) {
      alert(error)
    } finally {
      console.log('success')
    }
  }

  // metamask event handlers
  function handleNetworkChange() {
    window.location.reload()
  }
  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // MAYBE: alert or something?
      console.log('Please connect to MetaMask.')
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
    }
  }
  return (
    <div>

      <div>
        hello. active: {account}
      </div>
      <div>
      <label htmlFor="name-input">name:</label>
      <input onChange={(e) => setName(e)} />
      </div>

      <div>
        --------------------------------------------
      </div>

      <div>
        all accounts:
      </div>

      <table style={{border: '1px black solid'}}>
      <thead>
      <tr>
      <th>Name</th>
      <th>Address</th>
      </tr>
      </thead>
      <tbody>
      {accounts.map(a => <tr><td>{a.name}</td><td>{a.address}</td></tr>)}
      </tbody>
      </table>

      <div>
        <button onClick={onUnlockWallet}>Unlock Wallet</button>
      </div>

      <div>
        <button onClick={() => {
          accounts.push({ address: account, name: name});
        }}>Save address</button>
      </div>

    </div>
  )
}

export default App

