# Track My Spend
An IOS widget to help track your spend with Programmable Banking.

![Widget Preview](./img/device-preview.png)

## Requirements
- The [Scriptable](https://scriptable.app/) mobile app
- iPhone/iPad/Mac
- iOS 14.0 or later / macOS Big Sur or later

## Preparation
You will need to have your Investec API keys at hand.
Specifically, your client ID, client secret and API key. You can learn more about Investec API keys in the [quick start guide](https://offerzen.gitbook.io/programmable-banking-community-wiki/developer-tools/quick-start-guide#how-to-get-your-api-keys).

Finally, you must fork this repository to your Github account. This allows you to easily stay up to date with new changes to the widget without losing your local customizations to it.
After you have cloned the repository, clone the repository to your local environment.

## Configuration
Open the `src/widget.js` file and add your API credentials according to the instructions in the file.

## Device Installation

- Create a new script in Scriptable. This opens up the editor on your iPhone. You can give it any title as you wish.
- Use your [Universal Clipboard](https://support.apple.com/en-us/HT209460) to copy the contents of `widget.js` to the editor on your iPhone.
- Tap *Done* to save the script.

## Configure The Widget

- Long-press on your home screen and select the option to add a new widget.
- Select the Scriptable app.
- Select the largest widget size.
- Long press the new widget and select *Edit Widget*.
- Choose the script you created.

That's it!

## 📄 License

This project is MIT licensed, as found in the [LICENSE][l] file.