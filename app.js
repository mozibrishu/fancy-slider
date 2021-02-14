const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const numOfSelected = document.querySelector('.num-selected-image');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const imageItems = document.getElementsByClassName('single-img');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  numOfSelected.style.display = 'flex';
  setSelectedImageNum();
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail single-img" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner();

}

const getImages = (query) => {
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
  setSelectedImageNum();
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  // For zero and Negative Value, Default Value: 1000ms
  let intervalTime = document.getElementById('duration').value;
  const duration = (intervalTime <= 0) ? 1000 : intervalTime;

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

// Enter key Trigger: Search Box
document.getElementById("search").addEventListener("keyup", event => {
  if (event.key === "Enter") searchBtn.click();
});

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// Enter Key Trigger: Slider Change duration Box
document.getElementById("duration").addEventListener("keyup", event => {
  if (event.key === "Enter") sliderBtn.click();
});

const toggleSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle("d-none");
}

const setSelectedImageNum = () => {
  document.getElementById("num-selected-img").innerText = sliders.length;
}

document.getElementById("clear-selected").addEventListener("click", () => {
  for (let i = 0; i < imageItems.length; i++) {
    const element = imageItems[i];
    element.classList.remove("added");
  }
  sliders.length = 0;
  setSelectedImageNum();
})

document.getElementById("all-selected").addEventListener("click", () => {
  for (let i = 0; i < imageItems.length; i++) {
    const element = imageItems[i];
    element.classList.add("added");
    const imageSrc = element.getAttribute('src');
    let item = sliders.indexOf(imageSrc);
    if (item === -1) {
      sliders.push(imageSrc);
    }
  }
  setSelectedImageNum();
})