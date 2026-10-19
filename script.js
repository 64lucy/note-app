
const noteCount = document.getElementById("noteCount");
const noteForm = document.getElementById("noteForm");
const searchInput = document.getElementById("searchInput");
const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const pinInput = document.getElementById("pinInput");
const categoryInput = document.getElementById("categoryInput");
const filterCategory = document.getElementById("filterCategory");
const notesList = document.getElementById("notesList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

noteForm.addEventListener("submit", function (event) {
   event.preventDefault();

   if (titleInput.value.trim() === "") {
      alert("please enter a title.");
      titleInput.focus();
      return;
   }
   if (noteInput.value.trim() === "") {
      alert("Please enter your note");
      noteInput.focus();
      return;
   };

   const newNote = {
      title: titleInput.value,
      note: noteInput.value,
      category: categoryInput.value,
      pin: pinInput.checked,
      date: new Date().toLocaleString()
   };


   notes.push(newNote);

   localStorage.setItem("notes", JSON.stringify(notes));

   renderNotes(notes);
   clearInputs();
   alert("✅ Note saved successfully!");
});

function clearInputs() {
   titleInput.value = "";
   noteInput.value = "";
   categoryInput.value = "Select Category";
   pinInput.checked = false;
}



noteInput.addEventListener("keydown", function (event) {

   if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      noteForm.requestSubmit();
   }
});

searchInput.addEventListener("input", function () {
   const searchText = searchInput.value.toLowerCase();

   const filteredNotes = notes.filter(function (note) {
      return (
         note.title.toLowerCase().includes(searchText) ||
         note.note.toLowerCase().includes(searchText)
      );
   });

   renderNotes(filteredNotes);
});

filterCategory.addEventListener("change", function () {
   const filteredCategory = filterCategory.value;

   if (filteredCategory === "All") {
      renderNotes(notes);
      return;
   }
   const filteredNotes = notes.filter(function (note) {
      return note.category === filteredCategory;
   });
   renderNotes(filteredNotes);
});

function renderNotes(noteArray) {
   noteCount.innerText = noteArray.length;

   noteArray.sort(function (a, b) {
      return b.pin - a.pin;
   });
   


   notesList.innerHTML = "";
   if (noteArray.length === 0) {
      notesList.innerHTML = "<p class='empty-message'>📝 No notes yet.Create your first note!</p>"
      return;
   }
   
   noteArray.forEach(function (note, index) {
      const li = document.createElement("li");

      if (note.pin) {
         li.classList.add("pinned");
      }

      
      li.innerHTML = `
 <h3>${note.pin ? "📌" : ""}${note.title}</h3>
 <p>${note.note} </p>

 <div class ="note-info">
 <span>🏷️${note.category}</span>
 <span>📅${note.date}</span>
  </div>
 `;

      const editButton = document.createElement("button");
      editButton.innerText = " ✏️ Edit";
      editButton.classList.add("edit-btn");
      editButton.onclick = function () {

         titleInput.value = note.title;
         noteInput.value = note.note;
         categoryInput.value = note.category;
         pinInput.checked = note.pin;
         
         const realIndex = notes.indexOf(note);
         notes.splice(realIndex, 1);
         localStorage.setItem("notes", JSON.stringify(notes));
         renderNotes(notes);


      };
      const deleteButton = document.createElement("button");
      deleteButton.innerText = " 🗑️ Delete";
      deleteButton.classList.add("delete-btn");

      deleteButton.onclick = function () {
         const realIndex = notes.indexOf(note);
         notes.splice(realIndex, 1);
         localStorage.setItem("notes", JSON.stringify(notes));
         renderNotes(notes);
      };

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);


      li.appendChild(buttonContainer);
      notesList.appendChild(li);
   });


}
renderNotes(notes);






