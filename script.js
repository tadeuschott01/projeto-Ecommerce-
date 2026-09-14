/* =========================================================
   MINHA CONFECÇÃO — SCRIPT.JS
   Carrinho + Busca + Newsletter
========================================================= */

let carrinho = [];


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


/* =========================================================
   CONVERTER PREÇO PARA NÚMERO
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
   SALVAR CARRINHO
========================================================= */

function salvarCarrinho() {

    localStorage.setItem(
        "minhaConfeccaoCarrinho",
        JSON.stringify(carrinho)
    );

}


/* =========================================================
   CARREGAR CARRINHO
========================================================= */

function carregarCarrinho() {

    try {

        const dadosSalvos =
            localStorage.getItem(
                "minhaConfeccaoCarrinho"
            );

        if (!dadosSalvos) {
            carrinho = [];
            return;
        }

        const dados =
            JSON.parse(dadosSalvos);

        if (Array.isArray(dados)) {

            carrinho = dados;

        } else {

            carrinho = [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );

        carrinho = [];

    }

}


/* =========================================================
   ADICIONAR PRODUTO AO CARRINHO
========================================================= */

document.addEventListener(
    "click",
    function (evento) {

        const botao =
            evento.target.closest(".comprar");

        if (!botao) {
            return;
        }

        const produto =
            botao.closest(".produto");

        if (!produto) {
            return;
        }

        const nomeElemento =
            produto.querySelector("h3");

        const precoElemento =
            produto.querySelector(".preco");

        const imagemElemento =
            produto.querySelector("img");

        if (
            !nomeElemento ||
            !precoElemento
        ) {
            return;
        }

        const id =
            produto.dataset.id ||
            nomeElemento.textContent.trim();

        const nome =
            nomeElemento.textContent.trim();

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

                    return item.id === id;

                }
            );

        if (produtoExistente) {

            produtoExistente.quantidade++;

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
   ATUALIZAR CARRINHO
========================================================= */

function atualizarCarrinho() {

    let quantidadeTotal = 0;

    let valorTotal = 0;

    carrinho.forEach(
        function (produto) {

            quantidadeTotal +=
                produto.quantidade;

            valorTotal +=
                produto.preco *
                produto.quantidade;

        }
    );


    /* CONTADOR */

    if (linkCarrinho) {

        if (quantidadeTotal === 0) {

            linkCarrinho.innerHTML =
                "🛒 Carrinho";

        } else {

            linkCarrinho.innerHTML =
                "🛒 Carrinho (" +
                quantidadeTotal +
                ")";

        }

    }


    /* LISTA */

    if (!listaCarrinho) {
        return;
    }


    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `

            <p>
                Seu carrinho está vazio.
            </p>

        `;

    } else {

        listaCarrinho.innerHTML = "";


        carrinho.forEach(
            function (produto, index) {

                const item =
                    document.createElement("div");

                item.className =
                    "item-carrinho";


                item.innerHTML = `

                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                    >

                    <div class="info-carrinho">

                        <h3>
                            ${produto.nome}
                        </h3>

                        <p>
                            R$
                            ${produto.preco
                                .toFixed(2)
                                .replace(".", ",")}
                        </p>

                        <div class="quantidade">

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

                listaCarrinho.appendChild(
                    item
                );

            }
        );

    }


    /* TOTAL */

    if (totalCarrinho) {

        totalCarrinho.textContent =

            "R$ " +

            valorTotal
                .toFixed(2)
                .replace(".", ",");

    }

}


/* =========================================================
   AUMENTAR QUANTIDADE
========================================================= */

function aumentarQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }

    carrinho[index].quantidade++;

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

    carrinho[index].quantidade--;

    if (
        carrinho[index].quantidade <= 0
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
   BOTÃO CARRINHO
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
        function () {

            fecharModalCarrinho();

        }
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
            evento.key === "Escape"
        ) {

            fecharModalCarrinho();

        }

    }
);


/* =========================================================
   BUSCA DE PRODUTOS
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

            const nomeElemento =
                produto.querySelector("h3");

            if (!nomeElemento) {
                return;
            }

            const nome =
                nomeElemento
                    .textContent
                    .trim()
                    .toLowerCase();

            if (
                termo === "" ||
                nome.includes(termo)
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
        function () {

            buscarProdutos();

        }
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
                "Agora vamos configurar o pagamento."
            );

        }
    );

}


/* =========================================================
   INICIAR
========================================================= */

carregarCarrinho();

atualizarCarrinho();
