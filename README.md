# Twitter3 

![image](https://user-images.githubusercontent.com/27052451/202925591-1053d059-57a5-419c-9884-339ef7ed1001.png)

A companion app to a tutorial I'm writing (in progress) on hackmd.io, where I introduce web3 concepts by building a progressively more complex version of Twitter, completely on chain! - will be out SOON!

This app is based on the awesome scaffold by [Chase Fleming](https://github.com/chasefleming/fcl-next-scaffold) which includes stuff like:

- FCL setup and configuration for all networks
- Discovery for wallet integration (including Emulator)
- Flow.json loading for contract placeholders
- Authentication
- CDC file loader
- Custom hooks

## Install

```bash
npm i
``` 

## Running the App

### Local with Dev Wallet and the Emulator

In one terminal, run emulator: 

```bash
flow emulator start
```

Then, in another terminal, run Dev Wallet:

```bash
flow dev-wallet
```

```bash
npm run dev:local:deploy
```
