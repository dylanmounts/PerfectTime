<a name="readme-top"></a>
<!-- PROJECT SHIELDS -->
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dylanmounts/PerfectTime">
    <img src="https://github.com/dylanmounts/PerfectTime/blob/main/src/assets/img/clock.256x256.png" alt="Logo" width="150" height="150">
  </a>

  <h3 align="center">PerfectTime</h3>

  <p align="center">
    An overengineered analog clock designed to show the perfect time every time.
    <br />
    <a href="https://PerfectTime.org"><strong>https://PerfectTime.org</strong></a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#Configuration">Configuration</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <a href="https://PerfectTime.org">
    <img src="https://github.com/dylanmounts/PerfectTime/blob/main/src/assets/img/perfect-clock-thumb.png" alt="PerfectTime Screen Shot" style="border-radius: 10px;">
  </a>
</p>

PerfectTime is a highly accurate, highly configurable analog clock built using modern web technologies. The clock is rendered with Three.js and designed to synchronize with the NTP pool, ensuring it displays the most accurate time possible across all devices.

Key features:
* Full compatibility with Android and iOS using Ionic's [Capacitor](https://capacitorjs.com/).
* 3D analog clock rendered using Three.js.
* Synchronization with NTP for accurate timekeeping.
* Dynamic design that scales to fit the device.
* Light and dark color schemes.
* Support for 19 different languages.
* Customizable display options for a personalized experience.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Three.js][Three.js]][Three-url]
* [![Node.js][Node.js]][Node-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Capacitor][Capacitor]][Capacitor-url]



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/en/download)
  - This was developed with Node.js v20.11.0. Other versions may also work but have not been thoroughly tested.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dylanmounts/PerfectTime.git
   ```
2. Navigate to the repo directory
    ```sh
    cd PerfectTime
    ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Build the app
   ```sh
   npm run build
   ```
4. Start the app
   ```sh
   npm start
   ```
5. Access the app in your web browser.
   1. By default, it will be available at http://127.0.0.1:8100.
   2. This can be changed by setting the `PERFECT_PORT` and `PERFECT_HOSTNAME` environment variables.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Configuration -->
## Configuration

PerfectTime can be configured using environment variables to suit different deployment environments. Below are the environment variables supported:

* PERFECT_PORT: Specifies the port on which the app runs. If not set, the app defaults to port 8100.
* PERFECT_HOSTNAME: Determines the hostname for the app. Default is 127.0.0.1 when not specified.
* PERFECT_WEB_APP: A boolean (true or false) indicating if the application is running as a web app (desktop browser) or a mobile app (Android or iOS). This affects display and styling configurations unique to mobile devices. Defaults to false.

Additionally, the backend time server will only run if PERFECT_WEB_APP is set to true, since mobile versions rely on the web app's time server to retrieve their perfect time.

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Dylan Mounts - dmounts@gmail.com

Project Link: [https://github.com/dylanmounts/PerfectTime](https://github.com/dylanmounts/PerfectTime)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [NTP Pool Project](https://www.ntppool.org) for providing a free and easily accessible source for accurate time.
* [Atlassian Design System](https://atlassian.design/foundations/color-new/color-palette-new) for the clock's color palette.
* [othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template.git) for this README template.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dylan-mounts
[product-screenshot]: https://github.com/dylanmounts/PerfectTime/blob/main/src/assets/img/perfect-clock-thumb.png
[Three.js]: https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white
[Three-url]: https://threejs.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Capacitor]: https://img.shields.io/badge/Capacitor-006DB6?style=for-the-badge&logo=capacitor&logoColor=white
[Capacitor-url]: https://capacitorjs.com/
