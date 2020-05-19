function mainTemplate(secID, imgSrc, sTitle, content, dwldWin, dwldLinux, srcCode) {
    return `
<section id="${secID}" class="page">
    <header>
        <a href="#home" class="btn btn-primary">Home&nbsp;<i class="fas fa-home"></i></a>
    </header>
    <div class="container mainDiv">
        <div class="text-center">
            <img class="imgMain" src="./assets/img/${imgSrc}" alt="">
            <h1> ${sTitle}</h1>
        </div>
        <div>${content}</div>
        <h3>Downloads</h3>
        <table class="table text-center">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Windows <i class="fab fa-windows fa-lg"></i></th>
                    <th scope="col">Linux <i class="fab fa-linux fa-lg"></i></th>
                    <th scope="col">Source Code <i class="fas fa-code-branch fa-lg"></i></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a  class="btn btn-outline-dark dwlB" href="./downloads/${dwldWin}"
                            target="_blank" role="button"><i class="fas fa-download fa-lg"></i></a></td>
                    <td><a  class="btn btn-outline-dark dwlB" href="./downloads/${dwldLinux}"
                            target="_blank" role="button"><i class="fas fa-download fa-lg"></i></a>
                    </td>
                    <td><a  class="btn btn-outline-dark dwlB"
                            href="https://github.com/PanTheoITS/${srcCode}" target="_blank"
                            role="button">GitHub
                            <i class="fab fa-github-square fa-lg"></i></a></td>
                </tr>
            </tbody>
        </table>
        <br /><br />
    </div>
</section>`;
}



let projects = [];
let projContent = [];

function createProjectItems() {
    const homePage = document.querySelector('#home');

    for (let i = 0; i < projects.length; i++) {
        let projItem = document.createElement('div');
        let imgElement = document.createElement('img');
        let bodyElement = document.createElement('div');
        let titleElement = document.createElement('h4');
        let textElement = document.createElement('p');
        let linkElement = document.createElement('a');
        let statusElement = document.createElement('div');
        let status = projects[i]['status'];

        let secID = projects[i]['hashtag'].substring(1, projects[i]['hashtag'].length);
        let imgSrc = projects[i]['image'];
        let sTitle = projects[i]['title'];
        let content = projContent[0][secID];
        let dwldWin = projects[i]['dwldWin'];
        let dwldLinux = projects[i]['dwldLinux'];
        let srcCode = projects[i]['srcCode'];

        projItem.classList.add('card', 'projItem');
        imgElement.classList.add('card-img-top');
        imgElement.src = `./assets/img/${projects[i]['image']}`;
        bodyElement.classList.add('card-body');
        titleElement.classList.add('card-title');
        titleElement.textContent = projects[i]['name'];
        textElement.classList.add('card-text');
        textElement.textContent = projects[i]['description'];
        statusElement.classList.add('statusPos', 'p-2', 'text-center', 'text-white', (status != 'Completed' && status != 'Pending') ? 'bg-primary' : status);
        statusElement.textContent = status;
        if (secID != '') {
            linkElement.classList.add('btn', 'btn-primary');
            linkElement.textContent = 'Go';
            linkElement.href = projects[i]['hashtag'];
            bodyElement.append(titleElement, textElement, linkElement);
            document.querySelector('#projPages').innerHTML += mainTemplate(secID, imgSrc, sTitle, content, dwldWin, dwldLinux, srcCode);
        } else {
            bodyElement.append(titleElement, textElement);
        }
        projItem.append(imgElement, bodyElement, statusElement);
        homePage.appendChild(projItem);
    }
    check4Hash();
}

function nav2Page(pageURL) {
    let activePage = document.querySelector('.enabled');
    pageTitle = pageURL.replace('#', '');
    pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.substring(1)
    history.pushState({}, pageTitle, pageURL);
    document.title = `My Projects - ${pageTitle}`;
    if (activePage) {
        activePage.classList.remove('enabled');
    }
    document.querySelector(pageURL).classList.add('enabled');

}

function check4Hash() {
    if (!location.hash) {
        history.replaceState({}, 'Home', '#home');
        document.title = 'My Projects - Home';
        document.querySelector('#home').classList.add('enabled');

    } else {
        nav2Page(location.hash);
    }
}

window.onload = () => {
    const links = document.querySelectorAll('a:not(.dwlB)');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            nav2Page(link.getAttribute('href'));
        });
    });

    window.addEventListener('popstate', () => {
        let activePage = document.querySelector('.enabled');

        activePage.classList.remove('enabled');
        document.querySelector(location.hash).classList.add('enabled');

    });
}

fetch('./assets/projects.json')
    .then(res => res.json())
    .then(data => {
        projects = data;
        fetch('./assets/projContent.json')
            .then(res => res.json())
            .then(data => {
                projContent = data;
                createProjectItems();
            });

    });