document.addEventListener('DOMContentLoaded', function() {
    const scheduleData = [
        { 
            route: "51", 
            start: "gardens of a mechanical engineer", 
            end: "vsmeo", 
            time: "morning,day,night", 
            departure: "07:00,08:00,09:00,20:00,21:00", 
            arrival: "07:30,08:30,09:30,20:30,21:30", 
            interval: "Каждые 30 минут" 
        },
        { 
            route: "3K", 
            start: "sluice village", 
            end: "vsmeo", 
            time: "morning,day", 
            departure: "06:30,07:30,08:30,09:30,10:30,15:30,16:30", 
            arrival: "07:00,08:00,09:00,10:00,11:00,16:00,17:00", 
            interval: "Каждые 30-40 минут" 
        },
        { 
            route: "52", 
            start: "prospect mira", 
            end: "gardens of a mechanical engineer", 
            time: "morning,day,night", 
            departure: "06:20,06:40,07:00,07:20,07:40,08:00,12:00,12:20,12:40,20:00,20:20,20:40", 
            arrival: "06:50,07:10,07:30,07:50,08:10,08:30,12:30,12:50,13:10,20:30,20:50,21:10", 
            interval: "Каждые 20 минут" 
        },
        { 
            route: "18", 
            start: "sluice village", 
            end: "sluice village", 
            time: "morning,day", 
            departure: "07:00,08:00,09:00,10:00,14:00,15:00", 
            arrival: "07:40,08:40,09:40,10:40,14:40,15:40", 
            interval: "Каждые 40 минут" 
        },
        { 
            route: "14", 
            start: "vsmeo", 
            end: "vsmeo", 
            time: "morning,day", 
            departure: "06:00,07:00,08:00,09:00,13:00,14:00", 
            arrival: "06:30,07:30,08:30,09:30,13:30,14:30", 
            interval: "Каждые 30 минут" 
        },
        { 
            route: "28", 
            start: "sluice village", 
            end: "mayak", 
            time: "day,night", 
            departure: "12:00,12:30,13:00,13:30,20:00,20:30,21:00", 
            arrival: "12:25,12:55,13:25,13:55,20:25,20:55,21:25", 
            interval: "Каждые 25 минут" 
        },
        { 
            route: "16", 
            start: "vsmeo", 
            end: "vsmeo", 
            time: "all", 
            departure: "06:00,07:00,08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00", 
            arrival: "06:30,07:30,08:30,09:30,10:30,11:30,12:30,13:30,14:30,15:30,16:30,17:30,18:30,19:30,20:30,21:30,22:30", 
            interval: "Каждые 30 минут" 
        }
    ];

    const routeSelect = document.getElementById('routeSelect');
    const startStop = document.getElementById('startStop');
    const endStop = document.getElementById('endStop');
    const timeButtons = document.querySelectorAll('.time-btn');
    const hourButtonsContainer = document.createElement('div'); // Создаем контейнер для кнопок часов
    hourButtonsContainer.className = 'hour-buttons';
    hourButtonsContainer.id = 'hourButtons';
    document.querySelector('.time-filter').appendChild(hourButtonsContainer);
    const searchInput = document.getElementById('searchInput');
    const scheduleTable = document.getElementById('scheduleTable');
    const tbody = scheduleTable.querySelector('tbody');

    function getTimePeriod(time) {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 6 && hour < 10) return 'morning';
        if (hour >= 10 && hour < 16) return 'day';
        if (hour >= 16 && hour < 22) return 'evening';
        return 'night';
    }

    function createHourButtons() {
        hourButtonsContainer.innerHTML = '';
        
    
        const allButton = document.createElement('button');
        allButton.className = 'hour-btn active';
        allButton.textContent = 'Все часы';
        allButton.dataset.hour = 'all';
        allButton.addEventListener('click', function() {
            document.querySelectorAll('.hour-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterSchedule();
        });
        hourButtonsContainer.appendChild(allButton);
        
        for (let i = 6; i <= 23; i++) {
            const hour = i.toString().padStart(2, '0');
            const button = document.createElement('button');
            button.className = 'hour-btn';
            button.textContent = `${hour}:00`;
            button.dataset.hour = hour;
            
            button.addEventListener('click', function() {
                document.querySelectorAll('.hour-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterSchedule();
            });
            
            hourButtonsContainer.appendChild(button);
        }
    }

    function populateTable(data) {
        tbody.innerHTML = '';
        data.forEach(item => {
            const startStopName = document.querySelector(`#startStop option[value="${item.start}"]`)?.text || item.start;
            const endStopName = document.querySelector(`#endStop option[value="${item.end}"]`)?.text || item.end;
            
            const departures = item.departure.split(',').map(t => t.trim());
            const arrivals = item.arrival.split(',').map(t => t.trim());
            
        
            departures.forEach((departure, index) => {
                const arrival = arrivals[index] || '';
                const timePeriod = getTimePeriod(departure);
                const hour = departure.split(':')[0];
                
                const row = document.createElement('tr');
                row.dataset.route = item.route;
                row.dataset.start = item.start;
                row.dataset.end = item.end;
                row.dataset.time = timePeriod;
                row.dataset.hour = hour;
                
                row.innerHTML = `
                    <td>${item.route}</td>
                    <td>${startStopName}</td>
                    <td>${endStopName}</td>
                    <td>${departure}</td>
                    <td>${arrival}</td>
                    <td>${item.interval}</td>
                `;
                tbody.appendChild(row);
            });
        });
    }

    function filterSchedule() {
        const selectedRoute = routeSelect.value;
        const selectedStart = startStop.value;
        const selectedEnd = endStop.value;
        const selectedTime = document.querySelector('.time-btn.active')?.dataset.time || 'all';
        const selectedHour = document.querySelector('.hour-btn.active')?.dataset.hour || 'all';
        const searchText = searchInput.value.toLowerCase();
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const routeMatch = !selectedRoute || row.dataset.route === selectedRoute;
            const startMatch = !selectedStart || row.dataset.start === selectedStart;
            const endMatch = !selectedEnd || row.dataset.end === selectedEnd;
            const timeMatch = selectedTime === 'all' || row.dataset.time === selectedTime;
            const hourMatch = selectedHour === 'all' || row.dataset.hour === selectedHour;
            
            const rowText = row.textContent.toLowerCase();
            const searchMatch = !searchText || rowText.includes(searchText);
            
            if (routeMatch && startMatch && endMatch && timeMatch && hourMatch && searchMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    createHourButtons();
    populateTable(scheduleData);
    
    routeSelect.addEventListener('change', filterSchedule);
    startStop.addEventListener('change', filterSchedule);
    endStop.addEventListener('change', filterSchedule);
    searchInput.addEventListener('input', filterSchedule);
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterSchedule();
        });
    });

    document.querySelector('.time-btn[data-time="all"]').classList.add('active');
    filterSchedule(); 
});