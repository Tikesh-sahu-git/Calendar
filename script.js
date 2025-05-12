document.addEventListener('DOMContentLoaded', function() {
    // Current date
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // DOM elements
    const daysGrid = document.getElementById('days-grid');
    const monthYearElement = document.querySelector('.month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventModal = document.getElementById('event-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const eventForm = document.getElementById('event-form');
    
    // Events data
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    
    // Render calendar
    function renderCalendar(month, year) {
        // Update month and year display
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear previous days
        daysGrid.innerHTML = '';
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get days from previous month to display
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Get today's date for comparison
        const today = new Date();
        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
        
        // Create day elements
        let dayCount = 1;
        let nextMonthDayCount = 1;
        
        // We'll create 6 rows to ensure the calendar has consistent height
        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            
            if (i < firstDay) {
                // Days from previous month
                const prevMonthDay = daysInPrevMonth - firstDay + i + 1;
                dayElement.innerHTML = `<div class="day-number">${prevMonthDay}</div>`;
                dayElement.classList.add('other-month');
            } else if (dayCount <= daysInMonth) {
                // Days in current month
                dayElement.innerHTML = `<div class="day-number">${dayCount}</div>`;
                
                // Check if this is today
                if (isCurrentMonth && dayCount === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                // Add date attribute for event handling
                dayElement.setAttribute('data-date', `${year}-${month + 1}-${dayCount}`);
                
                // Add events for this day
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                const dayEvents = events.filter(event => event.date === dateStr);
                
                if (dayEvents.length > 0) {
                    // Add event indicator
                    const eventIndicator = document.createElement('div');
                    eventIndicator.className = 'event-indicator';
                    dayElement.appendChild(eventIndicator);
                    
                    // Display first event (others show on hover in a real app)
                    if (dayEvents[0] && window.innerWidth > 480) {
                        const eventElement = document.createElement('div');
                        eventElement.className = 'event';
                        eventElement.textContent = dayEvents[0].title;
                        eventElement.style.backgroundColor = `${dayEvents[0].color}20`;
                        eventElement.style.color = dayEvents[0].color;
                        eventElement.style.borderLeft = `3px solid ${dayEvents[0].color}`;
                        dayElement.appendChild(eventElement);
                    }
                }
                
                dayCount++;
            } else {
                // Days from next month
                dayElement.innerHTML = `<div class="day-number">${nextMonthDayCount}</div>`;
                dayElement.classList.add('other-month');
                nextMonthDayCount++;
            }
            
            daysGrid.appendChild(dayElement);
        }
    }
    
    // Change month
    function changeMonth(step) {
        currentMonth += step;
        
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        renderCalendar(currentMonth, currentYear);
    }
    
    // Event modal
    function toggleModal() {
        eventModal.classList.toggle('active');
        if (eventModal.classList.contains('active')) {
            // Set today's date as default when opening modal
            const todayStr = new Date().toISOString().split('T')[0];
            document.getElementById('event-date').value = todayStr;
            document.getElementById('event-title').focus();
        }
    }
    
    // Add new event
    function addEvent(event) {
        events.push(event);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar(currentMonth, currentYear);
    }
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    addEventBtn.addEventListener('click', toggleModal);
    closeModalBtn.addEventListener('click', toggleModal);
    
    // Touch events for better mobile interaction
    prevMonthBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeMonth(-1);
    }, { passive: false });
    
    nextMonthBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeMonth(1);
    }, { passive: false });
    
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const color = document.getElementById('event-color').value;
        const description = document.getElementById('event-description').value;
        
        const newEvent = {
            title,
            date,
            color,
            description
        };
        
        addEvent(newEvent);
        toggleModal();
        eventForm.reset();
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeMonth(-1);
        } else if (e.key === 'ArrowRight') {
            changeMonth(1);
        } else if (e.key === 'Escape' && eventModal.classList.contains('active')) {
            toggleModal();
        }
    });
    
    // Initialize calendar
    renderCalendar(currentMonth, currentYear);
    
    // Add animation to calendar days on load
    setTimeout(() => {
        const days = document.querySelectorAll('.day');
        days.forEach((day, index) => {
            day.style.animationDelay = `${index * 0.03}s`;
        });
    }, 300);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            renderCalendar(currentMonth, currentYear);
        }, 250);
    });
});