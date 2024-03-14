let events = [];

const eventForm = document.getElementById('eventForm');
const eventTitleInput = document.getElementById('eventTitle');
const eventStartTimeInput = document.getElementById('eventStartTime');
const eventEndTimeInput = document.getElementById('eventEndTime');
const eventList = document.getElementById('eventList');
const submit = document.getElementById('submitCalendarBtn');

const createEvent = (title, startTime, endTime) => {
    if (startTime >= endTime) {
        alert('Start time cannot be later than or equal to end time!');
        return;
    }

    const isOverlap = events.some(event => (
        (startTime >= event.startTime && startTime < event.endTime) ||
        (endTime > event.startTime && endTime <= event.endTime) ||
        (startTime <= event.startTime && endTime >= event.endTime)
    ));

    if (isOverlap) {
        alert('Time conflict with other event!');
        return;
    }
    events.push({title, startTime, endTime});
    displayEvents();
};

const displayEvents = () => {
    eventList.innerHTML = '';
    const today = new Date();

    events.sort((a, b) => a.startTime - b.startTime);

    events.forEach((event) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.title} 
                                Starts: ${event.startTime.toLocaleString()} 
                                Ends: ${event.endTime.toLocaleString()}`;
        
        if (event.endTime < today) {
            listItem.classList.add('pastEvent');
        } else if (event.startTime > today) {
            listItem.classList.add('upcomingEvent');
        } else {
            listItem.classList.add('currentEvent');
    }
        eventList.appendChild(listItem);
    });
};

eventForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = eventTitleInput.value;
    const startTime = new Date(eventStartTimeInput.value);
    const endTime = new Date(eventEndTimeInput.value);

    createEvent(title, startTime, endTime);
    eventForm.reset();
})