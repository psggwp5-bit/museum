"use strict";

// Короткие функции для поиска одного элемента и списка элементов.
const getElement = (selector, root = document) => root.querySelector(selector);
const getElements = (selector, root = document) => [...root.querySelectorAll(selector)];
// Текст из блокнота выводим как текст, даже если в нём есть HTML-теги.
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
  );
// Рисунки хранятся прямо в коде, поэтому работают без загрузки картинок.
const createSvg = (body, viewBox = "0 0 560 350", className = "") =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
  viewBox +
  '" class="' +
  className +
  '" aria-hidden="true" focusable="false">' +
  body +
  "</svg>";
const drawIllustration = (body, viewBox) =>
  createSvg(
    '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      body +
      "</g>",
    viewBox
  );
const drawWheel = (x, y, radius = 81) => {
  const spokes = Array.from({ length: 20 }, (_, i) => {
    const angle = (i * Math.PI) / 10;
    return (
      '<path d="M' +
      x +
      " " +
      y +
      "L" +
      (x + Math.cos(angle) * (radius - 5)).toFixed(2) +
      " " +
      (y + Math.sin(angle) * (radius - 5)).toFixed(2) +
      '" stroke-width=".7" opacity=".65"/>'
    );
  }).join("");
  return (
    '<circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="' +
    radius +
    '" stroke-width="4"/><circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="' +
    (radius - 5) +
    '" stroke-width="1"/>' +
    spokes +
    '<circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="5"/>'
  );
};

// Чертежи для игры. x и y — положение детали на рисунке 560 × 350.
const blueprints = {
  bicycle: {
    name: "Велосипед",
    code: "В–01",
    title: "Велосипед готов к открытиям!",
    fact: "Цепь передаёт усилие с педалей на заднее колесо, а треугольники делают раму жёсткой. Два простых принципа — и можно ехать.",
    parts: [
      {
        id: "rear-wheel",
        name: "Заднее колесо",
        x: 125,
        y: 235,
        box: "35 145 180 180",
        art: drawWheel(125, 235)
      },
      {
        id: "front-wheel",
        name: "Переднее колесо",
        x: 430,
        y: 235,
        box: "340 145 180 180",
        art: drawWheel(430, 235)
      },
      {
        id: "frame",
        name: "Рама",
        x: 274,
        y: 162,
        box: "112 112 310 145",
        art:
          '<path d="M125 235L215 127L265 235H125L370 127H215M265 235L370 127" stroke-width="5"/>' +
          '<path d="M370 127L430 235" stroke-width="5"/>' +
          '<path d="M367 127L358 98" stroke-width="4"/>'
      },
      {
        id: "saddle",
        name: "Седло",
        x: 211,
        y: 97,
        box: "173 72 88 66",
        art:
          '<path d="M207 128L211 104" stroke-width="4"/>' +
          '<path d="M184 87Q213 94 245 86L247 95Q222 109 183 99Z" fill="currentColor" fill-opacity=".14"/>' +
          '<path d="M188 104L237 104" stroke-width="1"/>'
      },
      {
        id: "handlebar",
        name: "Руль",
        x: 363,
        y: 77,
        box: "325 42 95 66",
        art:
          '<path d="M358 99L355 76Q354 62 374 62H396Q414 63 403 79L389 83" stroke-width="4"/>' +
          '<path d="M389 82H401" stroke-width="6"/>'
      },
      {
        id: "pedals",
        name: "Педали и цепь",
        x: 270,
        y: 251,
        box: "106 210 225 85",
        art:
          '<circle cx="265" cy="235" r="23"/>' +
          '<circle cx="265" cy="235" r="18" stroke-width=".8"/>' +
          '<path d="M264 212L125 224Q108 235 125 246L264 258" stroke-width="1.3"/>' +
          '<path d="M248 219L283 251" stroke-width="4"/>' +
          '<path d="M278 252H304M229 218H251" stroke-width="5"/>' +
          '<circle cx="265" cy="235" r="4"/>'
      }
    ]
  },
  lamp: {
    name: "Лампа",
    code: "Л–02",
    title: "Кажется, у вас появилась идея!",
    fact: "Ток нагревает нить до свечения. Стеклянная колба с вакуумом или защитным газом помогает нити не сгореть слишком быстро.",
    parts: [
      {
        id: "glass",
        name: "Стеклянная колба",
        x: 281,
        y: 71,
        box: "176 26 210 177",
        art:
          '<path d="M240 195C239 164 190 153 190 103C190 5 370 5 370 103C370 153 321 164 320 195" stroke-width="3"/>' +
          '<path d="M214 101Q214 61 250 55" opacity=".5"/>'
      },
      {
        id: "filament",
        name: "Нить накаливания",
        x: 282,
        y: 113,
        box: "232 87 98 65",
        art: '<path d="M248 132L252 106Q259 91 265 108L273 128Q280 146 286 125L293 105Q300 87 308 107L312 132" stroke-width="3"/>'
      },
      {
        id: "supports",
        name: "Контактные стержни",
        x: 282,
        y: 170,
        box: "225 126 110 94",
        art: '<path d="M249 132L261 204M311 132L299 204" stroke-width="3"/><path d="M270 203L278 148H284L291 203" stroke-width="1"/>'
      },
      {
        id: "base",
        name: "Винтовой цоколь",
        x: 280,
        y: 227,
        box: "226 193 110 70",
        art:
          '<path d="M239 197H321V250H239Z" stroke-width="3"/>' +
          '<path d="M240 208L320 199M240 221L320 212M240 234L320 225M240 247L320 238" stroke-width="2"/>'
      },
      {
        id: "contact",
        name: "Нижний контакт",
        x: 280,
        y: 276,
        box: "240 250 80 40",
        art: '<path d="M242 254L256 274H303L318 254" stroke-width="2"/><path d="M266 277H294" stroke-width="6"/>'
      }
    ]
  },
  plane: {
    name: "Самолёт",
    code: "С–03",
    title: "Можно отправляться в первый полёт!",
    fact: "Крылья создают подъёмную силу, двигатель вращает винт, а рули помогают управлять полётом. Это условная учебная модель, а не точная копия Flyer.",
    parts: [
      {
        id: "fuselage",
        name: "Фюзеляж",
        x: 293,
        y: 191,
        box: "129 149 345 68",
        art:
          '<path d="M142 181L417 168L460 184L419 201L142 193Z" stroke-width="3"/>' +
          '<path d="M200 178L220 190L200 196M254 176L276 188L254 195M313 174L334 187L313 193M370 171L393 186L370 202" stroke-width="1"/>'
      },
      {
        id: "wings",
        name: "Крылья",
        x: 272,
        y: 101,
        box: "113 60 246 101",
        art:
          '<path d="M137 120L302 76L339 100L177 145Z" stroke-width="3"/>' +
          '<path d="M137 145L302 101L339 125L177 169Z" stroke-width="2"/>' +
          '<path d="M151 117L151 146M190 106L190 137M235 95L235 125M278 83L278 113M307 84L307 108M183 144L183 169M233 131L233 155M282 117L282 142M326 105L326 128"/>' +
          '<path d="M190 166L209 181M281 142L282 174M326 130L322 174"/>'
      },
      {
        id: "tail",
        name: "Хвостовое оперение",
        x: 426,
        y: 132,
        box: "365 94 129 93",
        art: '<path d="M386 158L432 117L444 157Z" stroke-width="2"/><path d="M387 163L457 150L481 168L415 180Z" stroke-width="2"/>'
      },
      {
        id: "engine",
        name: "Двигатель",
        x: 166,
        y: 164,
        box: "140 140 69 48",
        art:
          '<path d="M149 153H196V180H149Z" stroke-width="2.5"/>' +
          '<path d="M155 145V154M163 145V154M171 145V154M179 145V154M187 145V154"/>' +
          '<circle cx="184" cy="168" r="6"/>' +
          '<path d="M149 163H137"/>'
      },
      {
        id: "propeller",
        name: "Воздушный винт",
        x: 114,
        y: 183,
        box: "88 132 55 103",
        art:
          '<path d="M119 181C96 157 99 138 112 139C123 139 120 162 119 181ZM119 185C141 208 138 228 125 227C114 226 118 203 119 185Z" fill="currentColor" fill-opacity=".14"/>' +
          '<circle cx="119" cy="183" r="6"/>'
      },
      {
        id: "wheels",
        name: "Шасси",
        x: 274,
        y: 250,
        box: "201 202 149 88",
        art:
          '<path d="M223 205L243 255L279 205M307 203L324 248" stroke-width="3"/>' +
          '<circle cx="246" cy="260" r="18" stroke-width="3"/>' +
          '<circle cx="326" cy="254" r="16" stroke-width="3"/>' +
          '<circle cx="246" cy="260" r="4"/>' +
          '<circle cx="326" cy="254" r="3"/>'
      }
    ]
  }
};

