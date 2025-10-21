

import { logisticaQuestions } from './data/questions.js';
import { preparacionPedidosQuestions } from './data/preparacion-pedidos-questions.js';
import { preparacionPedidos2Questions } from './data/preparacion-pedidos-2-questions.js';

const allTopics = [
    {
      id: 'logistica',
      name: 'Test de Logística',
      description: `Preguntas sobre la gestión y operativa de almacenes. (${logisticaQuestions.length} preguntas)`,
      questions: logisticaQuestions
    },
    {
      id: 'preparacion-pedidos',
      name: 'Preparación de Pedidos',
      description: `Preguntas sobre el proceso de picking y empaquetado. (${preparacionPedidosQuestions.length} preguntas)`,
      questions: preparacionPedidosQuestions
    },
    {
      id: 'preparacion-pedidos-2',
      name: 'Preparación de Pedidos, parte 2',
      description: `Preguntas sobre manutención, picking, inventario y prevención de riesgos. (${preparacionPedidos2Questions.length} preguntas)`,
      questions: preparacionPedidos2Questions
    }
];

let allQuestionsWithIndex = [];
let questionCounter = 0;
allTopics.forEach(topic => {
    topic.questions.forEach(q => {
        allQuestionsWithIndex.push({
            ...q,
            originalIndex: questionCounter++,
            topicId: topic.id
        });
    });
});


// DOM Elements
const nameScreen = document.getElementById('name-screen');
const nameInput = document.getElementById('name-input');
const submitNameBtn = document.getElementById('submit-name-btn');
const welcomeMessage = document.getElementById('welcome-message');
const startScreen = document.getElementById('start-screen');
const startScreenDefaultContent = document.getElementById('start-screen-default-content');
const topicSelectionScreen = document.getElementById('topic-selection-screen');
const topicListContainer = document.getElementById('topic-list-container');
const topicFilterInput = document.getElementById('topic-filter-input');
const noTopicsMessage = document.getElementById('no-topics-message');
const backToStartBtn = document.getElementById('back-to-start-btn');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-quiz-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const backToTopicsBtn = document.getElementById('back-to-topics-btn');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const timerContainer = document.getElementById('timer-container');
const timerEl = document.getElementById('timer');
const questionImageContainer = document.getElementById('question-image-container');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButtonContainer = document.getElementById('next-button-container');
const resultsTitle = document.getElementById('results-title');
const resultsMessage = document.getElementById('results-message');
const finalTimeEl = document.getElementById('final-time');
const scoreDisplay = document.getElementById('score-display');
const scorePercentage = document.getElementById('score-percentage');
const resultsButtons = document.getElementById('results-buttons');
const reviewSection = document.getElementById('review-section');
const incorrectList = document.getElementById('incorrect-questions-list');
const soundToggleBtn = document.getElementById('sound-toggle-btn');

// Search elements
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');
const searchResultsList = document.getElementById('search-results-list');
const noResultsMessage = document.getElementById('no-results-message');
const topicQuizButtonContainer = document.getElementById('topic-quiz-button-container');

// Bookmark elements
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarksContainer = document.getElementById('bookmarks-container');
const bookmarksList = document.getElementById('bookmarks-list');
const bookmarkQuizButtonContainer = document.getElementById('bookmark-quiz-button-container');

// Settings elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const questionsCountInput = document.getElementById('questions-count-input');
const timerOnRadio = document.getElementById('timer-on-radio');
const timerOffRadio = document.getElementById('timer-off-radio');
const timerDurationInput = document.getElementById('timer-duration-input');
const orderRandomRadio = document.getElementById('order-random-radio');
const orderSequentialRadio = document.getElementById('order-sequential-radio');
const languageSelect = document.getElementById('language-select');

// State
let username = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let score = 0;
let startTime = 0;
let timeRemaining = 0;
let stopwatchSeconds = 0;
let timerInterval;
let wakeLock = null;
let bookmarkedQuestions = new Set();
const BOOKMARKS_STORAGE_KEY = 'logisticsQuizBookmarks';
const bookmarkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`;
const bookmarkedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>`;

