<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">AMPOLA</h3>

  <p align="center">
    Virtual machine manager with <a href="https://www.virtualbox.org/wiki/Linux_Downloads">Virtualbox</a> and <a href="https://guacamole.apache.org/">Guacamole</a>
    <br />
    <a href="https://github.com/ludersGabriel/tcc"><strong>Explore the codebase »</strong></a>
    <br />
    <br />
    <!-- <a href="https://github.com/ludersGabriel/tcc">View Demo</a>
    ·
    <a href="https://github.com/ludersGabriel/tcc/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ludersGabriel/tcc/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p> -->
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is a proof of concept of a virtual machine manager on the web to accelerate and facilitate the process of creating controlled systems for malware analysis and access to these environments.

It was mainly tested using [Ubuntu 24.04][Ubuntu-url] and [Ubuntu 20.04][Ubuntu-2004-url] and it uses [Virtualbox][Virtualbox-url] for the orchestration of the virtual machines and [Guacamole][Guac-url] with VRDP to connect to the virtual machines through the web

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Vite][Vite]][Vite]
* [![React][React.js]][React-url]
* [![NodeJS][NodeJS]][Node-url]
* [![Postgres][Postgres]][Postgres-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Here you will find instructions on how to get a local version running on [Ubuntu 20.04][Ubuntu-url], the LTS version of Ubuntu at the time this README was written.

### Prerequisites

* [Download and install Ubuntu 24.04](https://ubuntu.com/download/desktop)

* Node
  ```sh
  # installs nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

  # download and install Node.js (you may need to restart the terminal)
  nvm install 20.15.0

  # verifies the right Node.js version is in the environment
  node -v # should print `v20.15.0`

  # verifies that npm has been installed
  npm -v
  ```

* Download and install [Docker](https://docs.docker.com/engine/install/ubuntu/) for ubuntu 24.04

* Download and install [Virtualbox](https://download.virtualbox.org/virtualbox/7.0.18/virtualbox-7.0_7.0.18-162988~Ubuntu~noble_amd64.deb) for ubuntu 24.04:

  ```sh
    # to get C and kernel building functionalities necessary for vbox
    sudo apt-get install build-essential 
    
    # download virtualbox version
    sudo dpkg -i ~/Downloads/virtualbox-7.0_7.0.18-162988~Ubuntu~noble_amd64.deb 

    # Get the missing dependencies shown by dpkg
    sudo apt --fix-broken install 

    # to reconfigure vbox after fixing the missing dependencies
    sudo /sbin/vboxconfig 
  ```

  and the [virtualbox extensions pack](https://download.virtualbox.org/virtualbox/7.0.18/Oracle_VM_VirtualBox_Extension_Pack-7.0.18.vbox-extpack) that is needed so we can have VRDP access to the virtual machines

  ```sh
    # install the extension downloaded above
    virtualbox ~/Downloads/Oracle_VM_VirtualBox_Extension_Pack-7.0.18.vbox-extpack
  ```

* OVAS

  Since the system only manages VMs, there is a need for pre defined OVAS so virtualbox can use them to create the VMs for the users.

  These images also need to have [Virtualbox Guest Additions](https://www.virtualbox.org/manual/ch04.html) so we can control them with [VBoxManage](https://www.virtualbox.org/manual/ch08.html) and, due constraints of the system for file transfer, they need to have a single user that is admin and has no password.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ludersGabriel/tcc.git ampola
   cd ampola
   ```
2. Install NPM packages

  * Backend
    ```sh
    cd backend
    npm install
    cd ..
    ```

    Also move or copy your pre-defined OVAS to `backend/src/ovas`

  * Frontend
    ```sh
      cd frontend
      npm install
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Running

1. Run the dockers for the database and the guacamole-daemon
   ```sh
    cd backend
    docker compose up -d
    docker ps # ve
   ```

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/ludersGabriel/tcc/issues) for a full list of proposed features (and known issues).

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

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - ludersdev@gmail.com.com

Project Link: [https://github.com/ludersGabriel/tcc](https://github.com/ludersGabriel/tcc)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-url]: https://github.com/ludersGabriel/tcc/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/gabriel-luders-25bb4620a
[product-screenshot]: images/screenshot.png

[Vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

[Guac-url]: https://guacamole.apache.org/
[Virtualbox-url]: https://www.virtualbox.org/wiki/Linux_Downloads

[Ubuntu-url]: https://ubuntu.com/blog/tag/ubuntu-24-04-lts
[Ubuntu-2004-url]: https://releases.ubuntu.com/focal/