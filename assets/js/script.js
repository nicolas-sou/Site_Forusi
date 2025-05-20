
document.addEventListener("DOMContentLoaded", function () {
    function atualizarImagensCarousel() {
        const isMobile = window.innerWidth <= 768;
        const imagens = document.querySelectorAll("#carousel-exemplo .carousel-item img");

        imagens.forEach((img, index) => {
            const versao = isMobile ? "mobile" : "";
            img.src = `/assets/imagens/${versao ? versao + "/" : ""}${index + 1}.svg`;
        });
    }

    atualizarImagensCarousel();
    window.addEventListener("resize", atualizarImagensCarousel);
});

// NOVO BLOCO: exibição de produtos com botão "ver mais"
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.lancamentos .row.mb-4'); // mesmo container atual
    const botao = document.getElementById('btn-ver-mais');

    let pagina = 0;
    const porPagina = 6;
    let produtos = [];

    fetch('https://forusi-api.vercel.app/api/produtos')
        .then(res => res.json())
        .then(data => {
            produtos = data;
            mostrarMaisProdutos();
        })
        .catch(err => {
            console.error('Erro ao carregar produtos:', err);
        });

    function mostrarMaisProdutos() {
        const inicio = pagina * porPagina;
        const fim = inicio + porPagina;
        const produtosPagina = produtos.slice(inicio, fim);

        if (produtosPagina.length === 0) return;

        produtosPagina.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.setAttribute('data-aos', 'zoom-in');
            card.setAttribute('data-aos-duration', '1000');
            card.innerHTML = `
                <a href="produto.html?id=${produto.id}" class="text-decoration-none text-dark">
                    <div class="card h-100">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text">${produto.descricao || ''}</p>
                        </div>
                    </div>
                </a>
            `;
            container.appendChild(card);
        });

        AOS.refresh();
        pagina++;

        if (pagina * porPagina >= produtos.length) {
            botao.style.display = 'none';
        }
    }

    botao.addEventListener('click', mostrarMaisProdutos);
});