// Settings State
const SETTINGS_STORAGE_KEY = 'logisticsQuizSettings';
let settings = {
    numQuestions: 20,
    isTimerEnabled: true,
    timerDuration: 15, // in minutes
    questionOrder: 'random', // 'random' or 'sequential'
    language: 'es'
};

// Audio State and Elements
let audioCtx = null;
let masterGainNode = null;
let isSoundEnabled = true;
const SOUND_ENABLED_KEY = 'logisticsQuizSoundEnabled';
const soundOnIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
const soundOffIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" /><path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`;

// i18n Translations
const translations = {
    es: {
        welcome_title: "¡Bienvenido!",
        welcome_subtitle: "Por favor, introduce tu nombre para empezar.",
        name_placeholder: "Escribe tu nombre aquí...",
        continue_button: "Continuar",
        main_title: "Tests Interactivos",
        main_subtitle_prefix: "Pon a prueba tus conocimientos",
        welcome_user_message: "¡Hola, {{username}}! Pon a prueba tus conocimientos.",
        bookmarks_title: "Preguntas Guardadas",
        search_placeholder: "Buscar por tema o pregunta...",
        start_quiz_button: "Iniciar Test",
        settings_button_aria: "Abrir configuración",
        search_results_title: "Resultados de la Búsqueda",
        no_results_message: "No se encontraron preguntas. Intenta con otra búsqueda.",
        start_bookmarked_quiz_button: "Iniciar Test de Preguntas Guardadas ({{count}})",
        start_topic_quiz_button: "Iniciar Test del Tema \"{{topic}}\" ({{count}} preguntas)",
        select_topic_title: "Selecciona un Tema",
        topic_filter_placeholder: "Buscar tema...",
        no_topics_message: "No se encontraron temas.",
        back_button: "Volver",
        back_to_home_title: "Volver al Inicio",
        back_to_topics_title: "Volver a Temas",
        progress_text_template: "Pregunta {{current}} / {{total}}",
        sound_on_aria: "Activar sonidos",
        sound_off_aria: "Desactivar sonidos",
        bookmark_question_aria: "Guardar pregunta",
        bookmarked_question_aria: "Pregunta guardada",
        remove_bookmark_aria: "Eliminar marcador",
        finish_quiz_button: "Finalizar Test",
        next_question_button: "Siguiente Pregunta",
        results_title_perfect: "¡Excelente!",
        results_title_completed: "Test Completado",
        results_message_perfect: "¡Felicidades, {{username}}! Has respondido correctamente a todas las preguntas.",
        results_message_completed: "¡Buen trabajo, {{username}}! Tu resultado final es:",
        total_time_label: "Tiempo total:",
        retry_mistakes_button: "Repetir Errores ({{count}})",
        start_new_quiz_button: "Empezar Nuevo Test",
        review_section_title: "Preguntas para repasar:",
        correct_answer_label: "Respuesta correcta:",
        settings_modal_title: "Configuración del Test",
        close_settings_aria: "Cerrar configuración",
        questions_count_label: "Número de preguntas",
        questions_count_desc: "Elige cuántas preguntas quieres en cada test (entre 5 y 50).",
        timer_label: "Temporizador",
        timer_on_label: "Activado",
        timer_off_label: "Desactivado",
        minutes_label: "minutos",
        timer_desc: "Controla si el temporizador está activo y su duración.",
        question_order_label: "Orden de las preguntas",
        order_random_label: "Aleatorio",
        order_sequential_label: "Secuencial",
        question_order_desc: "Elige si las preguntas aparecen en orden aleatorio o en el orden original.",
        language_label: "Idioma",
        language_desc: "Selecciona el idioma de la aplicación.",
        cancel_button: "Cancelar",
        save_changes_button: "Guardar Cambios",
    },
    ka: {
        welcome_title: "კეთილი იყოს თქვენი მობრძანება!",
        welcome_subtitle: "გთხოვთ, დასაწყებად შეიყვანეთ თქვენი სახელი.",
        name_placeholder: "დაწერეთ თქვენი სახელი აქ...",
        continue_button: "გაგრძელება",
        main_title: "ინტერაქტიული ტესტები",
        main_subtitle_prefix: "შეამოწმეთ თქვენი ცოდნა",
        welcome_user_message: "გამარჯობა, {{username}}! შეამოწმეთ თქვენი ცოდნა.",
        bookmarks_title: "შენახული კითხვები",
        search_placeholder: "მოძებნეთ თემის ან კითხვის მიხედვით...",
        start_quiz_button: "ტესტის დაწყება",
        settings_button_aria: "პარამეტრების გახსნა",
        search_results_title: "ძიების შედეგები",
        no_results_message: "კითხვები არ მოიძებნა. სცადეთ სხვა საძიებო სიტყვით.",
        start_bookmarked_quiz_button: "შენახული კითხვების ტესტის დაწყება ({{count}})",
        start_topic_quiz_button: "თემის \"{{topic}}\" ტესტის დაწყება ({{count}} კითხვა)",
        select_topic_title: "აირჩიეთ თემა",
        topic_filter_placeholder: "თემის ძიება...",
        no_topics_message: "თემები არ მოიძებნა.",
        back_button: "უკან",
        back_to_home_title: "მთავარზე დაბრუნება",
        back_to_topics_title: "თემებზე დაბრუნება",
        progress_text_template: "კითხვა {{current}} / {{total}}",
        sound_on_aria: "ხმის ჩართვა",
        sound_off_aria: "ხმის გამორთვა",
        bookmark_question_aria: "კითხვის შენახვა",
        bookmarked_question_aria: "კითხვა შენახულია",
        remove_bookmark_aria: "სანიშნის წაშლა",
        finish_quiz_button: "ტესტის დასრულება",
        next_question_button: "შემდეგი კითხვა",
        results_title_perfect: "შესანიშნავია!",
        results_title_completed: "ტესტი დასრულებულია",
        results_message_perfect: "გილოცავთ, {{username}}! თქვენ სწორად უპასუხეთ ყველა კითხვას.",
        results_message_completed: "კარგი ნამუშევარია, {{username}}! თქვენი საბოლოო შედეგია:",
        total_time_label: "საერთო დრო:",
        retry_mistakes_button: "შეცდომებზე მუშაობა ({{count}})",
        start_new_quiz_button: "ახალი ტესტის დაწყება",
        review_section_title: "გასამეორებელი კითხვები:",
        correct_answer_label: "სწორი პასუხი:",
        settings_modal_title: "ტესტის პარამეტრები",
        close_settings_aria: "პარამეტრების დახურვა",
        questions_count_label: "კითხვების რაოდენობა",
        questions_count_desc: "აირჩიეთ რამდენი კითხვა გსურთ თითოეულ ტესტში (5-დან 50-მდე).",
        timer_label: "ტაიმერი",
        timer_on_label: "ჩართულია",
        timer_off_label: "გამორთულია",
        minutes_label: "წუთი",
        timer_desc: "აკონტროლეთ, არის თუ არა ტაიმერი აქტიური და მისი ხანგრძლივობა.",
        question_order_label: "კითხვების თანმიმდევრობა",
        order_random_label: "შემთხვევითი",
        order_sequential_label: "თანმიმდევრული",
        question_order_desc: "აირჩიეთ, გამოჩნდეს კითხვები შემთხვევითი თანმიმდევრობით თუ თავდაპირველი რიგით.",
        language_label: "ენა",
        language_desc: "აირჩიეთ აპლიკაციის ენა.",
        cancel_button: "გაუქმება",
        save_changes_button: "ცვლილებების შენახვა",
    }
};

