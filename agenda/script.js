document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const notes = JSON.parse(localStorage.getItem("notes")) || {};

    function generateCalendar(year, month) {
        calendar.innerHTML = "";
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Verifica se há anotação para esse dia e adiciona a classe 'has-note'
            const noteKey = `${year}-${month}-${day}`;
            if (notes[noteKey]) {
                dayElement.classList.add("has-note");
            }

            // Redireciona para a página de anotações ao clicar em um dia
            dayElement.addEventListener("click", function () {
                window.location.href = `note.html?year=${year}&month=${month}&day=${day}`;
            });

            calendar.appendChild(dayElement);
        }
    }

    generateCalendar(currentYear, currentMonth);
});
