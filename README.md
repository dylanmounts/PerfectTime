<a name="readme-top"></a>
<!-- PROJECT SHIELDS -->
[![LinkedIn][linkedin-shield]][linkedin-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dylanmounts/PerfectTime">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![PerfectTime Screen Shot][product-screenshot]](https://PerfectTime.org)

PerfectTime is a highly accurate, overengineered analog clock built using modern web technologies. The clock is rendered with Three.js and designed to synchronize with the NTP pool, ensuring it displays the most accurate time possible.

Key features:
* 3D analog clock rendering using Three.js.
* Synchronization with NTP for accurate timekeeping.
* Customizable display options for user interaction.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Three.js][Three.js]][Three-url]
* [![Node.js][Node.js]][Node-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/en/download)
  - I developed this with Node.js v20.10.0. Other versions may also work but have not been thoroughly tested.

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
5. Access the app in your web browser. By default, it will be available at http://127.0.0.1:3000. This can be changed by setting the PORT and HOSTNAME environment variables.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



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

* [othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template.git) for this README template.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/dylanmounts/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/dylanmounts/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dylan-mounts
[product-logo]: https://github.com/dylanmounts/PerfectTime/blob/main/src/assets/img/favicon-75x75.png
[product-screenshot]: https://github.com/dylanmounts/PerfectTime/blob/main/src/assets/img/perfect-clock-thumb.png
