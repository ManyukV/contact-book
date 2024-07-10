const modalTrigger = document.querySelector("[data-openAdd]"),
  modalContact = document.querySelector(".add_contact"),
  modalInner = document.querySelector(".modal_content"),
  modalGroupTrigger = document.querySelector("[data-openGroup]");

function loadGroups() {
  let groups = JSON.parse(localStorage.getItem("groups"));
  if (!groups || groups.length === 0) {
    groups = ["Семья", "Работа"];
    saveGroups(groups);
  }
  return groups;
}

function saveGroups(groups) {
  localStorage.setItem("groups", JSON.stringify(groups));
}

function updateGroupSelect() {
  const groups = loadGroups();
  const select = document.querySelector("select[name='group']");
  if (!select) {
    console.warn("Element 'select[name=group]' not found.");
    return;
  }
  select.innerHTML = `<option value="" disabled selected>Выберите группу</option>`;
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    select.appendChild(option);
  });
}

function formatPhoneNumber(value) {
  const phoneNumber = value.replace(/\D/g, "");
  const match = phoneNumber.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return value;
}

function applyPhoneMask(inputElement) {
  inputElement.addEventListener("input", function () {
    let value = inputElement.value.replace(/\D/g, "");
    if (value.length > 0) value = "+" + value;
    inputElement.value = formatPhoneNumber(value);
  });

  inputElement.addEventListener("keydown", function (e) {
    const isDigit = e.key >= "0" && e.key <= "9";
    const isControl =
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight";
    if (!isDigit && !isControl) {
      e.preventDefault();
    }
  });
}

function changeContactForm(wrapper, name, tel, group) {
  wrapper.innerHTML = `<div class="modal__header">
                            <h2>Изменение контакта</h2>
                            <div class="modal__close" data-close>&times;</div>
                          </div>
                          <form class="add__contact">
                            <input type="text" placeholder="Введите ФИО" name="item" value="${name}" required/>
                            <input type="tel" placeholder="Введите номер телефона" name="tel" value="${tel}" pattern="\\+375 \\(\\d{2}\\) \\d{3}-\\d{2}-\\d{2}" inputmode="numeric" required/>
                            <select name="group">
                              <option value="" disabled selected>Выберите группу</option>
                            </select>
                            <button type="submit" class="btn btn-primary" data-add>Сохранить</button>
                          </form>`;
  document
    .querySelector("[data-close]")
    .addEventListener("click", closeModalContact);
  document
    .querySelector(".add__contact")
    .addEventListener("submit", (e) => updateContact(e, name));

  const phoneInput = document.querySelector('input[name="tel"]');
  applyPhoneMask(phoneInput);

  updateGroupSelect();

  const groupSelect = document.querySelector('select[name="group"]');
  groupSelect.value = group;
}

function appendContact(wrapper) {
  wrapper.innerHTML = `<div class="modal__header">
                            <h2>Добавление контакта</h2>
                            <div class="modal__close" data-close>&times;</div>
                          </div>
                          <form class="add__contact">
                            <input type="text" placeholder="Введите ФИО" name="item" required/>
                            <input type="tel" placeholder="Введите номер телефона" name="tel" pattern="\\+375 \\(\\d{2}\\) \\d{3}-\\d{2}-\\d{2}" inputmode="numeric" required/>
                            <select name="group">
                              <option value="" disabled selected>Выберите группу</option>
                            </select>
                            <button type="submit" class="btn btn-primary" data-add>Сохранить</button>
                          </form>`;
  document
    .querySelector("[data-close]")
    .addEventListener("click", closeModalContact);
  document
    .querySelector(".add__contact")
    .addEventListener("submit", addContact);

  const phoneInput = document.querySelector('input[name="tel"]');
  applyPhoneMask(phoneInput);

  updateGroupSelect();
}

function appendGroup(wrapper) {
  wrapper.innerHTML = `<div class="modal__header">
                            <h2>Группы контактов</h2>
                            <div class="modal__close" data-close>&times;</div>
                          </div>
                          <form class="add__group">               
                              <button type="button" class="btn" data-addGroup>Добавить</button>
                              <button type="submit" class="btn btn-primary" data-addSave>Сохранить</button>                       
                          </form>`;
  document
    .querySelector("[data-close]")
    .addEventListener("click", closeModalContact);
  document
    .querySelector("[data-addGroup]")
    .addEventListener("click", () => addGroupInput(""));
  document.querySelector(".add__group").addEventListener("submit", addGroup);
  loadGroups().forEach((group) => {
    addGroupInput(group);
  });
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

function openModalContactChange(name, tel, group) {
  modalContact.classList.remove("hide");
  modalContact.classList.add("show");
  changeContactForm(modalInner, name, tel, group);
}

function closeModalContact() {
  const groupInputs = document.querySelectorAll(
    ".add__group input[data-group]"
  );
  groupInputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.parentElement.remove();
    }
  });
  modalContact.classList.remove("show");
  modalContact.classList.add("hide");
}

modalTrigger.addEventListener("click", openModalContact);
modalGroupTrigger.addEventListener("click", openModalGroup);

const contacts = document.querySelector(".contacts__wrapper");
let contactsArr = JSON.parse(localStorage.getItem("contacts")) || [];

