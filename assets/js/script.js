const header = document.querySelector('.header');
const main = document.querySelector('main');

main.addEventListener('mouseover', () => {
    header.classList.add('header-blur');
});

main.addEventListener('mouseout', () => {
    header.classList.remove('header-blur');
});


function openModal() {
    document.getElementById('projectModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
}

// Cerrar el modal cuando el usuario hace clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeModal();
    }
}
let currentProjectIndex = 0;
let currentImageIndex = 0;
let projects = [];

// Función asíncrona para cargar los proyectos desde el archivo JSON
async function loadProjects() {
    try {
        const response = await fetch('../../projects.json');
        if (!response.ok) {
            throw new Error('Error al cargar el JSON');
        }
        projects = await response.json();

        if (projects.length > 0) {
            renderProjects(); // Llamar a la función para renderizar los proyectos
        }
    } catch (error) {
        console.error('Error:', error);
    }
} 

// Función para renderizar todos los proyectos en el contenedor
function renderProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    projectsContainer.innerHTML = projects.map((project, index) => `
        <div class="project--item">
            <h3 class="project__name">${project.name}</h3>
            <img src="${project.imagePortada}" class="project__image" alt="${project.name}">
            <p class="project__description_">${project.shortDescription}</p>
            <button class="project__button" onclick="openModal(${index})">Ver Más</button>
        </div>
    `).join('');
}

// Función para cargar los detalles del proyecto seleccionado
function loadProjectDetails(index) {
    const project = projects[index];
    document.getElementById('projectName').innerText = project.name;
    document.getElementById('projectShortDescription').innerText = project.shortDescription;
}

// Función para abrir el modal con los detalles del proyecto
function openModal(index) {
    currentProjectIndex = index;
    const project = projects[currentProjectIndex];

    document.getElementById('modalName').innerText = project.name;
    document.getElementById('modalDescription').innerText = project.description;
    document.getElementById('modalTechnologies').innerHTML = project.technologies.map(tech => `<li>${tech}</li>`).join('');

    currentImageIndex = 0; // Reiniciar el índice de imagen
    loadCarouselImages(project.images); // Cargar las imágenes del carrusel

    document.getElementById('projectModal').style.display = 'flex'; // Mostrar el modal
}

// Función para cargar las imágenes en el carrusel
function loadCarouselImages(images) {
    const carouselImagesContainer = document.getElementById('carouselImages');
    carouselImagesContainer.innerHTML = images.map((img, index) => 
        `<img src="${img}" class="carousel__image ${index === 0 ? 'active' : ''}" alt="Imagen del proyecto" style="display: ${index === 0 ? 'block' : 'none'};">`
    ).join('');
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('projectModal').style.display = 'none'; // Ocultar el modal
}

// Función para cambiar la imagen en el carrusel
function changeImage(direction) {
    const carouselImages = document.querySelectorAll('.carousel__image');
    carouselImages[currentImageIndex].style.display = 'none'; // Ocultar la imagen actual

    // Actualizar el índice de la imagen actual
    currentImageIndex = (currentImageIndex + direction + carouselImages.length) % carouselImages.length;

    carouselImages[currentImageIndex].style.display = 'block'; // Mostrar la nueva imagen
}

// Manejo de clics para cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeModal(); // Cerrar el modal
    }
}

// Cargar proyectos al iniciar la página
window.onload = loadProjects; 