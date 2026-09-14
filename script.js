/* =========================================================
   MINHA CONFECÇÃO — SCRIPT.JS
   SUPABASE + PRODUTOS + CARRINHO + BUSCA
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://ujutkgdylwwatbjsnvzw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_5xv4o64FABCRaffX77QEqA_8VHBTX83";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   ESTADO
========================================================= */

let carrinho = [];

let produtosLoja = [];


/* =========================================================
   ELEMENTOS
========================================================= */

const linkCarrinho =
    document.getElementById("link-carrinho");

const modalCarrinho =
    document.getElementById("carrinho-modal");

const fecharCarrinho =
    document.getElementById("fechar-carrinho");

const listaCarrinho =
    document.getElementById("lista-carrinho");

const totalCarrinho =
    document.getElementById("carrinho-total");

const finalizarCompra =
    document.getElementById("finalizar-compra");

const formBusca =
    document.getElementById("form-busca");

const campoBusca =
    document.getElementById("campo-busca");

const formNewsletter =
    document.getElementById("form-newsletter");

const areaNovidades =
    document.querySelector(
        "#novidades .produtos"
    );

const areaOfertas =
    document.querySelector(
        "#ofertas .produtos"
    );


/* =========================================================
   FORMATAR PREÇO
========================================================= */

