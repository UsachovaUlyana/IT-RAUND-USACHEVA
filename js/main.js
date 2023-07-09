//Объявление глобальных переменных, необходимых для работы
const form = document.querySelector('#form')
const weightInputOne = document.querySelector('#weightInputOne')
const weightInputTwo = document.querySelector('#weightInputTwo')
const heightInput = document.querySelector('#heightInput')
const errorBlock = document.querySelector('#error')
const BMIBG = document.querySelector('.BMI')
const resultsList = document.querySelector('#resultsList')
const emptyBlock = document.querySelector('#empty')
const iconInform = document.querySelector('#iconInform')
const infoBlock = document.querySelector('#infoBlock')

const select = document.querySelector('.change-lang')
const allLanguage = ['eng', 'ru']
let results = []

const resultBMINum = document.querySelector('#resultBMINUm')
const resultBMIText = document.querySelector('#resultBMIText')

//Получаем данные из LocalStorage если они есть
if (localStorage.getItem('results')) {
    results = JSON.parse(localStorage.getItem('results'))
    results.forEach(result => renderResults(result))
}

//Проверяем наличие элементов в блоке истории
checkEmptyList()

//Прослушиваем элементы
select.addEventListener('change', changeURLLanguage)
form.addEventListener('submit', checkValid)
resultsList.addEventListener('click', deleteResult)
iconInform.addEventListener('click', () => {
    infoBlock.classList.toggle('information-block-active')
})

//Функция расчета ИМТ
function calculateBMI(event) {
    event.preventDefault() // Отменяем действия браузера по умолчанию (конкретно здесь - обновление)
    let BMI = 0
    let weight = parseFloat(weightInputOne.value + ',' + weightInputTwo.value) // Значения полученные из двух инпутов для веса соединяем в одно дробное
    let height = parseFloat(heightInput.value) / 100 // Переводим рост из см в м
    height = (height * height).toFixed(4) // Возводим рост в квадрат
    BMI = Number((weight / height).toFixed(2)) // Вычисляем значение ИМТ
    let definition = definitionAccordance(BMI) // Получаем текстовую интерпретацию и цвет заднего фона для значения ИМТ

    // Меняем значения в HTML разметке
    resultBMINum.textContent = BMI
    resultBMIText.textContent = definition[0]
    BMIBG.classList.add(definition[1])

    //Фиксируем дату, когда был произведен расчет
    let date = new Date()
    date = date.toLocaleDateString('ru-US')

    // Вызываем функцию для добавления расчета в историю расчетов
    addResult(event, BMI, definition[0], date)
}

