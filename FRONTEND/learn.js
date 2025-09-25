document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const subjectSelect = document.getElementById('subjectSelect');
    const toStep2Btn = document.getElementById('toStep2');
    const toStep3Btn = document.getElementById('toStep3');
    const backTo1Btn = document.getElementById('backTo1');
    const backTo2Btn = document.getElementById('backTo2');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const chaptersGrid = document.getElementById('chaptersGrid');
    const activitiesGrid = document.getElementById('activitiesGrid');
    const pickedInfo = document.getElementById('pickedInfo');

    let selectedClass = '';
    let selectedSubject = '';

    // Step 1: Fetch and populate classes
    async function loadClasses() {
        const response = await fetch('http://localhost:5000/api/classes');
        const classes = await response.json();
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = `Class ${c}`;
            classSelect.appendChild(option);
        });
    }

    classSelect.addEventListener('change', async () => {
        selectedClass = classSelect.value;
        subjectSelect.disabled = true;
        toStep2Btn.disabled = true;
        if (selectedClass) {
            const response = await fetch(`http://localhost:5000/api/subjects/${selectedClass}`);
            const subjects = await response.json();
            subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
            subjects.forEach(s => {
                const option = document.createElement('option');
                option.value = s;
                option.textContent = s;
                subjectSelect.appendChild(option);
            });
            subjectSelect.disabled = false;
        }
    });

    subjectSelect.addEventListener('change', () => {
        selectedSubject = subjectSelect.value;
        toStep2Btn.disabled = !selectedSubject;
    });

    toStep2Btn.addEventListener('click', async () => {
        step1.style.display = 'none';
        step2.style.display = 'block';

        const response = await fetch(`http://localhost:5000/api/chapters/${selectedClass}/${selectedSubject}`);
        const chapters = await response.json();
        chaptersGrid.innerHTML = '';
        chapters.forEach(chapter => {
            const card = document.createElement('div');
            card.className = 'grid-card';
            card.textContent = chapter;
            card.addEventListener('click', () => {
                // Logic to select a chapter
                document.querySelectorAll('.grid-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                toStep3Btn.disabled = false;
            });
            chaptersGrid.appendChild(card);
        });
    });

    toStep3Btn.addEventListener('click', async () => {
        step2.style.display = 'none';
        step3.style.display = 'block';
        pickedInfo.textContent = `You picked Class ${selectedClass}, ${selectedSubject}, Chapter ${document.querySelector('.grid-card.selected').textContent}`;

        const response = await fetch(`http://localhost:5000/api/activities/${selectedClass}/${selectedSubject}`);
        const activities = await response.json();
        activitiesGrid.innerHTML = '';
        activities.forEach(activity => {
            const card = document.createElement('div');
            card.className = 'grid-card';
            card.textContent = activity;
            activitiesGrid.appendChild(card);
        });
    });

    backTo1Btn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
    });

    backTo2Btn.addEventListener('click', () => {
        step3.style.display = 'none';
        step2.style.display = 'block';
    });

    loadClasses();
});