const setLanguage = (lang) => {
    if (!translations[lang]) lang = 'es'; // Fallback to Spanish
    document.documentElement.lang = lang;
    
    const elements = document.querySelectorAll('[data-i18n-key]');
    elements.forEach(el => {
        const key = el.dataset.i18nKey;
        const translation = translations[lang][key];
        
        if (translation) {
            if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
                el.placeholder = translation;
            } else if (el.hasAttribute('title')) {
                 el.setAttribute('title', translation);
            } else if (el.hasAttribute('aria-label')) {
                 el.setAttribute('aria-label', translation);
            } else {
                el.innerHTML = translation;
            }
        }
    });
};

// Settings Functions
const saveSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const loadSettings = () => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
        settings = { ...settings, ...JSON.parse(storedSettings) };
    }
};

// Audio Functions
const initAudio = () => {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGainNode = audioCtx.createGain();
            masterGainNode.connect(audioCtx.destination);
            masterGainNode.gain.value = isSoundEnabled ? 1 : 0;
        } catch (e) {
            console.error('Web Audio API is not supported in this browser');
            isSoundEnabled = false; // Disable sound if not supported
        }
    }
};

const playSound = (type, freq, duration, wave = 'sine') => {
    if (!isSoundEnabled || !audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(masterGainNode);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
};

const playCorrectSound = () => {
    if (!isSoundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.linearRampToValueAtTime(800, now + 0.1);
    oscillator.connect(masterGainNode);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
};

const playIncorrectSound = () => {
    if (!isSoundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
    oscillator.connect(masterGainNode);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
};

const playNavigationSound = () => playSound('nav', 800, 0.05, 'triangle');
const playBookmarkSound = () => playSound('bookmark', 500, 0.07, 'sine');

const toggleSound = () => {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem(SOUND_ENABLED_KEY, isSoundEnabled);
    updateSoundToggleUI();
    if (masterGainNode) {
        masterGainNode.gain.value = isSoundEnabled ? 1 : 0;
    }
};

const updateSoundToggleUI = () => {
    const lang = settings.language;
    if (isSoundEnabled) {
        soundToggleBtn.innerHTML = soundOnIconSVG;
        soundToggleBtn.setAttribute('aria-label', translations[lang].sound_off_aria);
    } else {
        soundToggleBtn.innerHTML = soundOffIconSVG;
        soundToggleBtn.setAttribute('aria-label', translations[lang].sound_on_aria);
    }
};

const loadSoundPreference = () => {
    const savedPref = localStorage.getItem(SOUND_ENABLED_KEY);
    isSoundEnabled = savedPref === null ? true : savedPref === 'true';
    updateSoundToggleUI();
};


// Bookmark Functions
const loadBookmarks = () => {
    const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (storedBookmarks) {
        bookmarkedQuestions = new Set(JSON.parse(storedBookmarks));
    }
};

const saveBookmarks = () => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(Array.from(bookmarkedQuestions)));
};

const removeBookmark = (originalIndex) => {
    bookmarkedQuestions.delete(originalIndex);
    saveBookmarks();
    renderBookmarksSection();
};

const startBookmarkedQuiz = () => {
    const bookmarkedQuizQuestions = allQuestionsWithIndex.filter(q => bookmarkedQuestions.has(q.originalIndex));
    if (bookmarkedQuizQuestions.length > 0) {
        const questionsForQuiz = prepareQuestions(bookmarkedQuizQuestions);
        startQuiz(questionsForQuiz);
    }
};

const renderBookmarksSection = () => {
    if (bookmarkedQuestions.size > 0) {
        bookmarksContainer.classList.remove('hidden');
        bookmarksList.innerHTML = '';
        bookmarkQuizButtonContainer.innerHTML = '';

        const questionsToRender = allQuestionsWithIndex.filter(q => bookmarkedQuestions.has(q.originalIndex));

        questionsToRender.forEach(q => {
            const li = document.createElement('li');
            li.className = 'p-3 bg-gray-50 rounded-md flex justify-between items-center';
            li.innerHTML = `<p class="text-gray-800 text-sm mr-2">${q.questionText}</p>`;

            const removeButton = document.createElement('button');
            removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 hover:text-red-700" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;
            removeButton.className = 'ml-4 p-1 rounded-full hover:bg-red-100 flex-shrink-0';
            removeButton.setAttribute('aria-label', translations[settings.language].remove_bookmark_aria);
            removeButton.onclick = () => removeBookmark(q.originalIndex);

            li.appendChild(removeButton);
            bookmarksList.appendChild(li);
        });

        const startBtn = document.createElement('button');
        startBtn.textContent = translations[settings.language].start_bookmarked_quiz_button.replace('{{count}}', bookmarkedQuestions.size);
        startBtn.className = 'px-6 py-3 text-lg font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-md';
        startBtn.onclick = startBookmarkedQuiz;
        bookmarkQuizButtonContainer.appendChild(startBtn);

    } else {
        bookmarksContainer.classList.add('hidden');
    }
};

const handleBookmarkToggle = () => {
    const question = currentQuestions[currentQuestionIndex];
    if (!question) return;
    
    playBookmarkSound();
    const lang = settings.language;
    const { originalIndex } = question;
    if (bookmarkedQuestions.has(originalIndex)) {
        bookmarkedQuestions.delete(originalIndex);
        bookmarkBtn.innerHTML = bookmarkIconSVG;
        bookmarkBtn.setAttribute('aria-label', translations[lang].bookmark_question_aria);
    } else {
        bookmarkedQuestions.add(originalIndex);
        bookmarkBtn.innerHTML = bookmarkedIconSVG;
        bookmarkBtn.setAttribute('aria-label', translations[lang].bookmarked_question_aria);
    }
    saveBookmarks();
};

// Screen Wake Lock API
const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {});
        } catch (err) {
            console.error('Screen Wake Lock request failed:', err);
        }
    }
};

