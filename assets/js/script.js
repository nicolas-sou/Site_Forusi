
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

async function carregarProdutos() {
    try {
        const resposta = await fetch('https://forusi-api.vercel.app/api/produtos/');
        const produtos = await resposta.json();

        const container = document.querySelector('.lancamentos .row.mb-4');
        container.innerHTML = ''; // limpa os produtos fixos

        produtos.forEach(produto => {
            const card = `
                <div class="col-md-4 mb-4" data-aos="zoom-in" data-aos-duration="1000">
                    <div class="card">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text">${produto.descricao}</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

carregarProdutos();