function fullBlueprint(level, dimensions = false) {
  let markup = blueprints[level].parts.map((part) => part.art).join("");
  if (dimensions)
    markup +=
      '<g stroke-width=".6" opacity=".55">' +
      '<path d="M35 325H518M35 318V332M518 318V332M125 330V338M430 330V338M525 154V314M520 154H530M520 314H530" stroke-dasharray="3 3"/>' +
      '<path d="M23 235H535" stroke-dasharray="5 6"/>' +
      "</g>" +
      '<g fill="currentColor" stroke="none" font-family="Georgia,serif" font-size="10" opacity=".7">' +
      '<text x="240" y="342">цепной привод</text>' +
      '<text x="532" y="253" transform="rotate(-90 532 253)">Ø 700</text>' +
      '<text x="345" y="115" font-size="8">fig. 01</text>' +
      "</g>";
  return drawIllustration(markup);
}

const phoneArt = drawIllustration(
  '<ellipse cx="278" cy="290" rx="105" ry="20"/>' +
    '<path d="M179 281L199 269H359L379 281M257 267V151H291V267M247 263H301M248 153H299M259 152L244 118L260 100L291 108L297 129L285 151"/>' +
    '<path d="M256 109L228 98L198 65L181 78L199 116L250 139"/>' +
    '<ellipse cx="190" cy="71" rx="12" ry="25" transform="rotate(-37 190 71)"/>' +
    '<ellipse cx="190" cy="71" rx="7" ry="17" transform="rotate(-37 190 71)"/>' +
    '<path d="M292 151L323 156L332 142M326 146L336 111L353 106L372 117L376 147L364 165L341 159ZM335 115L342 148M370 124L350 122M343 161C312 166 338 190 316 197C291 208 336 221 316 231C296 242 337 256 316 268"/>' +
    '<path d="M204 278H354M216 285H342" opacity=".5"/>' +
    '<circle cx="274" cy="197" r="8"/>' +
    '<path d="M274 189V205M266 197H282"/>' +
    '<path d="M102 156Q130 163 129 185M93 174Q110 176 111 192M91 194H99M405 78Q418 90 415 103M419 63Q443 82 439 106" stroke-width="1" opacity=".5"/>'
);