function formatarPreco(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* =========================================================
   CONVERTER PREÇO DO HTML
========================================================= */

function converterPreco(texto) {

    if (!texto) {
        return 0;
    }


    const valor = texto

        .replace("R$", "")

        .replace(/\./g, "")

        .replace(",", ".")

        .trim();


    return Number(valor) || 0;

}


/* =========================================================
   PROTEGER TEXTO
========================================================= */

function escaparHTML(texto) {

    return String(texto || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   CARREGAR PRODUTOS DO SUPABASE
========================================================= */

async function carregarProdutosSupabase() {

    if (areaNovidades) {

        areaNovidades.innerHTML = `

            <p style="
                grid-column:1/-1;
                text-align:center;
                padding:30px;
            ">
                Carregando produtos...
            </p>

        `;

    }


    if (areaOfertas) {

        areaOfertas.innerHTML = "";

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("products")

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );


        if (areaNovidades) {

            areaNovidades.innerHTML = `

                <p style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:30px;
                ">
                    Não foi possível carregar os produtos.
                </p>

            `;

        }


        return;

    }


    produtosLoja =
        data || [];


    renderizarProdutosLoja();

}


/* =========================================================
   RENDERIZAR PRODUTOS
========================================================= */

function renderizarProdutosLoja() {

    if (
        !areaNovidades ||
        !areaOfertas
    ) {

        return;

    }


    areaNovidades.innerHTML =
        "";

    areaOfertas.innerHTML =
        "";


    const produtosDisponiveis =
        produtosLoja.filter(
            function (produto) {

                return (
                    Number(
                        produto.stock || 0
                    ) > 0
                );

            }
        );


    produtosDisponiveis.forEach(
        function (produto) {

            const card =
                criarCardProduto(
                    produto
                );


            if (
                produto.is_offer
            ) {

                areaOfertas.appendChild(
                    card
                );

            } else {

                areaNovidades.appendChild(
                    card
                );

            }

        }
    );


    if (
        areaNovidades.children.length === 0
    ) {

        areaNovidades.innerHTML = `

            <p style="
                grid-column:1/-1;
                text-align:center;
                padding:30px;
            ">
                Nenhum produto novo disponível.
            </p>

        `;

    }


    if (
        areaOfertas.children.length === 0
    ) {

        areaOfertas.innerHTML = `

            <p style="
                grid-column:1/-1;
                text-align:center;
                padding:30px;
            ">
                Nenhuma oferta disponível no momento.
            </p>

        `;

    }

}


/* =========================================================
   CRIAR CARD
========================================================= */

function criarCardProduto(produto) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "produto";


    card.dataset.id =
        produto.id;


    const imagem =
        produto.image_url ||

        "https://placehold.co/600x800?text=Sem+Foto";


    let precoHTML = `

        <p class="preco">

            ${formatarPreco(
                produto.price
            )}

        </p>

    `;


    if (
        produto.promotional_price
    ) {

        precoHTML = `

            <p class="preco-antigo">

                ${formatarPreco(
                    produto.price
                )}

            </p>


            <p class="preco">

                ${formatarPreco(
                    produto.promotional_price
                )}

            </p>

        `;

    }


    card.innerHTML = `

        <img
            src="${imagem}"
            alt="${escaparHTML(
                produto.name
            )}"
            loading="lazy"
        >


        <div class="produto-info">

            <h3>

                ${escaparHTML(
                    produto.name
                )}

            </h3>


            ${precoHTML}


            <button
                class="comprar"
                type="button"
            >
                Adicionar ao carrinho
            </button>

        </div>

    `;


    const imagemElemento =
        card.querySelector("img");


    if (imagemElemento) {

        imagemElemento.addEventListener(
            "error",
            function () {

                this.src =
                    "https://placehold.co/600x800?text=Sem+Foto";

            }
        );

    }


    return card;

}


/* =========================================================
   ADICIONAR AO CARRINHO
   Funciona também nos produtos criados pelo Supabase
========================================================= */

document.addEventListener(
    "click",
    function (evento) {

        const botao =
            evento.target.closest(
                ".comprar"
            );


        if (!botao) {
            return;
        }


        const produto =
            botao.closest(
                ".produto"
            );


        if (!produto) {
            return;
        }


        const nomeElemento =
            produto.querySelector(
                "h3"
            );

        const precoElemento =
            produto.querySelector(
                ".preco"
            );

        const imagemElemento =
            produto.querySelector(
                "img"
            );


        if (
            !nomeElemento ||
            !precoElemento
        ) {

            return;

        }


        const id =
            String(
                produto.dataset.id ||
                nomeElemento.textContent.trim()
            );


        const nome =
            nomeElemento
                .textContent
                .trim();


        const preco =
            converterPreco(
                precoElemento.textContent
            );


        const imagem =
            imagemElemento
                ? imagemElemento.src
                : "";


        const produtoExistente =
            carrinho.find(
                function (item) {

                    return (
                        String(item.id) ===
                        id
                    );

                }
            );


        if (produtoExistente) {

            produtoExistente
                .quantidade++;

        } else {

            carrinho.push({

                id: id,

                nome: nome,

                preco: preco,

                imagem: imagem,

                quantidade: 1

            });

        }


        salvarCarrinho();

        atualizarCarrinho();

        abrirCarrinho();

    }
);


/* =========================================================
   SALVAR CARRINHO
========================================================= */

function salvarCarrinho() {

    try {

        localStorage.setItem(
            "minhaConfeccaoCarrinho",
            JSON.stringify(
                carrinho
            )
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar carrinho:",
            erro
        );

    }

}


/* =========================================================
   CARREGAR CARRINHO
========================================================= */

function carregarCarrinho() {

    try {

        const dados =
            localStorage.getItem(
                "minhaConfeccaoCarrinho"
            );


        if (!dados) {

            carrinho = [];

            return;

        }


        const lista =
            JSON.parse(
                dados
            );


        if (Array.isArray(lista)) {

            carrinho =
                lista;

        } else {

            carrinho =
                [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );


        carrinho =
            [];

    }

}


/* =========================================================
   ATUALIZAR CARRINHO
========================================================= */

function atualizarCarrinho() {

    let quantidadeTotal =
        0;

    let valorTotal =
        0;


    carrinho.forEach(
        function (produto) {

            quantidadeTotal +=
                Number(
                    produto.quantidade || 0
                );


            valorTotal +=

                Number(
                    produto.preco || 0
                )

                *

                Number(
                    produto.quantidade || 0
                );

        }
    );


    /* CONTADOR */

    if (linkCarrinho) {

        if (
            quantidadeTotal === 0
        ) {

            linkCarrinho.textContent =
                "🛒 Carrinho";

        } else {

            linkCarrinho.textContent =

                "🛒 Carrinho (" +

                quantidadeTotal +

                ")";

        }

    }


    if (!listaCarrinho) {
        return;
    }


    /* CARRINHO VAZIO */

    if (
        carrinho.length === 0
    ) {

        listaCarrinho.innerHTML = `

            <p>
                Seu carrinho está vazio.
            </p>

        `;

    } else {

        listaCarrinho.innerHTML =
            "";


        carrinho.forEach(
            function (
                produto,
                index
            ) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-carrinho";


                item.innerHTML = `

                    <img
                        src="${produto.imagem}"
                        alt="${escaparHTML(
                            produto.nome
                        )}"
                    >


                    <div
                        class="info-carrinho"
                    >

                        <h3>

                            ${escaparHTML(
                                produto.nome
                            )}

                        </h3>


                        <p>

                            ${formatarPreco(
                                produto.preco
                            )}

                        </p>


                        <div
                            class="quantidade"
                        >

                            <button
                                type="button"
                                onclick="diminuirQuantidade(${index})"
                            >
                                −
                            </button>


                            <span>

                                ${produto.quantidade}

                            </span>


                            <button
                                type="button"
                                onclick="aumentarQuantidade(${index})"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="remover-produto"
                            onclick="removerProduto(${index})"
                        >
                            Remover
                        </button>

                    </div>

                `;


                listaCarrinho
                    .appendChild(
                        item
                    );

            }
        );

    }


    /* TOTAL */

    if (totalCarrinho) {

        totalCarrinho.textContent =
            formatarPreco(
                valorTotal
            );

    }

}


/* =========================================================
   AUMENTAR QUANTIDADE
========================================================= */

function aumentarQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index]
        .quantidade++;


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   DIMINUIR QUANTIDADE
========================================================= */

function diminuirQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index]
        .quantidade--;


    if (
        carrinho[index]
            .quantidade <= 0
    ) {

        carrinho.splice(
            index,
            1
        );

    }


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   REMOVER PRODUTO
========================================================= */

function removerProduto(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho.splice(
        index,
        1
    );


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   ABRIR CARRINHO
========================================================= */

function abrirCarrinho() {

    if (!modalCarrinho) {
        return;
    }


    modalCarrinho.style.display =
        "flex";


    modalCarrinho.classList.add(
        "ativo"
    );


    modalCarrinho.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================================
   FECHAR CARRINHO
========================================================= */

function fecharModalCarrinho() {

    if (!modalCarrinho) {
        return;
    }


    modalCarrinho.style.display =
        "none";


    modalCarrinho.classList.remove(
        "ativo"
    );


    modalCarrinho.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   BOTÃO DO CARRINHO
========================================================= */

if (linkCarrinho) {

    linkCarrinho.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            abrirCarrinho();

        }
    );

}


/* =========================================================
   BOTÃO FECHAR
========================================================= */

if (fecharCarrinho) {

    fecharCarrinho.addEventListener(
        "click",
        fecharModalCarrinho
    );

}


/* =========================================================
   FECHAR CLICANDO FORA
========================================================= */

if (modalCarrinho) {

    modalCarrinho.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modalCarrinho
            ) {

                fecharModalCarrinho();

            }

        }
    );

}


/* =========================================================
   FECHAR COM ESC
========================================================= */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key ===
            "Escape"
        ) {

            fecharModalCarrinho();

        }

    }
);


/* =========================================================
   BUSCA
========================================================= */

function buscarProdutos() {

    if (!campoBusca) {
        return;
    }


    const termo =
        campoBusca.value
            .trim()
            .toLowerCase();


    const produtos =
        document.querySelectorAll(
            ".produto"
        );


    produtos.forEach(
        function (produto) {

            const nome =
                produto.querySelector(
                    "h3"
                );


            if (!nome) {
                return;
            }


            const texto =
                nome.textContent
                    .trim()
                    .toLowerCase();


            if (
                termo === "" ||
                texto.includes(
                    termo
                )
            ) {

                produto.style.display =
                    "";

            } else {

                produto.style.display =
                    "none";

            }

        }
    );

}


if (
    formBusca &&
    campoBusca
) {

    formBusca.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            buscarProdutos();

        }
    );


    campoBusca.addEventListener(
        "input",
        buscarProdutos
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

if (formNewsletter) {

    formNewsletter.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            alert(
                "Cadastro realizado com sucesso!"
            );


            formNewsletter.reset();

        }
    );

}


/* =========================================================
   FINALIZAR COMPRA
========================================================= */

if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        function () {

            if (
                carrinho.length === 0
            ) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            alert(
                "Seu pedido está pronto! " +
                "Na próxima etapa vamos conectar Pix e cartão."
            );

        }
    );

}


/* =========================================================
   INICIAR
========================================================= */

carregarCarrinho();

atualizarCarrinho();

carregarProdutosSupabase();