function addContact(e) {
  e.preventDefault();
  const name = e.target.item.value,
    tel = e.target.tel.value,
    group = e.target.group.value || "Без группы";
  const contact = {
    fio: name,
    number: tel,
    group: group,
  };
  contactsArr.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contactsArr));
  e.target.reset();
  closeModalContact();
  displayContacts(contactsArr, contacts);
}

function updateContact(e, oldName) {
  e.preventDefault();
  const name = e.target.item.value,
    tel = e.target.tel.value,
    group = e.target.group.value || "Без группы";

  const index = contactsArr.findIndex((contact) => contact.fio === oldName);
  if (index !== -1) {
    contactsArr[index] = {
      fio: name,
      number: tel,
      group: group,
    };
    localStorage.setItem("contacts", JSON.stringify(contactsArr));
    closeModalContact();
    displayContacts(contactsArr, contacts);
  }
}

function groupContactsByGroup(contacts) {
  return contacts.reduce((groups, contact) => {
    const groupName = contact.group || "Без группы";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(contact);
    return groups;
  }, {});
}

function displayContacts(persons, personsList) {
  if (persons.length === 0) {
    personsList.className = "contacts__wrapper empty";
    personsList.innerHTML = "<p>Список контактов пуст</p>";
    return;
  }

  const groupedContacts = groupContactsByGroup(persons);
  personsList.className = "contacts__wrapper full";
  personsList.innerHTML = Object.keys(groupedContacts)
    .map((groupName) => {
      const contactsHTML = groupedContacts[groupName]
        .map((person, index, array) => {
          return `<div class="person">
                    <div class="person__item">
                      <div class="person__name">
                        <p name="fio">${person.fio}</p>
                      </div>
                      <div class="person__tel">
                        <p name="tel">${person.number}</p>
                        <button class="me-3" data-action="delete" data-number="${person.number}"></button>
                        <button data-action="change"></button>
                      </div>
                    </div>
                     ${
                       index < array.length - 1
                         ? '<div class="person__line"></div>'
                         : ""
                     }
                  </div>`;
        })
        .join("");

      return `<div class="group expanded">
          <div class="group__item">
            <h3>${groupName === "Без группы" ? "Нет группы" : groupName}</h3>
            <button class="toggle-group" data-action="toggle"><img src="./img/close.png" alt="close" class="rotated"></button>
          </div>
          <div class="person__line"></div>
          <div class="group-contacts" style="display: block;">
            ${contactsHTML}
          </div>
        </div>`;
    })
    .join("");

  document.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", deleteContact);
  });
  document.querySelectorAll("[data-action='change']").forEach((button) => {
    button.addEventListener("click", changeContact);
  });

  document.querySelectorAll(".group__item").forEach((groupItem) => {
    groupItem.addEventListener("click", toggleGroup);
  });
}


function toggleGroup(event) {
  const groupItem = event.target.closest(".group__item");
  const group = groupItem.closest(".group");
  const groupContacts = group.querySelector(".group-contacts");
  const img = groupItem.querySelector("img");

  if (groupContacts.style.display === "none" || groupContacts.style.display === "") {
    groupContacts.style.display = "block";
    img.classList.add("rotated");
    group.classList.add("expanded");
  } else {
    groupContacts.style.display = "none";
    img.classList.remove("rotated");
    group.classList.remove("expanded");
  }
}

function deleteContact(event) {
  const number = event.target.getAttribute("data-number");
  const index = contactsArr.findIndex((contact) => contact.number === number);
  if (index !== -1) {
    contactsArr.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contactsArr));
    displayContacts(contactsArr, contacts);
  }
}

function addGroupInput(groupName = "") {
  const groupForm = document.querySelector(".add__group");
  const newDiv = document.createElement("div");
  newDiv.classList.add("group_input");
  newDiv.innerHTML = `<input type="text" data-group placeholder="Введите название группы" name="group" value="${groupName}"/>
                      <button type="button" class="delete-btn"></button>`;
  groupForm.insertBefore(newDiv, groupForm.querySelector("[data-addSave]"));
  newDiv.querySelector(".delete-btn").addEventListener("click", () => {
    deleteGroup(newDiv, groupName);
  });
}

function deleteGroup(div, groupName) {
  div.remove();
  let groups = loadGroups();
  groups = groups.filter((group) => group !== groupName);
  saveGroups(groups);

  contactsArr = contactsArr.map((contact) => {
    if (contact.group === groupName) {
      return { ...contact, group: "Без группы" };
    }
    return contact;
  });
  localStorage.setItem("contacts", JSON.stringify(contactsArr));

  updateGroupSelect();
  displayContacts(contactsArr, contacts);
}

function addGroup(e) {
  e.preventDefault();
  const groupInputs = document.querySelectorAll(
    ".add__group input[data-group]"
  );
  const groups = loadGroups();
  groupInputs.forEach((input) => {
    const groupName = input.value.trim();
    if (groupName !== "" && !groups.includes(groupName)) {
      groups.push(groupName);
    }
  });
  saveGroups(groups);
  updateGroupSelect();
}

function changeContact(event) {
  const personElement = event.target.closest(".person");
  const name = personElement.querySelector('p[name="fio"]').textContent;
  const tel = personElement.querySelector('p[name="tel"]').textContent;
  const group = personElement.closest(".group").querySelector("h3").textContent;

  openModalContactChange(name, tel, group);
}

document.addEventListener("DOMContentLoaded", () => {
  displayContacts(contactsArr, contacts);
});
