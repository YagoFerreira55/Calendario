document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const weekDaysContainer = document.getElementById("weekDays");
    const themeToggle = document.getElementById("theme-toggle");

    const today = new Date();
    const currentMonth = 10;
    const currentYear = today.getFullYear();
    const notes = JSON.parse(localStorage.getItem("notes")) || {};
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    // conecta o API
    async function fetchHolidays() {
        try {
            const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${currentYear}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao carregar feriados:", error);
            return [];
        }
    }
    function createWeekDaysHeader() {
        weekDaysContainer.innerHTML = "";
        weekDays.forEach(day => {
            const dayElement = document.createElement("div");
            dayElement.classList.add("week-day");
            dayElement.textContent = day;
            weekDaysContainer.appendChild(dayElement);
        });
    }

    // Função para gerar o calendário
    async function generateCalendar(year, month) {
        calendar.innerHTML = "";  // Limpar o conteúdo do calendário
        //calendar.classList.add("days");
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Quantos dias tem no mês

        const holidays = await fetchHolidays(currentYear);

        const monthHolidays = holidays.filter(h => {
            const holidayDate = new Date(h.date + "T00:00:00");
            return holidayDate.getMonth() === month;
        });

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement("div");
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Verifica se o dia é final de semana (sábado ou domingo)
            const date = new Date(year, month, day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Domingo, 6 = Sábado

            // Verifica se o dia é um feriado
            const holiday = monthHolidays.find(h =>
                new Date(h.date + "T00:00:00").getDate() === day
            );

            // Verifica se há anotações para o dia
            const notes = JSON.parse(localStorage.getItem("notes")) || {};

            // retirado +1 no month
            const noteKey = `${year}-${month}-${day}`;
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

    createWeekDaysHeader();
    generateCalendar(currentYear, currentMonth);

    // Alternância de tema (modo claro/escuro)
    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");

        // Salvar tema no localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Alterar ícone do botão
        themeToggle.textContent = isDark ? "☀️ Alternar Tema" : "🌙 Alternar Tema";

        // Alterar cor do título "Agenda Mensal" para branco no modo escuro
        document.querySelector('h1').style.color = isDark ? 'white' : '#333';

        // Regerar o calendário para aplicar as classes corretamente
        generateCalendar(currentYear, currentMonth);
    }

    // Definir o tema ao carregar a página
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        document.querySelector('h1').style.color = 'white';
        themeToggle.textContent = "☀️ Alternar Tema";
    } else {
        themeToggle.textContent = "🌙 Alternar Tema";
    }

    themeToggle.addEventListener("click", toggleTheme);


});    
