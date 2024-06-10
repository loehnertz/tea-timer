# 🍵 Tea Timer

A feature-rich progressive web application (PWA) to help you manage your tea sessions.

It allows you to track the time for each tea infusion, adjust the timer settings, and keep track of the current infusion
count all locally in your browser.

The app supports both Gong Fu Cha and Western-style brewing and comes with predefined tea presets to get you started.

> Gong Fu Cha (功夫茶) is a traditional Chinese tea brewing method that uses a high leaf-to-water ratio and short
> steeping times to extract the best and most nuanced flavors from the tea leaves and to enjoy the tea in multiple
> infusions which reveal different aspects of the tea's flavor profile over time.

#### Use the app [right in your web browser](https://tea-timer.com/).

## Features

- Responsive design that works well on both desktop and mobile devices.
- PWA support for installation on devices and subsequent offline use.
- Dark mode for low-light environments.
- Supports both Gong Fu Cha and Western-style brewing.
- Choose from predefined tea presets.
- Set custom initial infusion time and increment per infusion.
- Timer for each infusion with a countdown and progress bar.
- Audio alerts for the end of the infusion and five seconds before the end to get ready to pour.
- Adjust the timer just for the next infusion if the last one was too strong or too weak.
- Keeps the device awake during an infusion to prevent the timer from disappearing while the tea is brewing.
- Stores and loads settings and infusion count using local storage in case the app is closed during a session.

## Screenshot

![Tea Timer Screenshot](./public/image/screenshot/cropped.jpeg)

## Overview

### Prerequisites

You will need a (somewhat modern) web browser to run this application.

### Running the App

Run the following commands in the project directory to start the app:

```bash
npm install
npm run dev
```

Optionally, install the app on your device as a PWA by clicking on the "Install" button in the address bar or a similar
button in the browser's menu.

#### Alternatively, use the app [right in your web browser](https://tea-timer.com/), hosted on GitHub Pages.

### Built With

- [Vue.js](https://vuejs.org/) - The JS framework used.
- [Bulma](https://bulma.io/) - The CSS framework used.
- [Vite](https://vitejs.dev/) - The build tool used.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgments

- [Mei Leaf](https://meileaf.com/) for the brewing times and being a great source of tea and the knowledge around it.

## More Content

Also see
[my other projects](https://loehnertz.notion.site/Tea-1a5d5e05ba1843feab8dd426277e02d9#dad13281c64744a5a5639ff70dafc7c4)
on tea!