const releaseWakeLock = async () => {
    if (wakeLock !== null) {
        try {
            await wakeLock.release();
            wakeLock = null;
        } catch (err) {
            console.error('Screen Wake Lock release failed:', err);
        }
    }
};

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !quizScreen.classList.contains('hidden')) {
        requestWakeLock();
    }
});

// Utility Functions
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateCountdown = () => {
    if (timeRemaining > 0) {
        timeRemaining--;
        timerEl.textContent = formatTime(timeRemaining);
    } else {
        clearInterval(timerInterval);
        finishQuiz();
    }
};

const updateStopwatch = () => {
    stopwatchSeconds++;
    timerEl.textContent = formatTime(stopwatchSeconds);
};

const showScreen = (screen) => {
    nameScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    topicSelectionScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    screen.classList.remove('hidden');
    if (screen === startScreen) {
        renderBookmarksSection();
    }
};

const handleNameSubmit = () => {
    const name = nameInput.value.trim();
    const lang = settings.language;
    username = name || (lang === 'ka' ? 'მეგობარო' : 'Amigo');
    welcomeMessage.textContent = translations[lang].welcome_user_message.replace('{{username}}', username);
    initAudio(); // Initialize audio context on first user interaction
    showScreen(startScreen);
};

// Topic Selection Logic
const handleTopicFilter = () => {
    const searchTerm = topicFilterInput.value.trim().toLowerCase();
    const filteredTopics = allTopics.filter(topic => 
        topic.name.toLowerCase().includes(searchTerm) || 
        topic.description.toLowerCase().includes(searchTerm)
    );
    renderTopicSelectionScreen(filteredTopics);
};

