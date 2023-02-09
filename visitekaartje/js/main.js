console.log('Wagwan World!');

const endpoint = 'https://wd-tribe-api.netlify.app/.netlify/functions/';
const myId = 'cldep08n53vjr0av0e2mnbjv4';
const githubBase = "https://github.com/";

const headerParent = document.querySelector('body > article');
const title = document.querySelector('header > h1');
const avatar = document.querySelector('header > img');
const description = document.querySelector('main > article p');
const githubLink = document.querySelector('footer > section > a:first-of-type');
const websiteLink = document.querySelector('footer > section > a:last-of-type');

// const toggleHeader = (e) => e.target.children[0].classList.toggle('hide');
const hideheader = (e) => {
    const header = e.target.children[0].children[0];
    header.classList.remove('idle');

    setTimeout(() => {
        header.classList.toggle('hide');
    }, 100);
}

const showHeader = (e) => {
    const header = e.target.children[0].children[0];
    header.classList.toggle('hide');
}

const fetchMember = async () => {
    const url = `${endpoint}/member?id=${myId}`;

    const response = await fetch(url);
    const { data } = await response.json();
    return data;
}

headerParent.addEventListener('mouseenter', hideheader);
headerParent.addEventListener('mouseleave', showHeader);

window.addEventListener('load', async () => {
    const { member } = await fetchMember();
    console.log(member);
    const { name, surname, nickname, bio, gitHubHandle } = member;

    bio.html = replaceMultiple(bio.html, [
        ['[fullname]', `${name} ${surname}`],
        ['[nickname]', nickname],
    ]);
    title.innerHTML = `${name} ${surname}`;
    description.innerHTML = bio.html;
    avatar.src = member.avatar;
    githubLink.href = `${githubBase}${gitHubHandle}`;
    websiteLink.href = member.website;

    const dev = {
        name: name,
        surname: surname,
        nickname: nickname
    }

    console.log(dev);
    // description.innerHTML = dev;
});

function replaceMultiple(str, arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][0]);
        console.log(arr[i][1]);
        str = str.replace(arr[i][0], arr[i][1]);
        // console.log(str);
    }
    return str;
}

