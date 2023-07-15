const URL = 'https://kitsu.io/api/edge/anime';
const ERROR = `<p class="error-text">ERROR(</p>`
const keys = {
    page: "page",
    filters: "filters",
  };
  const refs = {
    list: document.querySelector(".anime-list"),
    one: document.querySelector(".one"),
    arrow: document.querySelector(".arrow-list"),
    filter: document.querySelector("#filter"),
    ratingbox: document.querySelector(".form-types"),
  };
  function createCard({ attributes } = {}) {
    const titles = attributes?.titles || {};
    const title = titles.en || titles.en_jp || titles.en_us || titles.en_cn || titles.ja_jp || "-";
  
    return `
      <li class="anime-card">
        <a href="https://en.wikipedia.org/wiki/${title.replace("None")}" class="anime-link">
          <div class="anime-cont">
            <img src="${attributes?.posterImage?.small }" alt=""  width="284px" height="352px" />
            <p class="anime-text">${attributes?.description?.slice(0, 500)}</p>
            </div>
            <ul class="rating-list">
              <div style="width:${attributes?.averageRating}%" class="rating-item"></div>
              <li>★</li>
              <li>★</li>
              <li>★</li>
              <li>★</li>
              <li>★</li>
            </ul>
            <h3 class="anime-name">${title}</h3>
        </a>
      </li>
    `;
  }
  
function checkbox() {
    const filterTypeValue = refs.filter.elements.select.value;
    const isEmpty = !filterTypeValue;
  
    refs.ratingbox.classList.toggle("none", isEmpty);
    refs.filter.classList.toggle("filter-type-none-gap", isEmpty);
  }
  const save = (value, key) => localStorage.setItem(key, JSON.stringify(value));

  const load = (key) => {
    const saveLocal = localStorage.getItem(key);
    return saveLocal ? JSON.parse(saveLocal) : undefined;
  };
  
function submitform(e){
  e.preventDefault()
  const forming = new FormData(refs.filter)
  const saving = {};
  forming.forEach((v, k) =>  saving[k] = v)
  save(0, keys.page)
  save(saving, keys.filters)
  addCards()
}
async function addCards() {
    const page = load(keys.page) || 0;
    const filters = load(keys.filters) || null;
    const saving = await fetchTheCards(page, filters);
    refs.list.innerHTML = saving ? saving.map(createCard).join('') : ERROR;
    refs.arrow.classList.remove("none");
  }
  function switchpages(e) {
    e.preventDefault();
  
    const increment = e.target.classList.contains("two") ? 1 : -1;
    let numbers = parseInt(load(keys.page)) || 0;
  
    numbers += increment;
    refs.one.disabled = numbers === 0;
  
    save(numbers, keys.page);
    addCards(numbers);
  }
  async function fetchTheCards(page, filters) {
    const limit = 9;
    const offset = page * limit;
    let url = `${URL}?page[limit]=${limit}&page[offset]=${offset}`;
  
    if (filters?.select) {
      const sortType = filters.ratingbox ? filters.select : `-${filters.select}`;
      url += `&sort=${sortType}`;
    }
  
    refs.arrow.classList.add("none");
    refs.list.innerHTML = `<span class="loader"></span>`;
  
    try {
      const response = await fetch(url);
      const { data } = await response.json();
      return data;
    } catch (error) {
      refs.list.innerHTML = ERROR;
      return [];
    }
  }
refs.arrow.addEventListener("click", switchpages);
refs.filter.addEventListener("submit", submitform);
refs.filter.type.addEventListener('change', checkbox)