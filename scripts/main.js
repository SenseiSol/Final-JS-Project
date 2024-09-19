const cardsTemplate = document.querySelector('.card'); 
const cardsRow = document.querySelector('#cards-row');

const searchFilter = document.querySelector('#search-filter');
const selectFilter = document.querySelector('#select-filter');
const themeBtn = document.querySelector('#toggle-theme');

let allCardsData = []; 

function updateCards() {
    // Очищаем рендер на странице
    cardsRow.innerHTML = '';

    const filteredCards = filterCards(allCardsData);

    filteredCards.forEach(loadCard);
}

// Функция для фильтрации карточек
function filterCards(cards) {
    const searchText = searchFilter.value.toLowerCase();
    const filterRegion = selectFilter.value

    return cards.filter(card =>
        card.countryName.toLowerCase().includes(searchText) &&
        (filterRegion === 'all' || card.countryRegion.toLowerCase() === filterRegion)
    );
}

function loadCard({countryFlag, countryName, countryPopulation, countryRegion, countryCapital}) {
    const card = cardsTemplate.cloneNode(true); 
    card.style.display = "flex";

    card.querySelector(".card__image-flag").src = countryFlag;
    card.querySelector(".card__country-name").textContent = countryName;
    card.querySelector(".card__population").innerHTML = `<b>Population</b>: ${countryPopulation.toLocaleString()}`;
    card.querySelector(".card__region").innerHTML = `<b>Region</b>: ${countryRegion}`;
    card.querySelector(".card__capital").innerHTML = `<b>Capital</b>: ${countryCapital}`;

    cardsRow.insertAdjacentElement('beforeend', card);
}

async function getAll() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    return await response.json();
}

async function getAllCards() {
    const allCards = (await getAll()).map((item) => {
    return {
        countryFlag: item.flags.png,
        countryName: item.name.common,
        countryPopulation: item.population,
        countryRegion: item.region,
        countryCapital: item.capital ? item.capital[0] : 'N/A'
    };
  });

    return allCards;
}

// Обработчики событий для фильтров
searchFilter.addEventListener('input', updateCards);
selectFilter.addEventListener('change', updateCards);


themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-bs-theme');

    // Переключаем значение темы у боди
    newTheme = document.body.setAttribute('data-bs-theme', currentTheme === 'light' ? 'dark' : 'light');

    // Ставим темный бекграунд и убираем тени
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = newTheme === 'light' ? 'Dark mode' : 'Light mode';
});

// Запуск рендера при загрузке страницы
(async () => {
    allCardsData = await getAllCards();
    updateCards();
})();