const renderTopicSelectionScreen = (topicsToRender) => {
    topicListContainer.innerHTML = '';
    noTopicsMessage.classList.toggle('hidden', topicsToRender.length > 0);

    topicsToRender.forEach(topic => {
        const button = document.createElement('button');
        button.className = 'p-6 rounded-lg text-left font-bold transition-all duration-300 border-2 bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-500 shadow-sm hover:shadow-md';
        button.innerHTML = `<h3 class="text-xl text-blue-600">${topic.name}</h3><p class="text-sm text-gray-500 font-normal mt-1">${topic.description}</p>`;
        button.onclick = () => {
            const quizQuestions = prepareQuestions(topic.questions);
            startQuiz(quizQuestions.map(q => {
                return allQuestionsWithIndex.find(masterQ => 
                    masterQ.questionText === q.questionText && masterQ.topicId === topic.id
                );
            }));
        };
        topicListContainer.appendChild(button);
    });
};

const showTopicSelectionScreen = () => {
    showScreen(topicSelectionScreen);
    topicFilterInput.value = ''; // Clear filter when showing the screen
    renderTopicSelectionScreen(allTopics); // Render with all topics initially
};

// Quiz Logic
const prepareQuestions = (questionPool) => {
    let questionsToUse = [...questionPool];
    if (settings.questionOrder === 'random') {
        questionsToUse = shuffleArray(questionsToUse);
    }
    return questionsToUse.slice(0, settings.numQuestions);
};


