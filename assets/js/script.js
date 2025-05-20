// Atualiza imagens do carousel com base no tamanho da tela
function atualizarImagensCarousel() {
    const isMobile = window.innerWidth <= 768;
    const imagens = document.querySelectorAll("#carousel-exemplo .carousel-item img");

    imagens.forEach((img, index) => {
        const versao = isMobile ? "mobile/" : "";
        img.src = `/assets/imagens/${versao}${index + 1}.svg`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarImagensCarousel();
    window.addEventListener("resize", atualizarImagensCarousel);
});

// Página inicial: exibição de produtos com botão "ver mais"
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.lancamentos .row.mb-4');
    if (!container) return;
    const botao = document.getElementById('btn-ver-mais');
    if (botao) {
        botao.addEventListener('click', mostrarMaisProdutos);
    }

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
                <a href="/pages/Descricao.html?id=${produto.id}" class="text-decoration-none text-dark">
                    <div class="card h-100">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
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

// Página descricao.html: detalhes do produto
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
    fetch('https://forusi-api.vercel.app/api/produtos')
        .then(res => res.json())
        .then(produtos => {
            const produto = produtos.find(p => p.id == id);
            const container = document.getElementById("detalhes-produto");

            if (!produto) {
                container.innerHTML = "<p class='text-danger'>Produto não encontrado.</p>";
                return;
            }

            container.innerHTML = `
                <div class="col-md-6">
                    <div class='card-produto'>
                        <img src="${produto.imagem}" class="img-fluid" alt="${produto.nome}">
                    </div>
                </div>
                <div class="col-md-6 mt-4">
                    <h2>${produto.nome}</h2>
                    <p><strong>Código:</strong> ${produto.id}</p>
                    <p>${produto.descricao || "Sem descrição disponível."}</p>
                </div>
            `;
        })
        .catch(error => {
            const container = document.getElementById("detalhes-produto");
            container.innerHTML = "<p class='text-danger'>Erro ao carregar o produto.</p>";
            console.error(error);
        });
}

// Página produtos.html: carregar e filtrar por categoria dinamicamente
let todosProdutos = [];

async function carregarProdutos() {
    const res = await fetch("https://forusi-api.vercel.app/api/produtos");
    todosProdutos = await res.json();
}

function mostrarProdutos(lista) {
    const container = document.getElementById('produtos-lista');
    if (!container) return;
    container.innerHTML = '';

    lista.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 text-center">
                <a href="/pages/Descricao.html?id=${produto.id}" class="text-decoration-none text-dark">
                    <img src="${produto.imagem}" class="card-img-top p-3" alt="${produto.nome}">
                    <div class="card-body">
                        <h6 class="card-title">${produto.nome}</h6>
                    </div>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarPorCategoria(categoria) {
    const filtrados = todosProdutos.filter(p => p.categoria === categoria);
    mostrarProdutos(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');

    carregarProdutos().then(() => {
        if (categoriaParam) {
            filtrarPorCategoria(categoriaParam);
        }
    });

    document.querySelectorAll('.filtro-categoria').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const categoria = e.target.dataset.categoria;
            filtrarPorCategoria(categoria);
        });
    });
});
