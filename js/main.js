const refs = {
    gallery: document.querySelector('.gallery'),
    backdrop: document.querySelector('.backdrop'),
    openingImage: document.querySelector('.modal img'),
    closeIcon: document.querySelector('.close-icon'),
    sliderLeftBtn: document.querySelector('#left'),
    sliderRightBtn: document.querySelector('#right'),
}

//====next or previous slide
refs.sliderRightBtn.addEventListener('click', slidering)
refs.sliderLeftBtn.addEventListener('click', slidering)


refs.gallery.addEventListener('click', OpenFullImage)
refs.backdrop.addEventListener('click', closeFullImageBackdrop)


//======Close button
refs.closeIcon.addEventListener('click', closeFullImage)
refs.closeIcon.addEventListener('mousedown', tapDownCloseButton)
refs.closeIcon.addEventListener('mouseup', tapUpCloseButton)

// function getFullSizeImg (imgSrc) {
//     // console.dir(String);
//     let delIndex = (imgSrc.search('.jpg')) - 2;
//     // console.log(delIndex);
//     let stringStart = imgSrc.substring(0, delIndex);
//     let srtingEnd = imgSrc.substring((delIndex + 1), imgSrc.length)
//     // console.log(stringStart);
//     // console.log(srtingEnd);
//     return stringStart.concat(srtingEnd)
// }

function slidering (event) {
    const imgArray = refs.gallery.children;
    let currentImgIndex = (Array.from(imgArray).findIndex(elem => elem.className === 'current'));
    let nexImgIndex = currentImgIndex;

    refs.gallery.querySelector('.current').classList.remove('current');
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
    let nextImgUrl = imgArray[nexImgIndex].firstElementChild.currentSrc;
    // let modifyUrl = getFullSizeImg(nextImgUrl);
    refs.openingImage.src = nextImgUrl;

    //start and end of slider
    hiddenStartEndButtons()
}

function hiddenStartEndButtons () {
    if (refs.gallery.querySelector('.current').firstElementChild.src === refs.gallery.firstElementChild.firstElementChild.src) {
        refs.sliderLeftBtn.style.visibility = 'hidden'
    } else if (refs.gallery.querySelector('.current').firstElementChild.src === refs.gallery.lastElementChild.firstElementChild.src) {
        refs.sliderRightBtn.style.visibility = 'hidden'
    } else {
        refs.sliderLeftBtn.style.visibility = 'visible';
        refs.sliderRightBtn.style.visibility = 'visible';
    }
}

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


function OpenFullImage (event) {
    if (event.target.nodeName === 'IMG') {
        refs.gallery.parentNode.classList.add('show-modal');
        event.target.parentNode.classList.add('current');
        const currentImgUrl = event.target.src;
        // let modifyUrl = getFullSizeImg(currentImgUrl);
        refs.openingImage.src = currentImgUrl;
    }
    
    window.addEventListener('keydown', handlerPressEscape);
    window.addEventListener('keydown', handlerPressRightLeft);
    //start and end of slider
    hiddenStartEndButtons()
}

function closeFullImageBackdrop (event) {
    if (event.target === event.currentTarget) {
        refs.gallery.parentNode.classList.remove('show-modal');
        const currentImg = refs.gallery.querySelector('.current');
        currentImg.classList.remove('current');
    }
}

function closeFullImage () {
    window.removeEventListener('keydown', handlerPressEscape);
    window.removeEventListener('keydown', handlerPressRightLeft);
    
    refs.gallery.parentNode.classList.remove('show-modal');
    const currentImg = refs.gallery.querySelector('.current');
    currentImg.classList.remove('current');
}



//===Close button===//
const buttonDefaultColor = 'rgb(46, 46, 46)';
const buttonTapColor = 'rgb(112, 112, 112)';

function tapDownCloseButton (event) {
    if (event.target.parentNode.className === 'close-icon') {
        refs.closeIcon.style.backgroundColor = buttonTapColor;
    }
}
function tapUpCloseButton (event) {
    if (event.target.parentNode.className === 'close-icon') {
        refs.closeIcon.style.backgroundColor = buttonDefaultColor;
    }
}