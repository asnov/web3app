import { Component } from '@angular/core';

import * as Web3 from 'web3';
import BigNumber from 'web3/bower/bignumber.js/bignumber';

interface Web3broserWindow extends Window {
  web3?: {
    currentProvider;
  };
}

interface AccountInfo {
  fromAccount: string;
  balance: BigNumber;
}

declare let window: Web3broserWindow;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'web3app';

  private web3Provider: null;
  private web3: {
    eth: {
      getCoinbase: (callback: (err, account: string) => void) => void;
      getBalance: (account: string, callback: (err, bn: BigNumber) => void) => void;
    }
    fromWei: Function;
  };
  accountInfo: AccountInfo;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    this.web3 = new Web3(this.web3Provider);

    this.getAccountInfo()
      .then(accountInfo => {
        console.log(`accountInfo=`, accountInfo);
        this.accountInfo = accountInfo;
      })
      .catch(console.error);
  }

  getAccountInfo() {
    return new Promise<AccountInfo>((resolve, reject) => {
      this.web3.eth.getCoinbase((errCoinbase, account) => {
        if (errCoinbase === null) {
          console.log(`web3.eth.getCoinbase():`, account);
          this.web3.eth.getBalance(account, (errBalance, balance) => {
            if (errBalance === null) {
              console.log(`web3.eth.getBalance():`, balance);
              resolve({fromAccount: account, balance: this.web3.fromWei(balance, 'ether')});
            } else {
              console.error(`Error: web3.eth.getBalance:`, errCoinbase);
              reject(`Error: ${errBalance}`);
            }
          });
        } else {
          console.error(`Error: web3.eth.getCoinbase:`, errCoinbase);
          reject(`Error: ${errCoinbase}`);
        }
      });
    });
  }

}
