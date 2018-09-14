import { Component } from '@angular/core';

// import * as Web3Provider from 'web3';
// import BigNumber from 'web3/bower/bignumber.js/bignumber';

// import { BigNumber } from 'ethers';
// import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import * as ethers from 'ethers';
import BigNumber = ethers.BigNumber;
import JsonRpcProvider = ethers.providers.JsonRpcProvider;
import Web3Provider = ethers.providers.Web3Provider;


interface Web3broserWindow extends Window {
  web3?: {
    currentProvider;
  };
}

interface AccountInfo {
  account: string;
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

  private web3Provider: any;
  private web3: {
    eth: {
      getCoinbase: (callback: (err, account: string) => void) => void;
      getBalance: (account: string, callback: (err, bn: BigNumber) => void) => void;
    }
    fromWei: Function;
  };
  private ethers: Web3Provider;
  accountInfo: AccountInfo;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      // this.web3Provider = new Web3Provider.providers.HttpProvider('http://localhost:8545');
      this.web3Provider = new JsonRpcProvider('http://localhost:8545');
    }
    // this.web3 = new Web3Provider(this.web3Provider);
    this.ethers = new Web3Provider(this.web3Provider);

    // this.getAccountInfo()
    this.getAccountInfoEthers()
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
              resolve({account, balance: this.web3.fromWei(balance, 'ether')});
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

  getAccountInfoEthers(): Promise<AccountInfo> {
    return new Promise<AccountInfo>((resolve, reject) => {
      this.ethers.listAccounts()
        .then(value => {
          console.log(`provider.listAccounts() returns`, value);
          const account = value[0];
          this.ethers.getBalance(account)
            .then(balance => {
              resolve({account, balance});
            })
            .catch(err => {
              console.error(`provider.getBalance() error is`, err);
              reject(err);
            });
        })
        .catch(err => {
          console.error(`provider.listAccounts() error is`, err);
          reject(err);
        });
    });
  }

}