const cameraArt = drawIllustration(
  '<path d="M151 151L290 116L363 157V248L222 280L151 240Z" stroke-width="2.5"/>' +
    '<path d="M151 151L222 190L363 157M222 190V280M166 159V235L211 260V192" stroke-width="1"/>' +
    '<path d="M224 192L289 177L288 235L224 251Z"/>' +
    '<path d="M234 190V248M244 187V245M254 185V243M264 183V240M274 180V237" stroke-width="1.5"/>' +
    '<ellipse cx="307" cy="205" rx="30" ry="39" transform="rotate(10 307 205)"/>' +
    '<ellipse cx="315" cy="205" rx="27" ry="37" transform="rotate(10 315 205)"/>' +
    '<ellipse cx="319" cy="205" rx="17" ry="24" transform="rotate(10 319 205)"/>' +
    '<ellipse cx="321" cy="205" rx="10" ry="15" transform="rotate(10 321 205)"/>' +
    '<path d="M175 147L171 103L298 73L299 119M182 142V111L289 85V116M175 102L182 111M230 279L222 319M284 265L310 317M247 276L260 325M212 320H231M303 319H319M250 327H270" stroke-width="2"/>' +
    '<path d="M388 138L423 123M389 158H431M385 182L422 201" opacity=".5"/>' +
    '<path d="M187 119L279 96M187 125L279 102M187 131L279 108" stroke-width=".8" opacity=".5"/>'
);

const phonographArt = drawIllustration(
  '<path d="M133 244H420V280H133ZM143 280V291H157V280M395 280V291H409V280"/>' +
    '<path d="M158 244V204H175V244M355 244V204H372V244M170 209H366"/>' +
    '<ellipse cx="206" cy="194" rx="24" ry="37"/>' +
    '<path d="M206 157H321M206 231H321"/>' +
    '<ellipse cx="321" cy="194" rx="24" ry="37"/>' +
    '<ellipse cx="321" cy="194" rx="12" ry="23"/>' +
    '<path d="M220 158V230M229 158V230M238 158V230M247 158V230M256 158V230M265 158V230M274 158V230M283 158V230M292 158V230M301 158V230" stroke-width=".7" opacity=".6"/>' +
    '<path d="M345 194H390L401 204V225H421" stroke-width="3"/>' +
    '<path d="M420 215V237" stroke-width="6"/>' +
    '<path d="M270 157L258 131L314 94L330 115L283 146L287 158"/>' +
    '<ellipse cx="322" cy="101" rx="28" ry="13" transform="rotate(54 322 101)"/>' +
    '<ellipse cx="322" cy="101" rx="20" ry="8" transform="rotate(54 322 101)"/>' +
    '<path d="M278 151L275 180M154 255H401M154 269H401"/>' +
    '<circle cx="168" cy="262" r="3"/>' +
    '<circle cx="387" cy="262" r="3"/>' +
    '<path d="M104 114Q117 126 115 140M91 99Q116 105 126 119" stroke-width="1" opacity=".5"/>'
);