const startQuiz = (questions) => {
    initAudio(); 
    
    const fullQuestionData = questions.map(q => allQuestionsWithIndex.find(masterQ => masterQ.originalIndex === q.originalIndex));
    
    currentQuestions = fullQuestionData.map(q => {
        const questionCopy = { ...q, options: [...q.options] };
        const indices = questionCopy.options.map((_, i) => i);
        const shuffledIndices = shuffleArray(indices);
        const newOptions = shuffledIndices.map(i => questionCopy.options[i]);
        const newCorrectAnswerIndex = shuffledIndices.indexOf(questionCopy.correctAnswerIndex);
        
        questionCopy.options = newOptions;
        questionCopy.correctAnswerIndex = newCorrectAnswerIndex;
        return questionCopy;
    });

    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = Array(currentQuestions.length).fill(null);

    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    
    if (settings.isTimerEnabled) {
        timerContainer.classList.remove('hidden');
        timeRemaining = settings.timerDuration * 60;
        timerInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    } else {
        timerContainer.classList.remove('hidden');
        stopwatchSeconds = 0;
        timerEl.textContent = formatTime(stopwatchSeconds);
        timerInterval = setInterval(updateStopwatch, 1000);
    }
    
    requestWakeLock();
    
    showScreen(quizScreen);
    renderQuestion();
};