//Функция интерпретации значения ИМТ
function definitionAccordance(BMI) {
    let hash = changeLanguage() //Получаем инфоримацию о языке, на который переведена страница в данный момент
    let color = ''
    let accordance = ''

    // Интерпретация значения ИМТ, если страница переведена на русский
    if (hash === 'ru') {
        if (BMI <= 16) {
            accordance = 'Выраженный дефицит массы тела'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (16 < BMI && BMI <= 18.5) {
            accordance = 'Недостаточная (дефицит) масса тела'
            color = 'BMI-normal'
            return [accordance, color]
        }
        if (18.5 < BMI && BMI <= 25) {
            accordance = 'Норма'
            color = 'BMI-good'
            return [accordance, color]
        }
        if (25 < BMI && BMI <= 30) {
            accordance = 'Избыточная масса тела (предожирение)'
            color = 'BMI-normal'
            return [accordance, color]
        }
        if (30 < BMI && BMI <= 35) {
            accordance = 'Ожирение 1 степени'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (35 < BMI && BMI <= 40) {
            accordance = 'Ожирение 2 степени'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (BMI > 40) {
            accordance = 'Ожирение 3 степени'
            color = 'BMI-bad'
            return [accordance, color]
        }
    } else {
        // Интерпретация значения ИМТ, если страница переведена на английский
        if (BMI <= 16) {
            accordance = 'Pronounced body weight deficiency'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (16 < BMI && BMI <= 18.5) {
            accordance = 'Insufficient (deficiency) body weight'
            color = 'BMI-normal'
            return [accordance, color]
        }
        if (18.5 < BMI && BMI <= 25) {
            accordance = 'Normal'
            color = 'BMI-good'
            return [accordance, color]
        }
        if (25 < BMI && BMI <= 30) {
            accordance = 'Overweight (pre-obesity)'
            color = 'BMI-normal'
            return [accordance, color]
        }
        if (30 < BMI && BMI <= 35) {
            accordance = 'Obesity of the 1st degree'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (35 < BMI && BMI <= 40) {
            accordance = 'Obesity of the 2nd degree'
            color = 'BMI-bad'
            return [accordance, color]
        }
        if (BMI > 40) {
            accordance = 'Obesity of the 3nd degree'
            color = 'BMI-bad'
            return [accordance, color]
        }
    }
}

//Функция добавления расчета в историю
function addResult(event, BMI, accordance, date) {
    //Получаем значения события на странице в общем, значение ИМТ, интерпретацию значения ИМТ и дату расчета
    event.preventDefault() //Отменяем привычное поведение страницы (обновление)
    const newResult = {
        // Создаем объект, в который записываем данные о расчете
        id: Date.now(),
        BMIValue: BMI,
        accordanceValue: accordance,
        dateValue: date,
    }
    results.push(newResult) // Добавляем объект в массив
    saveResult() // Сохраняем результат в LocalStorage
    renderResults(newResult) // Передаем данные о расчете для вывода его на страницу

    // Очищаем все поля для ввода
    weightInputOne.value = ''
    weightInputTwo.value = ''
    heightInput.value = ''

    checkEmptyList() //Проверяем наличие расчетов в истории
}

//Функция вывода расчетов в блок истории
function renderResults(result) {
    // Создаем элемент с HTML разметкой
    const resultHTML = `<li"> 
                            <div class="card card-lg results-element" id="${result.id}>
                                <h2 class="card-subtitle" style="font-size: 20px">${result.dateValue}</h2>
                                <div class="result">
                                    <h3 class="result-title BMI-lg">${result.BMIValue}</h3>
                                    <h3 class="result-title">${result.accordanceValue}</h3>
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/cross.png" alt="Delete" width="18" height="18">
                                    </button>
                                </div>
                            </div>
                        </li>`

    resultsList.insertAdjacentHTML('beforeend', resultHTML) // Вставляем разметку в HTML
}

//Функция удаления результата из истории
function deleteResult(event) {
    console.log('deletefunc')
    if (event.target.dataset.action !== 'delete') return //Если была нажата кнопка, значение data-action которой не равно "delete", выходим из функции
    const parentNode = event.target.closest('.results-element') // Получаем родителя блока, в котором была нажата кнопка
    const id = Number(parentNode.id) // Получаем id элемента, который будем удалять
    const index = results.findIndex(result => result.id === id) //Находим индекс этого элемента в массивке
    results.splice(index, 1) // Вырезаем этот элемент из массива
    saveResult() // Сохраняем в LocalStorage
    parentNode.remove() // Удаляем элемент со страницы
    checkEmptyList() // Проверяем наличие расчетов в истории
}

//Функция сохранения расчетов в LocalStorage
function saveResult() {
    localStorage.setItem('results', JSON.stringify(results)) // Передаем расчеты в LocalStorage в виде JSON строки
}

//Функция проверки наличия расчетов в истории
function checkEmptyList() {
    // Если расчетов в нет, выводим блок с надписью "Расчетов пока еще не было"
    if (results.length === 0) {
        // Создаем HTML разметку блока
        const emptyListHTML = `<li>
                                    <div class="card" id="empty">
                                        <h3 class="result-title lng-resultTitleEmpty" style="font-size: 20px">На данный момент расчетов ИМТ произведено не было.</h3>
                                    </div>
                                </li>`
        resultsList.insertAdjacentHTML('afterbegin', emptyListHTML) // Добавляем блок на страницу
    }
    //Если в массиве результатов все же есть расчеты
    if (results.length > 0) {
        const emptyListEl = document.querySelector('#empty') // Ищем блок с надписью о том, что результатов нет
        emptyListEl ? emptyListEl.remove() : null // Удаляем его, если он есть
    }
    //выполняем функцию изменения языка для того чтобы блок об отсутствии результатов выводился на соответствующем языке
    changeLanguage()
}

//Функция проверки ввода неверных значения
function checkValid(event) {
    event.preventDefault() //Отменяем привычное поведение страницы (обновление)
    let hash = changeLanguage() // Записываем в переменную на какой язык страница переведена в данный момент

    // Выводим ошибку на русском, если страница переведена на русский
    if (hash === 'ru') {
        if (
            !weightInputOne.value ||
            !weightInputTwo.value ||
            !heightInput.value
        ) {
            error = 'Все поля должны быть заполнены'
            showError(error)
            return
        }

        if (weightInputOne.value == 0 && weightInputTwo.value == 0) {
            error = 'Значение веса не может равняться нулю'
            showError(error)
            return
        }

        if (
            (weightInputOne.value[0] == 0 && weightInputOne.value.length > 1) ||
            heightInput.value[0] == 0
        ) {
            error = 'Значение не может начинаться с нуля'
            showError(error)
            return
        }

        if (
            weightInputOne.value < 0 ||
            weightInputTwo.value < 0 ||
            heightInput.value < 0
        ) {
            error = 'Значение не может быть меньше нуля'
            showError(error)
            return
        }

        if (
            !(
                weightInputOne.value.length <= 3 &&
                weightInputOne.value.length > 0
            )
        ) {
            error =
                'Значение веса не может быть больше 999 и меньшше или равно 0'
            showError(error)
            return
        }
        if (weightInputTwo.value.length != 1) {
            error = 'Точность ввода значения - 1 знак после запятой'
            showError(error)
            return
        }
        if (!(heightInput.value.length <= 5 && heightInput.value.length > 0)) {
            error =
                'Значение роста не может быть больше 99999 или меньше или равно 0'
            showError(error)
            return
        }
    } else {
        // Выводим ошибку на английском, если страница переведена на ранглийский
        if (
            !weightInputOne.value ||
            !weightInputTwo.value ||
            !heightInput.value
        ) {
            error = 'All fields must be filled in'
            showError(error)
            return
        }

        if (weightInputOne.value == 0 && weightInputTwo.value == 0) {
            error = 'The weight value cannot be zero'
            showError(error)
            return
        }

        if (
            (weightInputOne.value[0] == 0 && weightInputOne.value.length > 1) ||
            heightInput.value[0] == 0
        ) {
            error = 'The value cannot start from zero'
            showError(error)
            return
        }

        if (
            weightInputOne.value < 0 ||
            weightInputTwo.value < 0 ||
            heightInput.value < 0
        ) {
            error = 'The value cannot be less than zero'
            showError(error)
            return
        }

        if (
            !(
                weightInputOne.value.length <= 3 &&
                weightInputOne.value.length > 0
            )
        ) {
            error =
                'The weight value cannot be greater than 999 and less than/equal to 0'
            showError(error)
            return
        }
        if (weightInputTwo.value.length != 1) {
            error = 'The accuracy of entering a value is one decimal place'
            showError(error)
            return
        }
        if (!(heightInput.value.length <= 5 && heightInput.value.length > 0)) {
            error =
                'The growth value cannot be greater than 99999 or less than/equal to 0'
            showError(error)
            return
        }
    }

    calculateBMI(event)
    errorBlock.classList.remove('error-active')
}

//Функция показа блока с ошибкой
function showError(error) {
    errorBlock.textContent = error //Подставляем значение ошибки в переменную
    errorBlock.classList.add('error-active') // Добавляем класс для того, чтобы блок с ошибкой показался
}

//Функция смены url-а страницы в зависимости от языка
function changeURLLanguage() {
    let lang = select.value
    location.href = window.location.pathname + '#' + lang // Добавляем хэш, обозначающий язык, в конец адреса страницы
    location.reload()
}

//Функция смены языка
function changeLanguage() {
    let hash = window.location.hash // Получаем хэш
    hash = hash.substr(1) // Обрезаем решетку
    // Проверяем чтобы хэш был одним из тех языков, которые доступны для смены. в случае, если язык поставленный в хэш-е нам не известен, заменяем его на русский
    if (!allLanguage.includes(hash)) {
        location.href = window.location.pathname + '#ru'
        location.reload()
    }

    select.value = hash // Устанавливаем значение select-а в соответствии с языком на странице

    // Изменяем значение величин измерений в плэйсхолдерах
    if (hash === 'eng') {
        weightInputOne.placeholder = 'kg'
        weightInputTwo.placeholder = 'g'
        heightInput.placeholder = 'sm'
    }

    // Переводим надписи, имеющиеся в словаре, в соответствии с языкос на странице
    for (let key in langArr) {
        let elem = document.querySelector('.lng-' + key) // Находим элементы по классам
        if (elem) {
            elem.innerHTML = langArr[key][hash] // Переводим их значения
        }
    }
    return hash
}

// Меняем язык на странице
changeLanguage()
