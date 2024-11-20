const API_BASE_URL = '/api/v4'; // Базовый URL для API запросов
const TASK_TEXT = "Контакт без сделок"; // Текст задачи
const limit = 25; // Лимит контактов на один запрос
let page = 1; // Номер текущей страницы

// Функция для получения контактов
function getContacts() {
    $.ajax({
        url: `${API_BASE_URL}/contacts`,
        method: 'GET',
        data: {
            limit: limit,
            with: 'leads', // Поле с информацией о сделках
            page: page
        }
    }).done(function(data) {
        if (data && data._embedded && data._embedded.contacts) {
            const contacts = data._embedded.contacts;
            processContacts(contacts); // Обрабатываем контакты
        } else {
            console.log('Контактов больше нет или ответ пуст');
            return false;
        }
    }).fail(function(error) {
        console.error('Ошибка при получении контактов:', error);
    });
}

// Функция для обработки контактов
function processContacts(contacts) {
    contacts.forEach(contact => {
        if (!contact._embedded.leads || contact._embedded.leads.length === 0) {
            createTask(contact.id); // Создаем задачу для контакта без сделок
        }
    });

    // Переход на следующую страницу, если есть еще данные
    page++;
    getContacts();
}

// Функция для создания задачи
function createTask(contactId) {
    const taskData = {
        text: TASK_TEXT,
        complete_till: Math.floor(Date.now() / 1000) + 3600, // Дедлайн через 1 час
        entity_id: contactId,
        entity_type: "contacts" // Связываем задачу с контактом
    };

    $.ajax({
        url: `${API_BASE_URL}/tasks`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(taskData)
    }).done(function(response) {
        console.log(`Задача для контакта ${contactId} успешно создана:`, response);
    }).fail(function(error) {
        console.error(`Ошибка при создании задачи для контакта ${contactId}:`, error);
    });
}

// Старт выполнения скрипта
getContacts();


//1. Получение контактов:

// 2. Мы отправляем запрос на /api/v4/contacts с параметрами limit, with=leads (для получения сделок), и page (для пагинации).
// 3. Проверка наличия сделок:

// 4. Проверяем массив contact._embedded.leads. Если он пуст или отсутствует, контакт не имеет сделок.
// 5. Создание задачи:

// 6. Отправляем POST-запрос на /api/v4/tasks с указанием ID контакта, текста задачи и времени выполнения задачи (complete_till).
// 7. Обработка всех страниц:

// 8. Переходим к следующей странице с помощью инкремента page и вызываем getContacts().
// Технические детали:

// 9. Используется Math.floor(Date.now() / 1000) для получения текущего времени в формате UNIX.
// 10. Задачи создаются с дедлайном через 1 час после момента выполнения скрипта.
// 11. Для работы с API amoCRM потребуется авторизация.