// Содержимое музея: название, автор, назначение, история и интересные факты.
const exhibits = [
  {
    id: "bicycle",
    index: "001",
    category: "movement",
    categoryName: "Движение",
    year: "1885",
    title: "Велосипед",
    author: "Джон Кемп Старли",
    color: "sage",
    art: fullBlueprint("bicycle"),
    description: "Свобода передвижения, которой достаточно двух колёс и силы собственных ног.",
    purpose:
      "Быстро перемещаться на короткие расстояния, используя мускульную силу. Цепь передаёт вращение педалей на заднее колесо.",
    history:
      "В 1885 году Джон Кемп Старли представил Rover — один из ключевых шагов к привычному нам безопасному велосипеду. Велосипеды существовали и раньше: Старли улучшил их конструкцию.",
    facts: [
      "Два колеса близкого размера и более низкая посадка сделали Rover безопаснее моделей с огромным передним колесом.",
      "Цепной привод позволил отделить педали от переднего колеса и удобнее подобрать передаточное отношение."
    ],
    source:
      "https://collection.sciencemuseumgroup.org.uk/objects/co25833/rover-safety-bicycle-1885",
    sourceName: "Science Museum Group"
  },
  {
    id: "telephone",
    index: "002",
    category: "communication",
    categoryName: "Связь и звук",
    year: "1876",
    title: "Телефон",
    author: "Александр Грейам Белл",
    color: "ochre",
    art: phoneArt,
    description: "Голос пересёк расстояние. И разговор перестал требовать встречи.",
    purpose:
      "Передавать человеческую речь на расстояние. Звуковые колебания преобразуются в электрический сигнал, а затем обратно в звук.",
    history:
      "В 1876 году Белл получил знаменитый патент на телефон. Его работа опиралась на исследования звука и электричества; другие изобретатели тоже искали способы передать речь.",
    facts: [
      "До работы над телефоном Белл занимался обучением людей с нарушениями слуха.",
      "В отличие от телеграфного сообщения, речь передавалась без предварительного перевода в азбуку точек и тире."
    ],
    source: "https://www.archives.gov/education/lessons/telephone-light-patents",
    sourceName: "Национальный архив США"
  },
  {
    id: "lamp",
    index: "003",
    category: "everyday",
    categoryName: "Повседневность",
    year: "1879",
    title: "Лампа накаливания",
    author: "Томас Эдисон и его команда",
    color: "rose",
    art: fullBlueprint("lamp"),
    description: "Маленькая светящаяся нить, которая подарила городам ещё один день.",
    purpose: "Освещать помещения: электрический ток нагревает тонкую нить, и она излучает свет.",
    history:
      "В 1879 году команда Эдисона добилась практичного варианта лампы с угольной нитью. Над электрическим освещением работали многие, включая Джозефа Суона; вклад Эдисона также связан с системой электроснабжения.",
    facts: [
      "В ранних лампах нить делали из углеродных материалов.",
      "Воздух из колбы удаляли: без кислорода раскалённая нить служила дольше."
    ],
    source: "https://www.archives.gov/education/lessons/telephone-light-patents",
    sourceName: "Национальный архив США"
  },
  {
    id: "camera",
    index: "004",
    category: "everyday",
    categoryName: "Повседневность",
    year: "1827",
    title: "Фотография",
    author: "Жозеф Нисефор Ньепс",
    color: "ochre",
    art: cameraArt,
    description: "Мгновение стало возможным сохранить. Сначала — с очень большим терпением.",
    purpose:
      "Фиксировать изображение, которое свет формирует в камере. Ранние опыты стали основой фотографии и будущих фотоаппаратов.",
    history:
      "В 1827 году Ньепс создал самую раннюю сохранившуюся фотографию с натуры, полученную камерой-обскурой. Некоторые источники указывают 1826–1827 годы; здесь приведена датировка Harry Ransom Center.",
    facts: [
      "Изображение закреплялось на пластине с покрытием из светочувствительного битума.",
      "Самые ранние снимки требовали очень долгой выдержки: фотографирование ещё не было мгновенным."
    ],
    source: "https://www.hrc.utexas.edu/niepce-heliograph/",
    sourceName: "Harry Ransom Center"
  },
  {
    id: "phonograph",
    index: "005",
    category: "communication",
    categoryName: "Связь и звук",
    year: "1877",
    title: "Фонограф",
    author: "Томас Эдисон и его команда",
    color: "sage",
    art: phonographArt,
    description: "Впервые голос смог остаться в комнате после того, как человек замолчал.",
    purpose:
      "Записывать и воспроизводить звук. Игла оставляет на носителе бороздку, соответствующую звуковым колебаниям.",
    history:
      "В 1877 году в лаборатории Менло-Парк появился фонограф Эдисона — устройство, способное и записывать, и воспроизводить звук. Это важное отличие от более ранних приборов, лишь фиксировавших колебания.",
    facts: [
      "Первый вариант записывал звук на оловянную фольгу, обёрнутую вокруг цилиндра.",
      "Ручка приводила цилиндр во вращение. Хрупкая фольга выдерживала лишь несколько воспроизведений."
    ],
    source: "https://www.nps.gov/edis/learn/kidsyouth/the-phonograph.htm",
    sourceName: "Национальная парковая служба США"
  },
  {
    id: "plane",
    index: "006",
    category: "movement",
    categoryName: "Движение",
    year: "1903",
    title: "Самолёт",
    author: "Уилбур и Орвилл Райт",
    color: "sky",
    art: fullBlueprint("plane"),
    description: "Двенадцать секунд в воздухе открыли человечеству совершенно новый маршрут.",
    purpose:
      "Перевозить людей и грузы по воздуху. Крылья создают подъёмную силу, а силовая установка обеспечивает движение.",
    history:
      "17 декабря 1903 года братья Райт выполнили успешные управляемые полёты на самолёте с двигателем Flyer. За коротким взлётом стояли годы испытаний планёров и изучения аэродинамики.",
    facts: [
      "Первый полёт Орвилла продолжался 12 секунд: самолёт преодолел около 36 метров.",
      "В тот день состоялись четыре полёта. До авиационных опытов братья занимались велосипедами."
    ],
    source: "https://www.nasa.gov/history/120-years-ago-the-first-powered-flight-at-kitty-hawk/",
    sourceName: "NASA"
  }
];

