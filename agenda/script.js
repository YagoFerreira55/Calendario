document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const themeToggle = document.getElementById("theme-toggle");

    // Feriados no mês de Março de 2025 (Brasil)
    const holidays = [
        { date: "2025-03-03", name: "Carnaval" },
        { date: "2025-03-08", name: "Dia Internacional da Mulher" },
        { date: "2025-03-14", name: "Sexta-feira Santa" },
        { date: "2025-03-19", name: "Dia de São José" },
    ];

    const today = new Date();
    const currentMonth = 2; // Março (zero-indexed, então 2 representa março)
    const currentYear = today.getFullYear();

    // Função para gerar o calendário
    function generateCalendar(year, month) {
        calendar.innerHTML = "";  // Limpar o conteúdo do calendário

        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Quantos dias tem no mês

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Verifica se o dia é final de semana (sábado ou domingo)
            const date = new Date(year, month, day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Domingo, 6 = Sábado

            // Verifica se o dia é um feriado
            const holiday = holidays.find(h => {
                const holidayDate = new Date(h.date);
                return holidayDate.getFullYear() === year && holidayDate.getMonth() === month && holidayDate.getDate() === day;
            });

            // Verifica se há anotações para o dia
            const notes = JSON.parse(localStorage.getItem("notes")) || {};
            const noteKey = `${year}-${month + 1}-${day}`;
            const hasNote = notes[noteKey] ? true : false;

            // Aplica as marcações de final de semana, feriado ou anotação
            if (isWeekend) dayElement.classList.add("weekend");
            if (holiday) dayElement.classList.add("holiday");
            if (hasNote) dayElement.classList.add("has-note");

            // Verifica a combinação de múltiplas marcações (feriado, final de semana e anotação)
            if (isWeekend && holiday && hasNote) {
                dayElement.classList.add("three-risks");
            }

            // Exibe o nome do feriado ao passar o mouse
            if (holiday) {
                dayElement.title = `Feriado: ${holiday.name}`;
            }

            // Adiciona depuração para verificar se as anotações estão sendo aplicadas
            console.log(`Verificando anotações para ${noteKey}: ${hasNote ? 'Tem anotações' : 'Sem anotações'}`);

            // Redireciona para a página de anotações ao clicar
            dayElement.addEventListener("click", function () {
                window.location.href = `note.html?year=${year}&month=${month}&day=${day}`;
            });

            calendar.appendChild(dayElement);
        }
    }

    generateCalendar(currentYear, currentMonth);

    // Alternância de tema (modo claro/escuro)
    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");

        // Alterar cor do título "Agenda Mensal" para branco no modo escuro
        const title = document.querySelector('h1');
        if (document.body.classList.contains("dark-theme")) {
            title.style.color = 'white';
        } else {
            title.style.color = '#333'; // Cor padrão do título no tema claro
        }

        // Regerar o calendário após alternar o tema para aplicar as classes de marcação corretas
        generateCalendar(currentYear, currentMonth);
    }

    // Definir o tema ao carregar a página
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        document.querySelector('h1').style.color = 'white'; // Definir título branco ao carregar o tema escuro
    }

    themeToggle.addEventListener("click", toggleTheme);
});
