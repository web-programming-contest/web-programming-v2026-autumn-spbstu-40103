localStorage.removeItem('courses');

const STORAGE_KEY = 'courses';
const DELAY = 500; 
const PALETTE = [
    { bg: '#3a5bff', fg: '#fff' },
    { bg: '#f67722', fg: '#fff' },
    { bg: '#12c089', fg: '#fff' },
    { bg: '#2c0497', fg: '#fff' },
    { bg: '#dd064e', fg: '#fff' },
    { bg: '#f2c532', fg: '#fff' }
];

function loadCourses() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw).map(c => new Course(c.courseId, c.title, c.students));
        }
    } catch (err) {
        console.error('Не удалось прочитать localStorage:', err);
    }
    return createSampleCourses();
}

function saveCourses() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (err) {
        console.error('Не удалось сохранить данные:', err);
    }
}

let courses = loadCourses();
let fresh = { courseId: null, studentKey: null };
let firstRender = true;

window.addEventListener('beforeunload', saveCourses);

function asyncOperation(action) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(action());
            } catch (err) {
                reject(err);
            }
        }, DELAY);
    });
}

function perform(action, successText) {
    showMessage('Сохраняем…', false, true);
    return asyncOperation(action)
        .then(() => {
            saveCourses();
            render();
            showMessage(successText);
            return true;
        })
        .catch(err => {
            showMessage(err.message, true);
            return false;
        });
}

const coursesEl = document.getElementById('courses');
const summaryEl = document.getElementById('summary');
const toastEl = document.getElementById('toast');
const courseForm = document.getElementById('course-form');
const studentForm = document.getElementById('student-form');
const courseSelect = document.getElementById('student-course');

let toastTimer;
function showMessage(text, isError = false, sticky = false) {
    toastEl.textContent = text;
    toastEl.classList.toggle('error', isError);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    if (!sticky) {
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), isError ? 6000 : 3500);
    }
}

function plural(n, one, few, many) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function button(text, className, onClick) {
    const btn = el('button', className, text);
    btn.type = 'button';
    btn.addEventListener('click', onClick);
    return btn;
}

function findCourse(courseId) {
    const course = courses.find(c => c.courseId === courseId);
    if (!course) throw new Error('Курс не найден.');
    return course;
}

function createCard(course, index) {
    const { bg, fg } = PALETTE[course.courseId % PALETTE.length];
    const card = el('article', 'card');
    card.style.setProperty('--bg', bg);
    card.style.setProperty('--fg', fg);
    card.style.setProperty('--i', index);
    if (firstRender) card.classList.add('intro');
    if (fresh.courseId === course.courseId) card.classList.add('fresh');

    const n = course.studentCount;
    const meta = el('div', 'card-meta');
    meta.append(
        el('span', 'pill', `${n} ${plural(n, 'студент', 'студента', 'студентов')}`),
        el('span', 'cid', `ID ${course.courseId}`)
    );

    const list = el('ul', 'students');
    if (n === 0) {
        list.append(el('li', 'empty-students', 'Пока никого. Добавьте первого студента.'));
    }
    for (const student of course.students) {
        const chip = el('li', 'chip');
        if (fresh.studentKey === `${course.courseId}:${student.id}`) chip.classList.add('fresh');

        const remove = button('×', 'chip-remove', () =>
            perform(() => findCourse(course.courseId).removeStudent(student.id),
                `Студент «${student.name}» удалён`)
        );
        remove.title = 'Удалить студента';
        remove.setAttribute('aria-label', `Удалить студента ${student.name}`);

        chip.append(
            el('span', 'avatar', student.name.trim().charAt(0).toUpperCase()),
            el('span', '', student.name),
            el('span', 'sid', `id ${student.id}`),
            remove
        );
        list.append(chip);
    }

    const actions = el('div', 'actions');
    actions.append(
        button('Добавить студента', 'btn-ghost', () => {
            courseSelect.value = course.courseId;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            studentForm.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
            studentForm.elements.studentId.focus({ preventScroll: true });
        }),
        button('Удалить курс', 'btn-text', () =>
            perform(() => {
                findCourse(course.courseId);
                courses = courses.filter(c => c.courseId !== course.courseId);
            }, `Курс «${course.title}» удалён`)
        )
    );

    card.append(meta, el('h3', '', course.title), list, actions);
    return card;
}