// Коллекция: вывод карточек и переключение категорий.
getElement("#hero-drawing").innerHTML = fullBlueprint("bicycle", true);
function renderExhibits(filter = "all") {
  const filtered = exhibits.filter((exhibit) => filter === "all" || exhibit.category === filter);
  getElement("#exhibit-grid").innerHTML = filtered
    .map(
      (exhibit) =>
        '<article class="exhibit-card"><div class="card-art ' +
        exhibit.color +
        '"><span class="card-index">ЭКСПОНАТ № ' +
        exhibit.index +
        "</span>" +
        exhibit.art +
        '<span class="card-art-label">АРХИВ ОТКРЫТИЙ / ' +
        exhibit.year +
        '</span></div><div class="card-body"><div class="card-meta"><span>' +
        exhibit.categoryName +
        '</span><span class="card-year">' +
        exhibit.year +
        "</span></div><h3>" +
        exhibit.title +
        '</h3><p class="card-author">' +
        exhibit.author +
        '</p><p class="card-description">' +
        exhibit.description +
        '</p><button class="card-open" data-exhibit="' +
        exhibit.id +
        '" aria-label="История изобретения: ' +
        exhibit.title +
        '">История изобретения <span aria-hidden="true">↗</span></button></div></article>'
    )
    .join("");
  getElement("#collection-count").textContent =
    String(filtered.length).padStart(2, "0") +
    " " +
    (filtered.length === 6 ? "экспонатов" : "экспоната");
}
renderExhibits();
getElements(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    getElements(".filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderExhibits(button.dataset.filter);
  })
);

// Окно с подробным описанием выбранного изобретения.
const exhibitDialog = getElement("#exhibit-dialog");
getElement("#exhibit-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-exhibit]");
  if (!button) return;
  const exhibit = exhibits.find((item) => item.id === button.dataset.exhibit);
  if (!exhibit) return;
  getElement("#dialog-content").innerHTML =
    '<div class="dialog-layout"><div class="dialog-art"><span class="eyebrow">ЭКСПОНАТ № ' +
    exhibit.index +
    "</span>" +
    exhibit.art +
    '<span class="dialog-art-note">УСЛОВНАЯ АВТОРСКАЯ ИЛЛЮСТРАЦИЯ</span></div><div class="dialog-info"><p class="eyebrow">' +
    exhibit.categoryName +
    " / " +
    exhibit.year +
    '</p><h2 id="dialog-title">' +
    exhibit.title +
    '</h2><p class="dialog-author">' +
    exhibit.author +
    '</p><div class="detail-block"><h3>Для чего это нужно</h3><p>' +
    exhibit.purpose +
    '</p></div><div class="detail-block"><h3>Откуда взялась идея</h3><p>' +
    exhibit.history +
    '</p></div><div class="detail-block"><h3>Две любопытные детали</h3><ul>' +
    exhibit.facts.map((fact) => "<li>" + fact + "</li>").join("") +
    '</ul></div><a class="dialog-source" href="' +
    exhibit.source +
    '" target="_blank" rel="noopener noreferrer">Читать источник: ' +
    exhibit.sourceName +
    " ↗</a></div></div>";
  openDialog(exhibitDialog);
});

function openDialog(dialog) {
  dialog.showModal();
  document.body.style.overflow = "hidden";
}
function closeDialog(dialog) {
  dialog.close();
}
getElements("dialog").forEach((dialog) => {
  getElement(".dialog-close", dialog).addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
});

// Раскрывающееся меню для телефона.
const menuToggle = getElement(".menu-toggle");
const mainNav = getElement("#main-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  mainNav.classList.remove("open");
}
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Закрыть меню" : "Открыть меню");
  mainNav.classList.toggle("open", expanded);
});
getElements("a", mainNav).forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

// Прогресс и заметки хранятся в этом браузере. Повреждённые записи пропускаем.
const GAME_KEY = "bureau-inventions:blueprints:v1";
const IDEAS_KEY = "bureau-inventions:ideas:v1";
function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
// Восстанавливаем только те детали, которые есть в текущих чертежах.
const rawGame = readStored(GAME_KEY, {});
const gameRecords = {};
Object.entries(blueprints).forEach(([id, blueprint]) => {
  const record = rawGame && typeof rawGame === "object" ? rawGame[id] : null;
  gameRecords[id] = {
    placed: Array.isArray(record?.placed)
      ? [
          ...new Set(
            record.placed.filter((partId) => blueprint.parts.some((part) => part.id === partId))
          )
        ]
      : [],
    mistakes: Number.isSafeInteger(record?.mistakes) && record.mistakes >= 0 ? record.mistakes : 0,
    hints: Number.isSafeInteger(record?.hints) && record.hints >= 0 ? record.hints : 0
  };
});
// Текущее состояние игры.
let currentLevel = "bicycle";
let selectedPart = null;
let hintTimeout = null;
const levelOrder = Object.keys(blueprints);
const getCurrentProgress = () => gameRecords[currentLevel];
const getCurrentBlueprint = () => blueprints[currentLevel];
function saveGame() {
  const saved = writeStored(GAME_KEY, gameRecords);
  if (!saved)
    getElement(".workshop-footer>span:last-child").textContent =
      "Сохранение недоступно: браузер запретил локальное хранилище";
}

