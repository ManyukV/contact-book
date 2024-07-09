const modalTrigger = document.querySelector("[data-openAdd]"),
  modalContact = document.querySelector(".add_contact"),
  modalInner = document.querySelector(".modal_content"),
  modalGroupTrigger = document.querySelector('[data-openGroup]');

function appendContact(wrapper) {
  wrapper.innerHTML = `<div class="modal__header">
                            <h2>Добавление контакта</h2>
                            <div class="modal__close" data-close>&times;</div>
                          </div>
                          <form class="add__contact">
                            <input type="text" placeholder="Введите ФИО" name="item" required/>
                            <input type="text" placeholder="Введите номер" name="tel" required/>
                            <select name="group" required>
                              <option value="" disabled selected>Выберите группу</option>
                              <option>1</option>
                            </select>
                            <button type="submit" class="btn btn-primary" data-add>Сохранить</button>
                          </form>`;
  document.querySelector("[data-close]").addEventListener("click", closeModalContact);
  document.querySelector(".add__contact").addEventListener("submit", addContact);
}

function appendGroup(wrapper) {
  wrapper.innerHTML = `<div class="modal__header">
                            <h2>группы контактов</h2>
                            <div class="modal__close" data-close>&times;</div>
                          </div>
                          <form class="add__contact">
                            
                          </form>`;
  document.querySelector("[data-close]").addEventListener("click", closeModalContact);
  // document.querySelector(".add__contact").addEventListener("submit", addContact);
}

function openModalGroup() {
  modalContact.classList.remove("hide");
  modalContact.classList.add("show");
  appendGroup(modalInner);
}

function openModalContact() {
  modalContact.classList.remove("hide");
  modalContact.classList.add("show");
  appendContact(modalInner);
}

function closeModalContact() {
  modalContact.classList.remove("show");
  modalContact.classList.add("hide");
}

modalTrigger.addEventListener("click", openModalContact);
modalGroupTrigger.addEventListener('click', openModalGroup);

const contacts = document.querySelector(".contacts__wrapper");
const contactsArr = JSON.parse(localStorage.getItem("contacts")) || [];

function addContact(e) {
  e.preventDefault();
  const name = e.target.item.value,
    tel = e.target.tel.value;
  const contact = {
    fio: name,
    number: tel,
  };
  contactsArr.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contactsArr));
  e.target.reset();
  closeModalContact();
  displayContacts(contactsArr, contacts);
}

function displayContacts(persons, personsList) {
  if (persons.length === 0) {
    personsList.className = 'contacts__wrapper empty';
    personsList.innerHTML = '<p>Список контактов пуст</p>';
    return;
  }
  personsList.className = 'contacts__wrapper full';
  personsList.innerHTML = persons
    .map((person) => {
      return `<div class="person">
              <div class="person__name">
                  <p>${person.fio}</p>
              </div>
              <div class="person__tel">
                  <p>${person.number}</p>
                  <button class=" me-3" data-action="delete" data-number="${person.number}"></button>
                  <button class="" data-action="change"></button>
              </div>
          </div>
          <span class="line"></span>`;
    })
    .join(""); 
  document.querySelectorAll("[data-action='delete']").forEach(button => {
    button.addEventListener("click", deleteContact);
  });
  document.querySelectorAll("[data-action='change']").forEach(button => {
    button.addEventListener("click", changeContact);
  });
}

function deleteContact(event) {
  const number = event.target.getAttribute("data-number");
  const index = contactsArr.findIndex(contact => contact.number === number);
  if (index !== -1) {
    contactsArr.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contactsArr));
    displayContacts(contactsArr, contacts);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayContacts(contactsArr, contacts);
});

