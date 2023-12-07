import galleryItems from './images.js';

const refs = {
    galleryList: document.querySelector('.js-gallery'),
    lightbox: document.querySelector('.js-lightbox'),
    closeBtn: document.querySelector('.lightbox__button'),
    openingImage: document.querySelector('.lightbox__content img'),
    sliderLeftBtn: document.querySelector('#left'),
    sliderRightBtn: document.querySelector('#right'),
}

//Створеня списку зображень
const createGalleryItem = galleryItems => {
    const galleryItem = document.createElement('li');
    galleryItem.classList.add('gallery__item');

    const galleryLink = document.createElement('a');
    galleryLink.classList.add('gallery__link');

    const galleryImg = document.createElement('img');
    galleryImg.classList.add('gallery__image');
    galleryImg.setAttribute('src', `${galleryItems.preview}`);
    galleryImg.setAttribute('data-source', `${galleryItems.original}`);
    galleryImg.setAttribute('alt', `${galleryItems.description}`);

    galleryLink.append(galleryImg);
    galleryItem.append(galleryLink);

    return galleryItem;
}

const images = galleryItems.map(item => createGalleryItem(item));
refs.galleryList.append(...images);




//======lightbox opening/close
refs.galleryList.addEventListener('click', openFullImage);
refs.lightbox.addEventListener('click', closeFullImageBackdrop);

//====next or previous slide
refs.sliderRightBtn.addEventListener('click', slidering)
refs.sliderLeftBtn.addEventListener('click', slidering)

//===Close button
refs.closeBtn.addEventListener('click', closeFullImage);





function handlerPressEscape (event) {
    if (event.code === 'Escape') {
        closeFullImage();
    } 
}

function handlerPressRightLeft (event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        slidering(event);
    } 
}

function hiddenStartEndButtons () {
    if (refs.galleryList.querySelector('.current').firstElementChild.firstElementChild.src === refs.galleryList.firstElementChild.firstElementChild.firstElementChild.src) {
        refs.sliderLeftBtn.style.visibility = 'hidden'
    } else if (refs.galleryList.querySelector('.current').lastElementChild.firstElementChild.src === refs.galleryList.lastElementChild.firstElementChild.firstElementChild.src) {
        refs.sliderRightBtn.style.visibility = 'hidden'
    } else {
        refs.sliderLeftBtn.style.visibility = 'visible';
        refs.sliderRightBtn.style.visibility = 'visible';
    }
}

function slidering (event) {
    const imgArray = refs.galleryList.children;
    let currentImgIndex = (Array.from(imgArray).findIndex(elem => elem.className === 'gallery__item current'));
    let nexImgIndex = currentImgIndex;
    
    refs.galleryList.querySelector('.current').classList.remove('current');
    let slideDirection= '';
    if (event.code === 'ArrowRight') {
        slideDirection = 'right';
    } else if (event.code === 'ArrowLeft') {
        slideDirection = 'left';
    } else {
        slideDirection = event.currentTarget.id;
    }

    if (slideDirection === 'right') {
        nexImgIndex = currentImgIndex + 1;
    } else if (slideDirection === 'left') {
        nexImgIndex = currentImgIndex - 1;
    }

    let nextImg = imgArray[nexImgIndex].classList.add('current');
    let nextImgUrl = imgArray[nexImgIndex].firstElementChild.firstElementChild.getAttribute('data-source');
    console.log(nextImgUrl);
    refs.openingImage.src = nextImgUrl;

    //start and end of slider
    hiddenStartEndButtons()
}

function openFullImage (event) {
    if (event.target.nodeName === 'IMG') {
        refs.lightbox.classList.add('is-open');
        event.target.parentNode.parentNode.classList.add('current');
        const currentImgUrl = event.target.dataset.source;
        refs.openingImage.src = currentImgUrl;
    }
    
    window.addEventListener('keydown', handlerPressEscape);
    window.addEventListener('keydown', handlerPressRightLeft);
    //====start and end of slider
    hiddenStartEndButtons()
}

function closeFullImageBackdrop (event) {
    if (event.target === event.currentTarget.firstElementChild) {
        refs.lightbox.classList.remove('is-open');
        const currentImg = refs.galleryList.querySelector('.current');
        currentImg.classList.remove('current');
    }
}

function closeFullImage () {
    window.removeEventListener('keydown', handlerPressEscape);
    window.removeEventListener('keydown', handlerPressRightLeft);
    
    refs.lightbox.classList.remove('is-open');
    const currentImg = refs.galleryList.querySelector('.current');
    currentImg.classList.remove('current');
}