// Перерисовываем чертёж, панель деталей и шкалу сборки.
function renderGame() {
  const blueprint = getCurrentBlueprint();
  const record = getCurrentProgress();
  const completed = record.placed.length === blueprint.parts.length;
  clearTimeout(hintTimeout);
  getElement("#blueprint-code").textContent = "ЧЕРТЁЖ " + blueprint.code;
  getElement("#blueprint-part-count").textContent =
    "ДЕТАЛЕЙ: " + String(blueprint.parts.length).padStart(2, "0");
  getElement("#blueprint-art").innerHTML = createSvg(
    '<g class="ghost-art">' +
      blueprint.parts.map((part) => part.art).join("") +
      '</g><g class="placed-art">' +
      blueprint.parts
        .filter((part) => record.placed.includes(part.id))
        .map((part) => part.art)
        .join("") +
      '</g><path d="M35 321H525" stroke="currentColor" stroke-width=".5" stroke-dasharray="4 5" opacity=".3"/>'
  );
  getElement("#blueprint-slots").innerHTML = blueprint.parts
    .map((part, index) => {
      const placed = record.placed.includes(part.id);
      return (
        '<button class="game-slot' +
        (placed ? " placed" : "") +
        '" style="left:' +
        (part.x / 560) * 100 +
        "%;top:" +
        (part.y / 350) * 100 +
        '%" data-slot="' +
        part.id +
        '" aria-label="' +
        (placed ? part.name + " установлено" : "Место № " + (index + 1) + " на чертеже") +
        '"' +
        (placed ? " disabled" : "") +
        ">" +
        (placed ? "✓" : index + 1) +
        "</button>"
      );
    })
    .join("");
  // Детали в панели идут не по порядку, чтобы их нужно было узнавать по форме.
  const order = currentLevel === "lamp" ? [3, 0, 4, 1, 2] : [4, 0, 3, 5, 2, 1];
  getElement("#parts-bank").innerHTML = order
    .map((index) => {
      const part = blueprint.parts[index];
      const placed = record.placed.includes(part.id);
      return (
        '<button class="part-button' +
        (placed ? " placed" : "") +
        (selectedPart === part.id ? " selected" : "") +
        '" data-part="' +
        part.id +
        '" aria-pressed="' +
        (selectedPart === part.id) +
        '" aria-label="' +
        part.name +
        (placed ? " — установлено" : " — выбрать деталь") +
        '" draggable="' +
        !placed +
        '"' +
        (placed ? " disabled" : "") +
        ">" +
        createSvg(part.art, part.box) +
        "<span>" +
        (placed ? "✓ " : "") +
        part.name +
        "</span></button>"
      );
    })
    .join("");
  getElement("#parts-counter").textContent = record.placed.length + " / " + blueprint.parts.length;
  getElement("#game-progress").style.width =
    (record.placed.length / blueprint.parts.length) * 100 + "%";
  getElement(".progress-track").setAttribute("aria-valuemax", String(blueprint.parts.length));
  getElement(".progress-track").setAttribute("aria-valuenow", String(record.placed.length));
  getElement(".progress-track").setAttribute(
    "aria-valuetext",
    "Установлено " + record.placed.length + " из " + blueprint.parts.length + " деталей"
  );
  getElement("#game-success").hidden = !completed;
  getElement("#hint-button").disabled = completed;
  const completedCount = levelOrder.filter(
    (level) => gameRecords[level].placed.length === blueprints[level].parts.length
  ).length;
  getElement("#game-completed").textContent = "Чертежи: " + completedCount + " / 3";
  getElements(".blueprint-tab").forEach((tab) => {
    const active = tab.dataset.level === currentLevel;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
    getElement(".level-check", tab).textContent =
      gameRecords[tab.dataset.level].placed.length === blueprints[tab.dataset.level].parts.length
        ? "✓"
        : "";
  });
  if (completed) {
    getElement("#success-title").textContent = blueprint.title;
    getElement("#success-description").textContent =
      blueprint.fact +
      " Подсказок: " +
      record.hints +
      ". Неточных попыток: " +
      record.mistakes +
      ".";
    getElement("#next-blueprint").innerHTML =
      (completedCount === 3 ? "Собрать ещё раз" : "Следующий чертёж") +
      ' <span aria-hidden="true">↗</span>';
    setGameStatus(
      completedCount === 3
        ? "Все три чертежа собраны. Бюро гордится вашим любопытством!"
        : "Все детали на месте. Ваше изобретение готово!"
    );
  }
}
function setGameStatus(message, error = false) {
  const status = getElement("#game-status");
  status.textContent = message;
  status.classList.toggle("error", error);
}
function selectPart(id) {
  const part = getCurrentBlueprint().parts.find((item) => item.id === id);
  if (!part || getCurrentProgress().placed.includes(id)) return;
  selectedPart = id;
  getElements(".part-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.part === id);
    button.setAttribute("aria-pressed", String(button.dataset.part === id));
  });
  getElements(".game-slot.hinted").forEach((slot) => slot.classList.remove("hinted"));
  setGameStatus("Выбрано: " + part.name.toLowerCase() + ". Найдите подходящий контур на чертеже.");
}
// Проверяем выбранное место. При ошибке деталь остаётся в панели.
function placePart(slotId) {
  if (!selectedPart) {
    setGameStatus("Сначала выберите деталь в панели «Ваши детали».");
    return;
  }
  if (getCurrentProgress().placed.includes(slotId)) return;
  if (slotId !== selectedPart) {
    getCurrentProgress().mistakes++;
    saveGame();
    setGameStatus(
      "Здесь нужна другая деталь. Сравните форму с контуром или возьмите подсказку.",
      true
    );
    const slot = getElement('[data-slot="' + slotId + '"]');
    slot?.classList.add("wrong");
    setTimeout(() => slot?.classList.remove("wrong"), 400);
    return;
  }
  const name = getCurrentBlueprint().parts.find((part) => part.id === selectedPart).name;
  getCurrentProgress().placed.push(selectedPart);
  selectedPart = null;
  saveGame();
  renderGame();
  if (getCurrentProgress().placed.length !== getCurrentBlueprint().parts.length)
    setGameStatus(name + " — на месте! Выберите следующую деталь.");
  const nextFocus =
    getCurrentProgress().placed.length === getCurrentBlueprint().parts.length
      ? getElement("#next-blueprint")
      : getElement(".part-button:not(:disabled)");
  nextFocus?.focus({ preventScroll: true });
}
// Выбор касанием и перетаскивание мышью используют одну проверку деталей.
getElement("#parts-bank").addEventListener("click", (event) => {
  const button = event.target.closest("[data-part]");
  if (button && !button.disabled) selectPart(button.dataset.part);
});
getElement("#parts-bank").addEventListener("dragstart", (event) => {
  const button = event.target.closest("[data-part]");
  if (!button || button.disabled) {
    event.preventDefault();
    return;
  }
  selectPart(button.dataset.part);
  event.dataTransfer.setData("text/plain", button.dataset.part);
  event.dataTransfer.effectAllowed = "move";
});
getElement("#blueprint-slots").addEventListener("click", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (slot && !slot.disabled) placePart(slot.dataset.slot);
});
getElement("#blueprint-slots").addEventListener("dragover", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (!slot || slot.disabled) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  slot.classList.add("drag-over");
});
getElement("#blueprint-slots").addEventListener("dragleave", (event) =>
  event.target.closest("[data-slot]")?.classList.remove("drag-over")
);
getElement("#blueprint-slots").addEventListener("drop", (event) => {
  event.preventDefault();
  const slot = event.target.closest("[data-slot]");
  getElements(".game-slot.drag-over").forEach((item) => item.classList.remove("drag-over"));
  if (!slot || slot.disabled) return;
  const partId = event.dataTransfer.getData("text/plain");
  if (!getCurrentBlueprint().parts.some((part) => part.id === partId)) return;
  selectPart(partId);
  placePart(slot.dataset.slot);
});
// Подсказка временно подсвечивает подходящее место на чертеже.
getElement("#hint-button").addEventListener("click", () => {
  const record = getCurrentProgress();
  if (record.placed.length === getCurrentBlueprint().parts.length) return;
  if (!selectedPart)
    selectPart(getCurrentBlueprint().parts.find((part) => !record.placed.includes(part.id)).id);
  const part = getCurrentBlueprint().parts.find((item) => item.id === selectedPart);
  const slot = getElement('[data-slot="' + selectedPart + '"]');
  slot.classList.add("hinted");
  clearTimeout(hintTimeout);
  hintTimeout = setTimeout(() => slot.classList.remove("hinted"), 6000);
  record.hints++;
  saveGame();
  setGameStatus("Подсветили место для детали «" + part.name + "». Нажмите на светящийся номер.");
});
function switchLevel(level) {
  if (!blueprints[level]) return;
  currentLevel = level;
  selectedPart = null;
  renderGame();
  if (getCurrentProgress().placed.length !== getCurrentBlueprint().parts.length)
    setGameStatus(
      getCurrentProgress().placed.length
        ? "Продолжим? Установленные детали уже на чертеже."
        : "Начните с любой детали — присмотритесь к контурам."
    );
}
getElements(".blueprint-tab").forEach((button) =>
  button.addEventListener("click", () => switchLevel(button.dataset.level))
);
function resetCurrent() {
  gameRecords[currentLevel] = { placed: [], mistakes: 0, hints: 0 };
  selectedPart = null;
  saveGame();
  renderGame();
  setGameStatus("Чистый чертёж, новые возможности. Выберите любую деталь.");
}
getElement("#reset-button").addEventListener("click", resetCurrent);
getElement("#next-blueprint").addEventListener("click", () => {
  const next = levelOrder.find(
    (level) => gameRecords[level].placed.length < blueprints[level].parts.length
  );
  if (next) switchLevel(next);
  else resetCurrent();
});
renderGame();

