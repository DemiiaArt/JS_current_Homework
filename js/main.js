//=================================================================
//=====================REFS========================================
const refs = {
  burgerIconCheck: document.querySelector("#burgerIconCheck"),

  jokeForm: document.querySelector("#jokeForm"),
  jokesCategories: document.querySelector("#jokesCategories"),
  searchindField: document.querySelector("#searchindField"),

  randomInput: document.querySelector("input[id=random]"),
  categoriesInput: document.querySelector("input[id=categories]"),
  searchInput: document.querySelector("input[id=search]"),

  jokesList: document.querySelector("#jokesList"),
  likedJokesList: document.querySelector("#likedJokesList"),
};

const URLS = {
  API: "https://api.chucknorris.io/jokes",

  random: "/random",
  categories: "/random?category=",
  search: "/search?query=",
};

//==========Opening backdrop===========
refs.burgerIconCheck.addEventListener("change", (event) => {
  const backdropSection = document.querySelector(".backdrop");
  if (event.target.checked) {
    backdropSection.classList.add("isOpen");
  } else {
    backdropSection.classList.remove("isOpen");
  }
});

//====get File
const getData = (file) =>
  fetch(file)
    .then((data) => (data.ok ? data.json() : Promise.reject(data.statusText)))
    .catch((error) => console.log(error));

const getFromLocalStorage = (key, defaultValue = []) => {
  let storage = localStorage.getItem(key);
  storage = storage ? JSON.parse(storage) : defaultValue;

  return storage;
};


//==========rendering categories & searching==============
const renderCategories = () => {
  getData(URLS.API + "/categories").then((data) => {
    refs.jokesCategories.innerHTML = data
      .map(
        (cat, index) => `
            <li>
                <label>
                    <input type="radio" name="jokeCat" value="${cat}" ${
          !index && "checked"
        }>
                    <span>${cat}</span> 
                </label>
            </li>
            `
      )
      .join("");
  });
};
renderCategories();

refs.jokeForm.addEventListener("change", (event) => {
  if (event.target === refs.categoriesInput) {
    // renderCategories();
    refs.searchindField.classList.remove("chooseVisible");
    refs.jokesCategories.classList.add("chooseVisible");
  } else if (event.target === refs.searchInput) {
    refs.jokesCategories.classList.remove("chooseVisible");
    refs.searchindField.classList.add("chooseVisible");
  } else if (event.target === refs.randomInput) {
    refs.jokesCategories.classList.remove("chooseVisible");
    refs.searchindField.classList.remove("chooseVisible");
  }
});

//==========form submit==============

refs.jokeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let jokeType = refs.jokeForm.querySelector(
    "input[name=jokeFinder]:checked"
  ).value;
  let jokeAPI = URLS.API;

  switch (jokeType) {
    case "random":
      jokeAPI += URLS.random;
      break;
    case "categories":
      let checkedCategory = jokesCategories.querySelector(
        `input[name=jokeCat]:checked`
      ).value;
      jokeAPI += URLS.categories + checkedCategory;
      break;
    case "search":
      const queryValue = encodeURIComponent(refs.searchindField.value);

      if (queryValue.length < 3 || queryValue.length > 120) {
        console.log("ALERRT");
        return;
      }

      jokeAPI += URLS.search + queryValue;
  }

  getData(jokeAPI).then((data) =>
    data.result
      ? data.result.forEach((joke) => renderJoke(joke))
      : renderJoke(data)
  );
  // getData(jokeAPI).then(data => console.dir(data));
});



//==========Rendering joke cards==============

// Joke card__body
const cardBodyRender = (jokeId, jokeText) =>
  `<p>ID: <a href="https://api.chucknorris.io/jokes/${jokeId}">${jokeId} <span class="icon-link"></span></a></p>
    <p class="joke">${jokeText}</p>`;

// Joke card__info
const cardInfoRender = (jokeUpdate, jokeCat) => {
  let nowDate = new Date().getTime();
  let updateDate = Date.parse(jokeUpdate);

  if (jokeCat.length) {
    return `
        <div class="card__info">
            <p>Last update: <span>${Math.floor(
              (nowDate - updateDate) / (1000 * 60 * 60)
            )} hours ago</span></p>
            ${jokeCat.map((cat) => `<span class="tag">${cat}</span>`)}
        </div>`;
  } else {
    return `
        <div class="card__info">
            <p>Last update: <span>${Math.floor(
              (nowDate - updateDate) / (1000 * 60 * 60)
            )} hours ago</span></p>
        </div>`;
  }
};

const renderJoke = (joke) => {
  const jokeCard = document.createElement("li");
  jokeCard.dataset.id = joke.id;
  jokeCard.className = "card";

  //Joke Icon
  const jokeIcon = document.createElement("div");
  jokeIcon.className = "jokeIcon";
  // let iconImg = fetch(joke.icon_url)
  // console.log(iconImg);
  jokeIcon.innerHTML = `<img src="./img/jokeIcon.png" alt="joke icon" width="20" height="18">`;
  // console.log(joke.icon_url);

  //Joke Body
  const jokeCardBody = document.createElement("div");
  jokeCardBody.className = "card__body";
  jokeCardBody.innerHTML = [
    cardBodyRender(joke.id, joke.value),
    cardInfoRender(joke.updated_at, joke.categories),
  ].join("");

  // Joke likeButon
  const likeBtn = document.createElement("button");
  likeBtn.setAttribute("id", "likeIcon");
  if (joke.liked) {
    likeBtn.classList.add("icon-heart");
    likeBtn.classList.remove("icon-Vector");
  } else {
    likeBtn.classList.add("icon-Vector");
    likeBtn.classList.remove("icon-heart");
  }

  // Joke 💛 Like 💛
  likeBtn.addEventListener("click", () => {
    let storageJokes = getFromLocalStorage("likedJokes");
    console.log(storageJokes);
    let storageJokeIndex = storageJokes.findIndex(
      (item) => item.id === joke.id
    );

    if (storageJokeIndex === -1) {
      joke.liked = true;
      storageJokes.push(joke);
      let likeHeart = refs.jokesList.querySelector(
        `.card[data-id="${joke.id}"] #likeIcon`
      );
      likeHeart.classList.remove("icon-Vector");
      likeHeart.classList.add("icon-heart");
      renderJoke(joke);
    } else {
      storageJokes.splice(storageJokeIndex, 1);
      let currentJokeContainer = refs.jokesList.querySelector(
        `.card[data-id="${joke.id}"]`
      );
      console.log(currentJokeContainer);
      refs.likedJokesList.querySelector(`.card[data-id="${joke.id}"]`).remove();

      if (currentJokeContainer) {
        currentJokeContainer
          .querySelector("#likeIcon")
          .classList.remove("icon-heart");
        currentJokeContainer
          .querySelector("#likeIcon")
          .classList.add("icon-Vector");
      }
    }

    localStorage.setItem("likedJokes", JSON.stringify(storageJokes));
  });

  jokeCard.append(jokeIcon, jokeCardBody, likeBtn);
  joke.liked
    ? refs.likedJokesList.prepend(jokeCard)
    : refs.jokesList.prepend(jokeCard);
};

const renderFavouriteCards = () => {
  getFromLocalStorage("likedJokes").forEach((item) => renderJoke(item));
};

renderFavouriteCards();
