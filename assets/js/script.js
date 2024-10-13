const header = document.querySelector('.header');
const main = document.querySelector('main');

main.addEventListener('mouseover', () => {
    header.classList.add('header-blur');
});


let currentProjectIndex = 0;
let currentImageIndex = 0;
let projects = [];
let autoSlideInterval; 

async function loadProjects() {
    try {
        const response = await fetch('../../projects.json');
        if (!response.ok) {
            throw new Error('Error al cargar el JSON');
        }
        projects = await response.json();
        if (projects.length > 0) {
            renderProjects(); 
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    projectsContainer.innerHTML = projects.map((project, index) => `
        <div class="project--item">
            <h3 class="project__name">${project.name}</h3>
            <img  loading="lazy" src="${project.imagePortada}" class="project__image" alt="${project.name}">
            <p class="project__description_">${project.shortDescription}</p>
            <button class="project__button" onclick="openModal(${index})">Ver Más</button>
        </div>
    `).join('');
}

function openModal(index) {
    currentProjectIndex = index;
    const project = projects[currentProjectIndex];
    document.getElementById('modalName').innerText = project.name;
    document.getElementById('modalDescription').innerText = project.description;
    document.getElementById('modalTechnologies').innerHTML = project.technologies.map(tech => `<li>${tech}</li>`).join('');
    currentImageIndex = 0; 
    loadCarouselImages(project.images);
    document.getElementById('projectModal').style.display = 'flex'; 
}


function loadCarouselImages(images) {
    const carouselImagesContainer = document.getElementById('carouselImages');
    carouselImagesContainer.innerHTML = images.map((img, index) => 
        `<img loading="lazy" src="${img}" class="carousel__image ${index === 0 ? 'active' : ''}" alt="Imagen del proyecto" style="display: ${index === 0 ? 'block' : 'none'};">`
    ).join('');
    startAutoSlide(); 
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none'; 
    stopAutoSlide();
}

function changeImage(direction) {
    const carouselImages = document.querySelectorAll('.carousel__image');
    carouselImages[currentImageIndex].style.display = 'none';
    currentImageIndex = (currentImageIndex + direction + carouselImages.length) % carouselImages.length;
    carouselImages[currentImageIndex].style.display = 'block'; 
}

function startAutoSlide() {
    clearInterval(autoSlideInterval); 
    autoSlideInterval = setInterval(() => {
        changeImage(1);
    }, 3000); 
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeModal(); 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});