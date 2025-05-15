
document.addEventListener("DOMContentLoaded", function () {
    function atualizarImagensCarousel() {
        const isMobile = window.innerWidth <= 768; // define o limite para mobile
        const imagens = document.querySelectorAll("#carousel-exemplo .carousel-item img");

        imagens.forEach((img, index) => {
            const versao = isMobile ? "mobile" : "";
            img.src = `/assets/imagens/${versao ? versao + "/" : ""}${index + 1}.svg`;
        });
    }

    // Atualiza ao abrir e redimensionar
    atualizarImagensCarousel();
    window.addEventListener("resize", atualizarImagensCarousel);
});

