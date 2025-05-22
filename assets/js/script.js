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
    const botao = document.getElementById('btn-ver-mais');
    let pagina = 0;
    const porPagina = 6;
    let produtos = [];

    if (container && botao) {
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

            if (pagina === 2) {
                botao.innerText = "Ver mais+";
                botao.className = "btn btn-outline-primary"; // mantém estilo original
            } else if (pagina > 2) {
                window.location.href = "/pages/Produtos.html?categoria=Metais%20Sanit%C3%A1rios";
            }
        }

        botao.addEventListener('click', mostrarMaisProdutos);
    }
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
let paginaProdutos = 0;
const porPaginaProdutos = 6;
let categoriaSelecionada = null;

async function carregarProdutos() {
    const res = await fetch("https://forusi-api.vercel.app/api/produtos");
    todosProdutos = await res.json();
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

function mostrarMaisProdutosPorCategoria(lista) {
    const inicio = paginaProdutos * porPaginaProdutos;
    const fim = inicio + porPaginaProdutos;
    const produtosPagina = lista.slice(inicio, fim);
    mostrarProdutos(produtosPagina, true);
    paginaProdutos++;
    if (paginaProdutos * porPaginaProdutos >= lista.length) {
        document.getElementById('btn-ver-mais').style.display = 'none';
    }
}

function filtrarPorCategoria(categoria) {
    categoriaSelecionada = categoria;
    const filtrados = todosProdutos.filter(p => p.categoria === categoria);
    paginaProdutos = 0;
    document.getElementById('btn-ver-mais').style.display = 'block';
    document.getElementById('produtos-lista').innerHTML = '';
    mostrarMaisProdutosPorCategoria(filtrados);
    atualizarBanner(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        desktop: "/assets/imagens/banner/Banner_forros_pvc.svg",
        mobile: "/assets/imagens/mobile/forros.svg"
    },
    "Plugues e Conectores": {
        desktop: "/assets/imagens/banner/Banner_plugues.jpg",
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');

    carregarProdutos().then(() => {
        if (categoriaParam) {
            filtrarPorCategoria(categoriaParam);
        }
    });

    document.querySelectorAll('.filtro-categoria').forEach(link => {
        link.addEventListener('click', async e => {
            e.preventDefault();
            const categoria = e.target.dataset.categoria;
            if (todosProdutos.length === 0) {
                await carregarProdutos();
            }
            filtrarPorCategoria(categoria);
        });
    });

    const btnMais = document.getElementById("btn-ver-mais");
    if (btnMais) {
        btnMais.addEventListener("click", () => {
            if (categoriaSelecionada) {
                const filtrados = todosProdutos.filter(p => p.categoria === categoriaSelecionada);
                mostrarMaisProdutosPorCategoria(filtrados);
            } else {
                const inicio = paginaProdutos * porPaginaProdutos;
                const fim = inicio + porPaginaProdutos;
                const proximaPagina = todosProdutos.slice(inicio, fim);
                mostrarProdutos(proximaPagina, true);
                paginaProdutos++;
                if (paginaProdutos * porPaginaProdutos >= todosProdutos.length) {
                    btnMais.style.display = 'none';
                }
            }
        });
    }
    window.addEventListener("resize", () => {
        if (categoriaSelecionada) {
            atualizarBanner(categoriaSelecionada);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('[data-faq-question]');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq__item');
            const answer = item.querySelector('.faq__answer');
            const isOpen = item.classList.contains('faq__item--is-open');

            // Fecha todos os outros
            document.querySelectorAll('.faq__item').forEach(el => {
                const elAnswer = el.querySelector('.faq__answer');
                el.classList.remove('faq__item--is-open');
                elAnswer.style.maxHeight = null;
            });

            // Abre o clicado se ainda não estava
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
});

