const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const tijdvakken = ['ochtend', 'middag', 'avond'];

//localStorage
function laadTaken() {
  const data = localStorage.getItem('weekplanner');
  return data ? JSON.parse(data) : {};
}

function slaTakenOp(data) {
  localStorage.setItem('weekplanner', JSON.stringify(data));
}

function updateStorage() {
  const data = {};
  dagen.forEach(dag => {
    data[dag] = {};
    tijdvakken.forEach(tijd => {
      const kolom = document.getElementById(`${dag}-${tijd}`);
      const taken = [...kolom.querySelectorAll('.task')].map(taak => taak.firstChild.textContent);
      data[dag][tijd] = taken;
    });
  });
  slaTakenOp(data);
}

//taken
const opgeslagenTaken = laadTaken();

dagen.forEach(dag => {
  tijdvakken.forEach(tijd => {
    const kolomId = `${dag}-${tijd}`;
    const kolom = document.getElementById(kolomId);
    if (kolom) {
      new Sortable(kolom, {
        group: 'weekplanner',
        animation: 150,
        ghostClass: 'ghost',
        draggable: '.task',
        onEnd: updateStorage
      });

      // Laad opgeslagen taken
      const taken = opgeslagenTaken[dag]?.[tijd] || [];
      taken.forEach(taakTekst => {
        const taak = document.createElement('div');
        taak.className = 'task';
        taak.textContent = taakTekst;
        voegBewerkEnVerwijderKnoppenToe(taak);
        kolom.appendChild(taak);
      });

      // Voorbeeldtaak
      if (kolomId === 'maandag-ochtend' && taken.length === 0) {
        const voorbeeldTaak = document.createElement('div');
        voorbeeldTaak.className = 'task';
        voorbeeldTaak.textContent = '📌 Voorbeeldtaak';
        voegBewerkEnVerwijderKnoppenToe(voorbeeldTaak);
        kolom.appendChild(voorbeeldTaak);
        updateStorage();
      }
    }
  });
});


//taken bewerken/verwijderen
function voegBewerkEnVerwijderKnoppenToe(taak) {
  const btnContainer = document.createElement('span');
  btnContainer.style.display = 'flex';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.innerHTML = '✏️';
  editBtn.title = 'Bewerk taak';
  editBtn.addEventListener('click', () => {
    huidigeDag = taak.parentElement.id.split('-')[0];
    huidigeTaak = taak;
    taskInput.value = taak.firstChild.textContent;
    modal.style.display = 'flex';
    taskInput.focus();
  });
  btnContainer.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.title = 'Verwijder taak';
  deleteBtn.addEventListener('click', () => {
    taak.remove();
    updateStorage();
  });
  btnContainer.appendChild(deleteBtn);

  taak.appendChild(btnContainer);
}

//taak toevoegen
const modal = document.getElementById('taskModal');
const closeButton = modal.querySelector('.close-button');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const taskInput = document.getElementById('taskInput');

let huidigeDag = '';
let huidigeTaak = null;

document.querySelectorAll('.add-day-task-btn').forEach(button => {
  button.addEventListener('click', () => {
    huidigeDag = button.dataset.dag;
    huidigeTaak = null;
    taskInput.value = '';
    modal.style.display = 'flex';
    taskInput.focus();
  });
});

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
  huidigeTaak = null;
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    huidigeTaak = null;
  }
});

saveTaskBtn.addEventListener('click', () => {
  const taakTekst = taskInput.value.trim();
  if (taakTekst === '') return;

  if (huidigeTaak) {
    huidigeTaak.firstChild.textContent = taakTekst;
  } else {
    const kolom = document.getElementById(`${huidigeDag}-ochtend`);
    const nieuweTaak = document.createElement('div');
    nieuweTaak.className = 'task';
    nieuweTaak.textContent = taakTekst;
    voegBewerkEnVerwijderKnoppenToe(nieuweTaak);
    kolom.appendChild(nieuweTaak);
  }

  updateStorage();
  modal.style.display = 'none';
  huidigeTaak = null;
});

const clearBtn = document.getElementById('clearAllBtn');

clearBtn.addEventListener('click', () => {
  if (confirm("Weet je zeker dat je alle taken wilt verwijderen?")) {
    // LocalStorage leegmaken
    localStorage.removeItem('weekplanner');

    // Alle kolommen leegmaken
    dagen.forEach(dag => {
      tijdvakken.forEach(tijd => {
        const kolom = document.getElementById(`${dag}-${tijd}`);
        kolom.innerHTML = '';
      });
    });
  }
});

//bronnen
// https://www.youtube.com/watch?v=6ophW7Ask_0 voor Modal pop-up, zoals ik gebruikt in taak pop-up
// https://www.youtube.com/watch?v=Ttf3CEsEwMQæ gebruikt als ondersteuning en uitleg bij het toevoegen, beweren en verwijderen van taken
// https://www.youtube.com/watch?v=j-BsQhDsx24 gebruikt voor de localstorage functionaliteit