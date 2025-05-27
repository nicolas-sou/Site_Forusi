let todosProdutos = [];
let resultadoBusca = [];
let paginaProdutos = 0;
const porPaginaProdutos = 6;
let categoriaSelecionada = null;

async function carregarProdutos() {
    const res = await fetch("https://forusi-api.vercel.app/api/produtos");
    todosProdutos = await res.json();
    resultadoBusca = todosProdutos;
}

function mostrarProdutos(lista, append = false) {
    const container = document.getElementById('produtos-lista');
    if (!container) return;
    if (!append) container.innerHTML = '';

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

function mostrarMaisProdutosFiltrados(listaFiltrada) {
    const inicio = paginaProdutos * porPaginaProdutos;
    const fim = inicio + porPaginaProdutos;
    const produtosPagina = listaFiltrada.slice(inicio, fim);
    mostrarProdutos(produtosPagina, true);
    paginaProdutos++;

    const btn = document.getElementById('btn-ver-mais');
    if (btn && paginaProdutos * porPaginaProdutos >= listaFiltrada.length) {
        btn.style.display = 'none';
    } else if (btn) {
        btn.style.display = 'block';
    }
}

function filtrarPorCategoria(categoria) {
    categoriaSelecionada = categoria;
    const input = document.getElementById("input-pesquisa");
    if (input) input.value = "";

    resultadoBusca = todosProdutos.filter(p => p.categoria === categoria);
    paginaProdutos = 0;
    document.getElementById('produtos-lista').innerHTML = '';
    mostrarMaisProdutosFiltrados(resultadoBusca);
    atualizarBanner(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filtrarPorPesquisa(termo) {
    const base = categoriaSelecionada
        ? todosProdutos.filter(p => p.categoria === categoriaSelecionada)
        : todosProdutos;

    resultadoBusca = base.filter(produto =>
        produto.nome.toLowerCase().includes(termo.toLowerCase()) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(termo.toLowerCase()))
    );

    paginaProdutos = 0;
    document.getElementById('produtos-lista').innerHTML = '';
    mostrarMaisProdutosFiltrados(resultadoBusca);
}

const bannersPorCategoria = {
    "Metais Sanitários": {
        desktop: "/assets/imagens/banner/Banner_metais.svg",
        mobile: "/assets/imagens/mobile/metais.svg"
    },
    "Chuveiros e Torneiras Elétricas": {
        desktop: "/assets/imagens/banner/Banner_duchas.svg",
        mobile: "/assets/imagens/mobile/2.svg"
    },
    "Pistolas para Pintura": {
        desktop: "/assets/imagens/banner/Banner_pistolas.svg",
        mobile: "/assets/imagens/mobile/pistolas.svg"
    },
    "Materiais Elétricos": {
        desktop: "/assets/imagens/banner/Banner_plugues.svg",
        mobile: "/assets/imagens/mobile/plugues.svg"
    },
    "Forros de PVC": {
        desktop: "/assets/imagens/banner/Banner_forros.svg",
        mobile: "/assets/imagens/mobile/forros.svg"
    },
    "Plugues e Conectores": {
        desktop: "/assets/imagens/banner/Banner_fios.svg",
        mobile: "/assets/imagens/mobile/plugues.svg"
    }
};

function atualizarBanner(categoria) {
    const bannerImg = document.getElementById("banner-segmento-img");
    const bannerData = bannersPorCategoria[categoria];
    if (bannerImg && bannerData) {
        const isMobile = window.innerWidth <= 768;
        bannerImg.src = isMobile ? bannerData.mobile : bannerData.desktop;
    }
}

function atualizarImagensCarousel() {
    const isMobile = window.innerWidth <= 768;
    const imagens = document.querySelectorAll("#carousel-exemplo .carousel-item img");

    imagens.forEach((img, index) => {
        const versao = isMobile ? "mobile/" : "";
        img.src = `/assets/imagens/${versao}${index + 1}.svg`;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    atualizarImagensCarousel();
    window.addEventListener("resize", atualizarImagensCarousel);

    const questions = document.querySelectorAll('[data-faq-question]');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq__item');
            const answer = item.querySelector('.faq__answer');
            const isOpen = item.classList.contains('faq__item--is-open');

            document.querySelectorAll('.faq__item').forEach(el => {
                const elAnswer = el.querySelector('.faq__answer');
                el.classList.remove('faq__item--is-open');
                elAnswer.style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('faq__item--is-open');
                requestAnimationFrame(() => {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                });
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    await carregarProdutos();

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');

    if (categoriaParam) {
        filtrarPorCategoria(categoriaParam);
    } else {
        paginaProdutos = 0;
        resultadoBusca = todosProdutos;
        mostrarMaisProdutosFiltrados(resultadoBusca);
    }

    // Produtos por categoria
    document.querySelectorAll('.filtro-categoria').forEach(link => {
        link.addEventListener('click', async e => {
            e.preventDefault();
            const categoria = e.target.dataset.categoria;
            filtrarPorCategoria(categoria);
        });
    });

    // Produtos da página de produtos
    const btnMais = document.getElementById("btn-ver-mais");
    if (btnMais && document.getElementById('produtos-lista')) {
        btnMais.addEventListener("click", () => {
            mostrarMaisProdutosFiltrados(resultadoBusca);
        });
    }

    // Pesquisa
    const inputPesquisa = document.getElementById("input-pesquisa");
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", (e) => {
            const termo = e.target.value;
            filtrarPorPesquisa(termo);
        });
    }

    // Produtos na página inicial (lancamentos)
    const containerLancamentos = document.querySelector('.lancamentos .row.mb-4');
    const botaoLancamentos = document.getElementById('btn-ver-mais');

    if (containerLancamentos && !document.getElementById('produtos-lista')) {
        let pagina = 0;
        const porPagina = 6;
        const produtosHome = todosProdutos;

        function mostrarMaisProdutosHome() {
            const inicio = pagina * porPagina;
            const fim = inicio + porPagina;
            const produtosPagina = produtosHome.slice(inicio, fim);

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
                containerLancamentos.appendChild(card);
            });

            AOS.refresh();
            pagina++;

            if (pagina === 2) {
                botaoLancamentos.innerText = "Ver mais+";
            } else if (pagina > 2) {
                window.location.href = "/pages/Produtos.html?categoria=Metais%20Sanit%C3%A1rios";
            }
        }

        mostrarMaisProdutosHome();

        if (botaoLancamentos) {
            botaoLancamentos.addEventListener("click", mostrarMaisProdutosHome);
        }
    }

    window.addEventListener("resize", () => {
        if (categoriaSelecionada) atualizarBanner(categoriaSelecionada);
    });
});