// Иллюстрации трёх авторских концепций.
getElement("#idea-solar").innerHTML = drawIllustration(
  '<path d="M54 89L167 44L240 75L127 121Z"/>' +
    '<path d="M74 81L145 111M98 71L169 101M123 61L193 91M146 52L217 82M77 99L189 55M101 110L215 67" stroke-width=".8"/>' +
    '<path d="M81 101V190M214 86V174M69 158L169 135L220 151L119 178Z"/>' +
    '<path d="M71 167L119 187L220 160M81 174V207M207 167V191M120 187V214M76 150L172 128L172 109L76 131Z"/>' +
    '<path d="M109 159L208 139M90 153L187 132M170 175V199L191 194V171"/>' +
    '<path d="M181 178L175 187H184L177 196"/>' +
    '<circle cx="250" cy="35" r="11"/>' +
    '<path d="M250 15V9M250 61V55M230 35H223M278 35H271M235 20L231 15M264 50L269 55M265 20L270 15"/>' +
    '<path d="M46 216L224 199" stroke-dasharray="3 4" opacity=".5"/>',
  "0 0 300 240"
);
getElement("#idea-pot").innerHTML = drawIllustration(
  '<path d="M87 124H213L198 208H102Z"/>' +
    '<ellipse cx="150" cy="124" rx="63" ry="11"/>' +
    '<ellipse cx="150" cy="124" rx="49" ry="7" opacity=".4"/>' +
    '<path d="M150 124V54M150 88Q99 91 102 53Q142 52 150 88ZM150 67Q177 64 185 31Q145 30 150 67ZM150 109Q192 111 203 76Q165 73 150 109Z"/>' +
    '<path d="M150 88L111 62M151 65L177 40M152 107L192 84" stroke-width=".7"/>' +
    '<path d="M190 126V83M190 83L211 68L225 86L203 100Z"/>' +
    '<path d="M207 83L215 83M196 139V176M203 184C210 193 200 202 194 193C190 189 196 184 196 181Z"/>' +
    '<path d="M110 210H190M60 94L73 89M57 119H72M61 143L74 149M236 113H266" stroke-width="1" opacity=".55"/>' +
    '<circle cx="272" cy="113" r="4"/>',
  "0 0 300 240"
);
getElement("#idea-light").innerHTML = drawIllustration(
  '<path d="M115 96H186V199H115Z"/>' +
    '<path d="M107 87H194V99H107ZM122 199V210H179V199M123 86V75Q151 52 178 75V86"/>' +
    '<path d="M135 135Q132 112 151 112Q170 112 166 135L161 148H140Z"/>' +
    '<path d="M140 148H161V158H140ZM143 162H158M145 171H155M151 115V137M126 108V187M176 108V187"/>' +
    '<path d="M117 169H94V143H74" stroke-width="3"/>' +
    '<path d="M68 133H80V153H68Z"/>' +
    '<circle cx="115" cy="169" r="7"/>' +
    '<path d="M206 106L226 96M209 131H233M205 154L225 166M85 65Q69 73 66 91M66 91L60 81M66 91L77 88M145 70V61Q151 53 157 61V70" opacity=".6"/>' +
    '<path d="M95 219H207" stroke-dasharray="3 4" opacity=".5"/>',
  "0 0 300 240"
);

