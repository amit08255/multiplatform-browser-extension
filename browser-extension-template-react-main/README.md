# Browser Extension Template React

## Introduction

To help you ship faster using the code base you are most familiar with, we've made 3 easy to use templates. 

* Vue 3 Template [https://github.com/serversideup/browser-extension-template-vue-3](https://github.com/serversideup/browser-extension-template-vue-3)
* React Template [https://github.com/serversideup/browser-extension-template-react](https://github.com/serversideup/browser-extension-template-react)
* Vanilla JS Template [https://github.com/serversideup/browser-extension-template-vanilla-js](https://github.com/serversideup/browser-extension-template-vanilla-js)

These templates have the structure you need along with code samples to get your browser extension off the ground quickly.

## How To Use

In all the templates, I included a lot of stubbed out example code. Since there are so many moving parts, I wanted to have everything wired up and ready for your modification. 

Once you pull the template, feel free to delete features you don't need, rename messages, add styles, do whatever it takes to make the extension your own. That's what it's meant for! I tried to make each feature as clearly defined as possible so you can modify or remove what you don't need, but have a nice starting point to kick off your development.

## Getting Up and Running

The first step you need to do is install all the dependencies:

```bash
npm install
```

or

```bash
yarn install
```

Once you have your dependencies installed you are ready to go.

To build your extension, simply run:

```bash
npx mix
```

During active development, run:

```bash
npx mix watch
```

Now your extension will be compiled whenever your code changes. You are now ready to load your extension into the browser.

## Loading Your Extension

Now that we have our extensions being built, the next step is to install and debug them locally within your browser. Of course, each browser is different so we will go through each one individually.

### Chrome

#### Step 1: Navigate to Extensions Page

Open up your Chrome browser and navigate to your extensions page by typing in the following URL in your browser window:

```
chrome://extensions/
```

#### Step 2: Enable Developer Mode
Once you are on this page, you should see in the top right a toggle to enable “Developer mode”. You want to turn this on.

![Chrome Developer Mode](https://serversideup.net/wp-content/uploads/2023/12/chrome-developer-mode.png)

#### Step 3: Load Your Unpacked Extension
Once you enable "Developer mode" you will get an option in the upper left of your screen to "Load unpacked". 

![Chrome Load Unpacked](https://serversideup.net/wp-content/uploads/2023/12/chrome-load-unpacked.png)

This allows you to open up the extension you just built. With Chrome, you want to select the directory of the extension (different, of course, than Firefox in the next step). So when you click "Load unpacked", you will be prompted to load an unpacked extension. Click `/{your-extension}/dist/chrome` directory. If you followed the steps above, your extension should load no problem.

Right now there’s not a lot to debug, but if you wanted to debug the background script, you’d click the "service worker (Inactive)"" under your extension card. You will then get a chrome console that shows any debugging needed. If errors appear in your extension an "Errors" button will appear next to the "Remove" button. When we get into content scripts and popups I’ll show you where to find the debugging tools for them as well.

### Firefox
#### Step 1: Navigate to about:debugging

Open Firefox and navigate to `about:debugging` in the address bar. Then click on "This Firefox".

![Firefox About Debugging](https://serversideup.net/wp-content/uploads/2023/12/firefox-about-debugging.png)

From here, you will want to click “Load Temporary Add-on”. This will open a popup window where you should navigate to the built part of your extension directory and load the manifest.json file. Different than Chrome where you select the entire directory. You want to only select just the `manifest.json` file.

#### Step 2: Debugging
After you’ve loaded your extension, you can inspect the console for the extension by clicking "Inspect" in the top right of the card for your extension.

![Firefox Inspect](https://serversideup.net/wp-content/uploads/2023/12/firefox-inspect.png)

A Firefox console should appear and you can debug your extension!

### Safari
With Safari, there are quite a few more steps to get your extension ready for debugging. Since we have to make an Xcode project and build through Xcode we need to make sure everything is configured. Before getting started, you will need to ensure your Mac is up-to-date so you can use the `xcrun` command-line tool.

#### Step 1: Set Up Xcode Project
The first step is to set up our Xcode project. What's really helpful is Xcode has a tool to convert a functioning Manifest V3 extension into a working Xcode + Safari extension. 

Open up a new terminal and navigate to the root directory of your extension where the `/dist` folder is. in that directory run the following command:

```bash
xcrun safari-web-extension-converter safari
```

The last option of `safari` is the root directory of the extension we compiled through our build script. You will see the command run, a new directory with the name of your browser extension will be created, and Xcode will open upon completion. 

There are a lot of options you can pass to the command depending on your development environment. You can read more about them here: [https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari). 

The only heads up is I would **NOT** use the `--copy-resources` option. Reason being is this will copy all the compiled resources into your new directory and will slow down the dev and testing process. When we make changes to our codebase, we copy the changes to the `/dist/safari` directory and we want to debug in Safari immediately. To save time, don't use the `--copy-resources` option and the extension will read from the `/dist/safari` directory.

#### Step 2: Build Xcode Project
Once Xcode opens up, you can build your project. The project is set up to work on Safari iOS as well. For the sake of this book, we are going to be building for Safari on Mac. Make sure you have the build target set to `(macOs)`.

![Safari Extension Xcode Build Target MacOs](https://serversideup.net/wp-content/uploads/2023/12/safari-xcode-build-mac.png)

Once selected, click the "Play" icon in the top left sidebar of Xcode.

![Safari Extension Xcode Build](https://serversideup.net/wp-content/uploads/2023/12/safari-xcode-play.png)

Your extension will build and be ready to test. However, we need to set up Safari to recognize and run the "unsigned extension".

#### Step 3: Configure Safari to Run Unsigned Extensions
This is probably the most confusing part of the process. However, it's also the most important. By default, Safari is not set up to run "unsigned" extensions. Until you provide a development certificate, your extension will remain unsigned. To enable testing if your extension, we will be [following the official documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension#3744467).

First, we need to enable the developer features within Safari. Navigate to Safari > Settings > Advanced Tab and check "Show features for web developers".

![Safari web dev features](https://serversideup.net/wp-content/uploads/2023/12/safari-show-web-dev-features.png)

Now you will have a "Developer" tab. Click that tab, and find the checkbox "Allow unsigned extensions" and check it.

![Safari allow unsigned extensions](https://serversideup.net/wp-content/uploads/2023/12/safari-unsigned-extensions.png)

When you check the checkbox, you will be prompted to enter your password. After you enter your password, the checkbox will be checked. WARNING: When you close Safari, this will reset when you quit Safari and will have to checked again when you re-open!

Now you have Safari set up to run your un-signed extension.

#### Step 4: Load your Unsigned Extension
We can now run our unsigned extension, so we have to load it. If you click on the "Extensions" tab in your Safari settings, you should see the extension that was built in Step 2. For this example, we are using our [Vue 3 Browser Extension Template](https://github.com/serversideup/browser-extension-template-vue-3). Make sure the checkbox is checked and your extension will appear in Safari!

![Safari development enable development extension](https://serversideup.net/wp-content/uploads/2023/12/safari-enabled-extension.png)

You can now use your development extension in Safari! It will appear to the top left of your search bar:

![Safari development extension UI](https://serversideup.net/wp-content/uploads/2023/12/safari-icon.png)

### Edge

Considering Edge is a port of Chrome, the process is very similar.

#### Step 1: Navigate to Extensions Page

Open up your Edge browser and navigate to your extensions page by typing in the following URL in your browser window:

```
edge://extensions/
```

#### Step 2: Enable Developer Mode
Once you are on this page, you should see in the bottom left a toggle to enable “Developer mode”. You want to turn this on.

![Edge Developer Mode](https://serversideup.net/wp-content/uploads/2023/12/edge-developer-mode.png)

#### Step 3: Load Your Unpacked Extension
Once you enable "Developer mode" you will get an option in the middle of your screen to "Load Unpacked" extension.

![Edge Load Unpacked](https://serversideup.net/wp-content/uploads/2023/12/edge-load-unpacked.png)

This allows you to open up the extension you just built. With Edge (similar to Chrome), you want to select the directory of the extension. So when you click "Load unpacked", you will be prompted to load an unpacked extension. Click `/{your-extension}/dist/edge` directory. If you followed the steps above, your extension should load no problem.

Right now there’s not a lot to debug, but if you wanted to debug the background script, you’d click the "Details" under your extension card. 

![Edge Details](https://serversideup.net/wp-content/uploads/2023/12/edge-details.png)

You will be brought to a screen where you see more information about your extension. On this screen, click "service worker" link under "Inspect Views".

![Edge Inspect Views](https://serversideup.net/wp-content/uploads/2023/12/edge-service-worker.png)

You will then get a developer console that shows any debugging needed. I'll show you how to debug all the other pieces of the extension as we develop it.

## Resources
- **[Discord](https://serversideup.net/discord)** for friendly support from the community and the team.
- **[GitHub](https://github.com/serversideup/docker-php)** for source code, bug reports, and project management.
- **[Get Professional Help](https://serversideup.net/professional-support)** - Get video + screen-sharing help directly from the core contributors.

## Contributing
As an open-source project, we strive for transparency and collaboration in our development process. We greatly appreciate any contributions members of our community can provide. Whether you're fixing bugs, proposing features, improving documentation, or spreading awareness - your involvement strengthens the project. Please review our [contribution guidelines](https://serversideup.net/open-source/docker-php/docs/getting-started/contributing) and [code of conduct](./.github/code_of_conduct.md) to understand how we work together respectfully.

- **Bug Report**: If you're experiencing an issue while using these images, please [create an issue](https://github.com/serversideup/docker-php/issues/new/choose).
- **Feature Request**: Make this project better by [submitting a feature request](https://github.com/serversideup/docker-php/discussions/66).
- **Documentation**: Improve our documentation by [submitting a documentation change](./docs/README.md).
- **Community Support**: Help others on [GitHub Discussions](https://github.com/serversideup/docker-php/discussions) or [Discord](https://serversideup.net/discord).
- **Security Report**: Report critical security issues via [our responsible disclosure policy](https://www.notion.so/Responsible-Disclosure-Policy-421a6a3be1714d388ebbadba7eebbdc8).

Need help getting started? Join our Discord community and we'll help you out!

<a href="https://serversideup.net/discord"><img src="https://serversideup.net/wp-content/themes/serversideup/images/open-source/join-discord.svg" title="Join Discord"></a>

## Our Sponsors
All of our software is free an open to the world. None of this can be brought to you without the financial backing of our sponsors.

<p align="center"><a href="https://github.com/sponsors/serversideup"><img src="https://521public.s3.amazonaws.com/serversideup/sponsors/sponsor-box.png" alt="Sponsors"></a></p>

#### Individual Supporters
<!-- supporters --><a href="https://github.com/deligoez"><img src="https://github.com/deligoez.png" width="40px" alt="deligoez" /></a>&nbsp;&nbsp;<a href="https://github.com/alexjustesen"><img src="https://github.com/alexjustesen.png" width="40px" alt="alexjustesen" /></a>&nbsp;&nbsp;<a href="https://github.com/jeremykenedy"><img src="https://github.com/jeremykenedy.png" width="40px" alt="jeremykenedy" /></a>&nbsp;&nbsp;<a href="https://github.com/GeekDougle"><img src="https://github.com/GeekDougle.png" width="40px" alt="GeekDougle" /></a>&nbsp;&nbsp;<!-- supporters -->

## About Us
We're [Dan](https://twitter.com/danpastori) and [Jay](https://twitter.com/jaydrogers) - a two person team with a passion for open source products. We created [Server Side Up](https://serversideup.net) to help share what we learn.

<div align="center">

| <div align="center">Dan Pastori</div>                  | <div align="center">Jay Rogers</div>                                 |
| ----------------------------- | ------------------------------------------ |
| <div align="center"><a href="https://twitter.com/danpastori"><img src="https://serversideup.net/wp-content/uploads/2023/08/dan.jpg" title="Dan Pastori" width="150px"></a><br /><a href="https://twitter.com/danpastori"><img src="https://serversideup.net/wp-content/themes/serversideup/images/open-source/twitter.svg" title="Twitter" width="24px"></a><a href="https://github.com/danpastori"><img src="https://serversideup.net/wp-content/themes/serversideup/images/open-source/github.svg" title="GitHub" width="24px"></a></div>                        | <div align="center"><a href="https://twitter.com/jaydrogers"><img src="https://serversideup.net/wp-content/uploads/2023/08/jay.jpg" title="Jay Rogers" width="150px"></a><br /><a href="https://twitter.com/jaydrogers"><img src="https://serversideup.net/wp-content/themes/serversideup/images/open-source/twitter.svg" title="Twitter" width="24px"></a><a href="https://github.com/jaydrogers"><img src="https://serversideup.net/wp-content/themes/serversideup/images/open-source/github.svg" title="GitHub" width="24px"></a></div>                                       |

</div>

### Find us at:

* **📖 [Blog](https://serversideup.net)** - Get the latest guides and free courses on all things web/mobile development.
* **🙋 [Community](https://community.serversideup.net)** - Get friendly help from our community members.
* **🤵‍♂️ [Get Professional Help](https://serversideup.net/professional-support)** - Get video + screen-sharing support from the core contributors.
* **💻 [GitHub](https://github.com/serversideup)** - Check out our other open source projects.
* **📫 [Newsletter](https://serversideup.net/subscribe)** - Skip the algorithms and get quality content right to your inbox.
* **🐥 [Twitter](https://twitter.com/serversideup)** - You can also follow [Dan](https://twitter.com/danpastori) and [Jay](https://twitter.com/jaydrogers).
* **❤️ [Sponsor Us](https://github.com/sponsors/serversideup)** - Please consider sponsoring us so we can create more helpful resources.

## Our products
If you appreciate this project, be sure to check out our other projects.

### 📚 Books
- **[The Ultimate Guide to Building APIs & SPAs](https://serversideup.net/ultimate-guide-to-building-apis-and-spas-with-laravel-and-nuxt3/)**: Build web & mobile apps from the same codebase.
- **[Building Multi-Platform Browser Extensions](https://serversideup.net/building-multi-platform-browser-extensions/)**: Use one codebase to generate browser extensions for Chrome, Firefox, Edge, and Safari

### 🛠️ Software-as-a-Service
- **[Bugflow](https://bugflow.io/)**: Get visual bug reports directly in GitHub, GitLab, and more.
- **[SelfHost Pro](https://selfhostpro.com/)**: Connect Stripe or Lemonsqueezy to a private docker registry for self-hosted apps.

### 🌍 Open Source
- **[AmplitudeJS](https://521dimensions.com/open-source/amplitudejs)**: Open-source HTML5 & JavaScript Web Audio Library.
- **[Spin](https://serversideup.net/open-source/spin/)**: Laravel Sail alternative for running Docker from development → production.
- **[Financial Freedom](https://github.com/serversideup/financial-freedom)**: Open source alternative to Mint, YNAB, & Monarch Money.
