const searchInput = document.querySelector(".search-input");
const dropdownList = document.querySelector(".dropdown");
const cardList = document.querySelector(".information-card");
const USER_PER_PAGE = 5;

searchInput.addEventListener("keyup", debounce(HandlerInput, 500));

function HandlerInput() {
  clearDropdownList();
  if (!(searchInput.value.trim() == "")) {
    searchRepo(searchInput.value);
  }
}

function clearDropdownList() {
  if (document.querySelectorAll(".dropdown__item") != undefined) {
    document.querySelectorAll(".dropdown__item").forEach((el) => el.remove());
  }
}

async function searchRepo(request) {
  try {
    const repos = await fetch(
      `https://api.github.com/search/repositories?q=${request}&per_page=${USER_PER_PAGE}`
    );

    const data = await repos.json();
    const items = data.items;

    items.forEach((el) => dropDown(el));
    console.log(data.items);
    return data.items;
  } catch (e) {
    console.error(e);
  }
}

function dropDown(repo) {
  const listItem = document.createElement("li");
  listItem.addEventListener("click", () => {
    showDetails(repo.name, repo.owner.login, repo.stargazers_count);
    searchInput.value = "";
    clearDropdownList();
  });
  listItem.className = "dropdown__item";
  listItem.textContent = `${repo.name}`;
  dropdownList.append(listItem);
}

function debounce(fn, debounceTime) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
}

function showDetails(repo, owner, stars) {
  const cardItem = document.createElement("li");
  cardItem.className = "information-card__item";
  cardItem.innerHTML = `<div><p>Name: ${repo}</p><p>Owner: ${owner}</p><p>Stars: ${stars}</p></div>`;
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn";
  cardItem.append(deleteBtn);
  cardList.append(cardItem);
}

cardList.addEventListener("click", (e) => {
  const isBtn = e.target.closest(".btn");
  const chosenCard = e.target.closest(".information-card__item");
  if (isBtn) {
    chosenCard.remove();
  }
});