// Личный блокнот: загрузка, добавление и удаление заметок.
let personalIdeas = readStored(IDEAS_KEY, []);
if (!Array.isArray(personalIdeas)) personalIdeas = [];
personalIdeas = personalIdeas
  .filter(
    (idea) =>
      idea &&
      typeof idea.id === "string" &&
      typeof idea.name === "string" &&
      typeof idea.problem === "string" &&
      typeof idea.solution === "string"
  )
  .slice(0, 20)
  .map((idea) => ({
    id: idea.id.slice(0, 80),
    name: idea.name.slice(0, 70),
    problem: idea.problem.slice(0, 300),
    solution: idea.solution.slice(0, 500)
  }));
function renderPersonalIdeas() {
  getElement("#personal-ideas").hidden = !personalIdeas.length;
  getElement("#personal-ideas-list").innerHTML = personalIdeas
    .map(
      (idea) =>
        '<article class="personal-note"><h4>' +
        escapeHTML(idea.name) +
        "</h4><p><strong>Задача:</strong> " +
        escapeHTML(idea.problem) +
        "</p><p><strong>Принцип:</strong> " +
        escapeHTML(idea.solution) +
        '</p><button class="delete-idea" data-delete-idea="' +
        escapeHTML(idea.id) +
        '" aria-label="Удалить идею: ' +
        escapeHTML(idea.name) +
        '">Удалить</button></article>'
    )
    .join("");
}
renderPersonalIdeas();
getElement("#open-idea").addEventListener("click", () => {
  getElement("#idea-form-status").textContent = "";
  openDialog(getElement("#idea-dialog"));
});
getElement("#idea-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = getElement("#idea-name").value.trim();
  const problem = getElement("#idea-problem").value.trim();
  const solution = getElement("#idea-solution").value.trim();
  if (!name || !problem || !solution) {
    getElement("#idea-form-status").textContent =
      "Заполните все три поля: идеи нужны название, задача и принцип работы.";
    return;
  }
  if (personalIdeas.length >= 20) {
    getElement("#idea-form-status").textContent =
      "В блокноте уже 20 идей. Удалите ненужную заметку, чтобы освободить место.";
    return;
  }
  const idea = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2),
    name: name.slice(0, 70),
    problem: problem.slice(0, 300),
    solution: solution.slice(0, 500)
  };
  const updated = [idea, ...personalIdeas];
  if (!writeStored(IDEAS_KEY, updated)) {
    getElement("#idea-form-status").textContent =
      "Браузер запретил сохранение. Скопируйте идею в свои заметки, чтобы не потерять её.";
    return;
  }
  personalIdeas = updated;
  renderPersonalIdeas();
  closeDialog(getElement("#idea-dialog"));
  getElement("#idea-form").reset();
  showToast("Идея сохранена. Теперь у неё есть начало!");
  getElement("#personal-ideas").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "nearest"
  });
});
getElement("#personal-ideas-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-idea]");
  if (!button) return;
  const updated = personalIdeas.filter((idea) => idea.id !== button.dataset.deleteIdea);
  if (!writeStored(IDEAS_KEY, updated)) {
    showToast("Не удалось обновить блокнот: сохранение недоступно.");
    return;
  }
  personalIdeas = updated;
  renderPersonalIdeas();
  showToast("Заметка удалена из блокнота.");
});
let toastTimeout;
// Небольшое сообщение после сохранения или удаления заметки.
function showToast(message) {
  const toast = getElement("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3800);
}
