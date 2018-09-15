import { Component } from '@angular/core';

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
  private ethers: Web3Provider;
  accountInfo: AccountInfo;

  extendsTest = new Child();

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new JsonRpcProvider('http://localhost:8545');
    }
    this.ethers = new Web3Provider(this.web3Provider);

    this.getAccountInfoEthers()
      .then(accountInfo => {
        console.log(`accountInfo=`, accountInfo);
        this.accountInfo = accountInfo;
      })
      .catch(console.error);

    this.extendsTest.log();
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

export class Parent {
  isGoodParent = true;
  constructor(protected familyName = 'Red') { }
}

export class Child extends Parent {
  constructor(
    protected firstName = 'John',
    familyName = 'Red',
  ) {
    super(familyName);
  }
  log() {
    console.log(this.firstName, this.familyName, this.isGoodParent);
  }
}
