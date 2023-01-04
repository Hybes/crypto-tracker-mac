# Crypto Tracker for Mac System Tray

## Download/Releases

For releases, download the DMG for Intel or Apple Silicon in the Releases page or at the bottom of the README.

## Usage

The app only runs in the tray and uses the [CoinGecko](https://coingecko.com/) API which has a rate limit, so this runs every 5 seconds.
You can specify the token you want to keep track of, by right clicking the text in the tray which will say 'Crypto Tracker' and opening the settings.

Once you've input a correct, valid token name such as 'bitcoin', 'solana' or 'bonk', a valid fiat currency and a precision value above 0, the app will update in the taskbar after 5 seconds of pressing the save button.

You can then close the settings window. Don't CMD-Q as it will quit the whole app, you just need to press the 'X'.

## Troubleshooting

What is there to go wrong?

If something does... contact me: help@cnnct.uk

## Building

If you wanna build it yourself, you can clone the repo: <br>
```git clone https://github.com/Hybes/crypto-tracker-mac```
Fetch the node packages with <br>```npm i```
Build the installers with <br>```npm run dist```
Or test in dev with <br>```npm run start```

## Download Links
Apple Silicon Version: [Download](https://store.brth.uk/hybes/Crypto%20Tracker-1.1.0-arm64.dmg) <br>
Intel Version: [Download](https://store.brth.uk/hybes/Crypto%20Tracker-1.1.0.dmg)
