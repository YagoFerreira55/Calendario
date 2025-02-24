document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const themeToggle = document.getElementById("theme-toggle");

    function generateCalendar(year, month) {
        calendar.innerHTML = "";
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Verifica se há anotações para o dia
            const notes = JSON.parse(localStorage.getItem("notes")) || {};
            const noteKey = `${year}-${month}-${day}`;
            if (notes[noteKey]) {
                dayElement.classList.add("has-note");
            }

            // Redireciona para a página de anotações ao clicar
            dayElement.addEventListener("click", function () {
                window.location.href = `note.html?year=${year}&month=${month}&day=${day}`;
            });

            calendar.appendChild(dayElement);
        }
    }

    generateCalendar(currentYear, currentMonth);

    // Alternância de tema claro/escuro
    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    }

    // Carregar tema salvo
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }

    themeToggle.addEventListener("click", toggleTheme);
});
