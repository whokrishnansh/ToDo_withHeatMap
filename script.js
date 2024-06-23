document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const heatmap = document.getElementById('heatmap');

    // Retrieve tasks and completion data from LocalStorage
    const storedData = JSON.parse(localStorage.getItem('data')) || {};
    const today = new Date().toISOString().split('T')[0];

    // Initialize today's tasks if not already present
    if (!storedData[today]) {
        storedData[today] = { tasks: [], completedTasks: 0 };
    }

    let tasks = storedData[today].tasks;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (tasks.length < 8) { // Assuming a maximum of 5 tasks per day
            const taskText = taskInput.value;
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            storedData[today].tasks = tasks;
            localStorage.setItem('data', JSON.stringify(storedData)); // Save data to LocalStorage
            renderTasks();
        } else {
            alert('You can only add 8 tasks once in 24 hours.');
        }
    });

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                storedData[today].completedTasks = tasks.filter(task => task.completed).length;
                localStorage.setItem('data', JSON.stringify(storedData)); // Save updated data to LocalStorage
                updateHeatmap();
            });
            li.appendChild(checkbox);
            taskList.appendChild(li);
        });
    };

    const updateHeatmap = () => {
        heatmap.innerHTML = ''; // Clear previous heatmap

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
            const dayDiv = document.createElement('div');
            dayDiv.className = 'heatmap-day';

            if (storedData[date]) {
                const dayData = storedData[date];
                const completionRate = (dayData.completedTasks / dayData.tasks.length) * 100;
                let color;
                if (completionRate === 100) {
                    color = 'gold';
                } else if (completionRate >= 75) {
                    color = 'darkblue';
                } else if (completionRate >= 50) {
                    color = 'blue';
                } else if (completionRate >= 25) {
                    color = 'skyblue';
                } else {
                    color = 'lightgrey';
                }
                dayDiv.style.backgroundColor = color;
            } else {
                if (date === today) {
                    dayDiv.style.backgroundColor = 'gray';
                } else if (date > today) {
                    dayDiv.style.backgroundColor = 'white';
                } else {
                    dayDiv.style.backgroundColor = 'lightgrey';
                }
            }

            dayDiv.title = date; // Display date on hover
            heatmap.appendChild(dayDiv);
        }
    };

    renderTasks();
    updateHeatmap();
});
