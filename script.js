document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const notes = {}; // Armazena anotações

    function generateCalendar(year, month) {
        calendar.innerHTML = ""; 
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            function updateDayView() {
                dayElement.innerHTML = `<strong>${day}</strong>`;
                if (notes[`${year}-${month}-${day}`]) {
                    dayElement.innerHTML += `<br>${notes[`${year}-${month}-${day}`]}`;
                    dayElement.innerHTML += `<br><button class='remove-btn' data-day='${day}'>Remover</button>`;
                }
            }

            dayElement.addEventListener("click", function () {
                const note = prompt(`Adicionar anotação para ${day}/${month + 1}/${year}`);
                if (note) {
                    notes[`${year}-${month}-${day}`] = note;
                }
                updateDayView();
            });

            calendar.appendChild(dayElement);
        }
    }

    // Adiciona um evento de clique no calendário inteiro para capturar os botões de remoção
    calendar.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const dayToRemove = event.target.getAttribute("data-day");
            delete notes[`${currentYear}-${currentMonth}-${dayToRemove}`];
            generateCalendar(currentYear, currentMonth); // Recarrega o calendário
        }
    });

    generateCalendar(currentYear, currentMonth);
});