function render() {
    coursesEl.replaceChildren();

    if (courses.length === 0) {
        const empty = el('div', 'empty');
        empty.append(
            el('h3', '', 'Курсов пока нет'),
            el('p', '', 'Заполните форму «Новый курс» и нажмите «Добавить курс».')
        );
        coursesEl.append(empty);
    }
    courses.forEach((course, index) => coursesEl.append(createCard(course, index)));

    const selected = courseSelect.value;
    courseSelect.replaceChildren();
    for (const course of courses) {
        const option = el('option', '', course.title);
        option.value = course.courseId;
        courseSelect.append(option);
    }
    if ([...courseSelect.options].some(o => o.value === selected)) {
        courseSelect.value = selected;
    }

    const students = getUniqueStudents(courses).length;
    summaryEl.textContent = courses.length === 0
        ? 'Пока ничего нет'
        : `${courses.length} ${plural(courses.length, 'курс', 'курса', 'курсов')}, ` +
          `${students} ${plural(students, 'студент', 'студента', 'студентов')}`;

    firstRender = false;
    fresh = { courseId: null, studentKey: null };
}

courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const id = Number(courseForm.elements.courseId.value);
    const title = courseForm.elements.title.value.trim();

    perform(() => {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID курса должен быть положительным целым числом.');
        }
        if (!title) {
            throw new Error('Введите название курса.');
        }
        if (courses.some(c => c.courseId === id)) {
            throw new Error(`Курс с ID ${id} уже есть. Укажите другой ID.`);
        }
        if (courses.some(c => c.title.trim().toLowerCase() === title.toLowerCase())) {
            throw new Error(`Курс «${title}» уже есть. Выберите другое название.`);
        }
        courses.push(new Course(id, title));
        fresh.courseId = id;
    }, `Курс «${title}» добавлен`).then(ok => {
        if (ok) {
            courseForm.reset();
            courseForm.elements.courseId.focus();
        }
    });
});

studentForm.addEventListener('submit', event => {
    event.preventDefault();
    const courseId = Number(studentForm.elements.courseId.value);
    const id = Number(studentForm.elements.studentId.value);
    const name = studentForm.elements.studentName.value.trim();

    perform(() => {
        if (courses.length === 0) {
            throw new Error('Сначала добавьте курс.');
        }
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('ID студента должен быть положительным целым числом.');
        }
        if (!name) {
            throw new Error('Введите имя студента.');
        }

        const course = findCourse(courseId);

        const existing = getUniqueStudents(courses).find(s => s.id === id);
        if (existing && existing.name.toLowerCase() !== name.toLowerCase()) {
            throw new Error(`ID ${id} уже принадлежит студенту «${existing.name}». Укажите другой ID.`);
        }

        course.addStudent({ id, name: existing ? existing.name : name });
        fresh.studentKey = `${courseId}:${id}`;
    }, `Студент «${name}» добавлен`).then(ok => {
        if (ok) {
            studentForm.elements.studentId.value = '';
            studentForm.elements.studentName.value = '';
            studentForm.elements.studentId.focus();
        }
    });
});

render();

console.log('Группировка курсов по количеству студентов:', groupCoursesByStudentCount(courses));
console.log('Уникальные студенты:', getUniqueStudents(courses));
console.log('Курсы студента с id=1:', getCoursesByStudentId(courses, 1));
console.log('Студенты по курсам:', groupStudentsByCourse(courses));
console.log('Курсы с максимумом студентов:', getCoursesWithMaxStudents(courses));