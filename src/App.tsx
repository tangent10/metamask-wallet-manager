import React, {  useState } from 'react'

declare const window: any;

interface account {
  name: string
  address: string
}

const App = () => {


  let startingAccounts = [] as account[];
    const savedAccounts = localStorage.getItem("accounts");
    if(savedAccounts && savedAccounts !== '') {
      startingAccounts = JSON.parse(savedAccounts);
    }
  const [accounts, setAccounts] = useState(startingAccounts);

  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  function onUnlockWallet() {
    try {
      if (window.ethereum) {
        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err: string) => {
          alert(err)
          console.error(err)
        })

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
      console.log('Please connect to MetaMask.')
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
    }
  }

  return (
    <div style={{margin: '0 auto', marginTop: '50px', width: '800px'}}>

    <div>
      <span>current wallet: </span><span style={{marginLeft: '10px'}}>
      {!!account ? (account) : (<button onClick={onUnlockWallet}>unlock wallet</button>) }
      </span>
      
    </div>
    <div>
    <label htmlFor="name-input">name:</label>
    <input id="name-input" onChange={(e) => setName(e.target.value)} />
    </div>

    <hr />

    <div>
    all accounts:
      </div>


<ol>
    {accounts.map(a => <li style={{fontFamily: 'Consolas'}} key={a.name}>{a.address} : {a.name}</li>)}
</ol>
    {/* <table style={{border: '1px black solid'}}>
    <thead>
    <tr>
    <th style={{border: '1px black solid', padding: '10px'}}>name</th>
    <th style={{border: '1px black solid', padding: '10px'}}>address</th>
    </tr>
    </thead>
    <tbody>
    {accounts.map(a => <tr key={a.name}><td style={{border: '1px black solid', padding: '10px'}}>{a.name}</td><td style={{border: '1px black solid', padding: '10px'}}>{a.address}</td></tr>)}
    </tbody>
    </table> */}

    <div>
    <button onClick={() => {
      // uh feels a bit hacky
      // but apparently react doesn't want to redraw the screen
      // unless setAccounts is called?
      accounts.push({ address: account, name: name});
      setAccounts([...accounts]);
    }}>add address</button>
    </div>

    <div>
    <button onClick={() => setAccounts([])}>clear accounts</button>
    </div>

    <div>
    <button onClick={() => {
      for(let i = 0; i < accounts.length; i++) {
        console.log(`[${i}] : ${JSON.stringify(accounts[i])}`);
      }
    }}>list accounts </button>
    </div>

    <div>
    <button onClick={() => {
      // todo: save old accounts in like accounts.bak to allow for a redo
      // otherwise this is pretty fragile
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }}>save accounts</button>
    </div>

    </div>
  )
}

export default App