const renderQuestion = () => {
    const question = currentQuestions[currentQuestionIndex];
    const lang = settings.language;
    
    questionImageContainer.innerHTML = '';
    if (question.imageUrl) {
        const img = document.createElement('img');
        img.src = question.imageUrl;
        img.alt = "Imagen del sistema de almacenaje";
        img.className = "w-full h-auto max-h-60 object-contain mx-auto rounded-lg";
        questionImageContainer.appendChild(img);
    }

    progressText.textContent = translations[lang].progress_text_template
        .replace('{{current}}', currentQuestionIndex + 1)
        .replace('{{total}}', currentQuestions.length);
    
    const progressPercentage = Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100);
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);

    questionTextEl.innerHTML = question.questionText;

    optionsContainer.innerHTML = '';
    const optionPrefixes = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="mr-3 font-bold text-blue-600">${optionPrefixes[index]}</span>${option}`;
        button.className = 'p-4 rounded-lg text-left font-semibold transition-all duration-300 border-2 bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-500';
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    if (bookmarkedQuestions.has(question.originalIndex)) {
        bookmarkBtn.innerHTML = bookmarkedIconSVG;
        bookmarkBtn.setAttribute('aria-label', translations[lang].bookmarked_question_aria);
    } else {
        bookmarkBtn.innerHTML = bookmarkIconSVG;
        bookmarkBtn.setAttribute('aria-label', translations[lang].bookmark_question_aria);
    }

    nextButtonContainer.innerHTML = '';
};

const handleAnswer = (selectedIndex) => {
    selectedAnswers[currentQuestionIndex] = selectedIndex;
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswerIndex;
    if (isCorrect) {
        score++;
        playCorrectSound();
    } else {
        playIncorrectSound();
    }

    Array.from(optionsContainer.children).forEach((btn, i) => {
        btn.disabled = true;
        btn.classList.add('disabled');
        if (i === question.correctAnswerIndex) {
            btn.classList.add('correct');
        } else if (i === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });

    renderNextButton();
};

const renderNextButton = () => {
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const button = document.createElement('button');
    button.textContent = isLastQuestion ? translations[settings.language].finish_quiz_button : translations[settings.language].next_question_button;
    button.className = 'px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md';
    button.onclick = handleNextQuestion;
    nextButtonContainer.innerHTML = '';
    nextButtonContainer.appendChild(button);
};

const handleNextQuestion = () => {
    playNavigationSound();
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        finishQuiz();
    }
};

const finishQuiz = () => {
    clearInterval(timerInterval);
    releaseWakeLock();
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    const lang = settings.language;
    
    const incorrectQuestions = currentQuestions.filter((q, index) => selectedAnswers[index] !== q.correctAnswerIndex);
    const isPerfectScore = incorrectQuestions.length === 0;
    const percentage = Math.round((score / currentQuestions.length) * 100);

    resultsTitle.textContent = isPerfectScore ? translations[lang].results_title_perfect : translations[lang].results_title_completed;
    resultsMessage.textContent = isPerfectScore 
        ? translations[lang].results_message_perfect.replace('{{username}}', username)
        : translations[lang].results_message_completed.replace('{{username}}', username);
        
    finalTimeEl.textContent = `${translations[lang].total_time_label} ${formatTime(elapsedTime)}`;
    scoreDisplay.textContent = `${score} / ${currentQuestions.length}`;
    scorePercentage.textContent = `${percentage}%`;

    resultsButtons.innerHTML = '';
    if (!isPerfectScore) {
        const retryBtn = document.createElement('button');
        retryBtn.textContent = translations[lang].retry_mistakes_button.replace('{{count}}', incorrectQuestions.length);
        retryBtn.className = "w-full md:w-auto px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-md hover:shadow-lg";
        retryBtn.onclick = () => startQuiz(shuffleArray(incorrectQuestions));
        resultsButtons.appendChild(retryBtn);
    }
    const resetBtn = document.createElement('button');
    resetBtn.textContent = translations[lang].start_new_quiz_button;
    resetBtn.className = "w-full md:w-auto px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md hover:shadow-lg";
    resetBtn.onclick = () => {
        showTopicSelectionScreen();
    };
    resultsButtons.appendChild(resetBtn);

    if (!isPerfectScore) {
        incorrectList.innerHTML = '';
        incorrectQuestions.forEach(q => {
            const li = document.createElement('li');
            li.className = 'text-gray-700 border-b border-gray-200 py-2 last:border-b-0';
            li.innerHTML = `<p class="font-semibold">${q.questionText}</p>
                                    <p class="text-green-700 text-sm mt-1">
                                      <span class="font-bold">${translations[lang].correct_answer_label}</span> ${q.options[q.correctAnswerIndex]}
                                    </p>`;
            incorrectList.appendChild(li);
        });
        reviewSection.classList.remove('hidden');
    } else {
        reviewSection.classList.add('hidden');
    }
    
    showScreen(resultsScreen);
};

// Search Logic
const handleSearch = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === '') {
        showStartScreenView();
        return;
    }

    const results = allQuestionsWithIndex.filter(q => q.questionText.toLowerCase().includes(searchTerm));
    renderSearchResults(results, searchTerm);
};

const renderSearchResults = (results, searchTerm) => {
    startScreenDefaultContent.classList.add('hidden');
    searchResultsContainer.classList.remove('hidden');
    searchResultsList.innerHTML = '';
    topicQuizButtonContainer.innerHTML = '';
    const lang = settings.language;

    if (results.length > 0) {
        noResultsMessage.classList.add('hidden');
        const questionsForQuiz = prepareQuestions(results);
        
        questionsForQuiz.forEach(q => {
            const li = document.createElement('li');
            li.className = 'p-3 bg-gray-50 rounded-md flex justify-between items-center';
            li.innerHTML = `<p class="text-gray-800">${q.questionText}</p>`;
            searchResultsList.appendChild(li);
        });

        const topicButton = document.createElement('button');
        topicButton.textContent = translations[lang].start_topic_quiz_button
            .replace('{{topic}}', searchTerm)
            .replace('{{count}}', questionsForQuiz.length);
        topicButton.className = 'px-6 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-md';
        topicButton.onclick = () => startQuiz(questionsForQuiz);
        topicQuizButtonContainer.appendChild(topicButton);

    } else {
        noResultsMessage.classList.remove('hidden');
    }
};

const showStartScreenView = () => {
    searchResultsContainer.classList.add('hidden');
    topicQuizButtonContainer.innerHTML = '';
    startScreenDefaultContent.classList.remove('hidden');
    searchInput.value = '';
};

// Settings Modal Logic
const showSettingsModal = () => {
    questionsCountInput.value = settings.numQuestions;
    timerOnRadio.checked = settings.isTimerEnabled;
    timerOffRadio.checked = !settings.isTimerEnabled;
    timerDurationInput.value = settings.timerDuration;
    timerDurationInput.disabled = !settings.isTimerEnabled;
    orderRandomRadio.checked = settings.questionOrder === 'random';
    orderSequentialRadio.checked = settings.questionOrder === 'sequential';
    languageSelect.value = settings.language;

    settingsModal.classList.remove('hidden');
    playNavigationSound();
};
const hideSettingsModal = () => {
    settingsModal.classList.add('hidden');
};
const handleSaveSettings = () => {
    settings.numQuestions = parseInt(questionsCountInput.value, 10);
    settings.isTimerEnabled = timerOnRadio.checked;
    settings.timerDuration = parseInt(timerDurationInput.value, 10);
    settings.questionOrder = orderRandomRadio.checked ? 'random' : 'sequential';
    settings.language = languageSelect.value;
    
    saveSettings();
    setLanguage(settings.language);
    playNavigationSound();
    hideSettingsModal();
};


// Initial Setup
const initializeApp = () => {
    loadSettings();
    setLanguage(settings.language);
    loadBookmarks();
    renderBookmarksSection();
    loadSoundPreference();

    submitNameBtn.addEventListener('click', handleNameSubmit);
    nameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleNameSubmit();
        }
    });
    startBtn.addEventListener('click', showTopicSelectionScreen);
    searchInput.addEventListener('input', handleSearch);
    topicFilterInput.addEventListener('input', handleTopicFilter);
    bookmarkBtn.addEventListener('click', handleBookmarkToggle);
    soundToggleBtn.addEventListener('click', toggleSound);
    
    backToHomeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        releaseWakeLock();
        showScreen(startScreen);
        showStartScreenView();
    });

    backToTopicsBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        releaseWakeLock();
        showTopicSelectionScreen();
    });
    
    backToStartBtn.addEventListener('click', () => showScreen(startScreen));
    
    // Settings modal listeners
    settingsBtn.addEventListener('click', showSettingsModal);
    closeSettingsBtn.addEventListener('click', hideSettingsModal);
    cancelSettingsBtn.addEventListener('click', hideSettingsModal);
    saveSettingsBtn.addEventListener('click', handleSaveSettings);

    timerOnRadio.addEventListener('change', () => timerDurationInput.disabled = false);
    timerOffRadio.addEventListener('change', () => timerDurationInput.disabled = true);
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            hideSettingsModal();
        }
    });

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service worker registered.', reg))
                .catch(err => console.error('Service worker not registered.', err));
        });
    }
};

initializeApp();