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
   TRANSFORMAR PREÇO EM NÚMERO
========================================================= */

function converterPreco(texto) {

    return Number(
        texto
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

}


/* =========================================================
   ADICIONAR PRODUTO
========================================================= */

document.addEventListener("click", function (evento) {

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


    if (!nomeElemento || !precoElemento) {
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
        carrinho.find(function (item) {

            return item.id === id;

        });


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

});


/* =========================================================
   ATUALIZAR CARRINHO
========================================================= */

function atualizarCarrinho() {

    let quantidadeTotal = 0;

    let valorTotal = 0;


    carrinho.forEach(function (produto) {

        quantidadeTotal +=
            produto.quantidade;


        valorTotal +=
            produto.preco *
            produto.quantidade;

    });


    /* CONTADOR NO CABEÇALHO */

    if (linkCarrinho) {

        if (quantidadeTotal === 0) {

            linkCarrinho.textContent =
                "🛒 Carrinho";

        } else {

            linkCarrinho.textContent =
                "🛒 Carrinho (" +
                quantidadeTotal +
                ")";

        }

    }


    /* CARRINHO VAZIO */

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
                                aria-label="Diminuir quantidade"
                            >
                                −
                            </button>


                            <span>
                                ${produto.quantidade}
                            </span>


                            <button
                                type="button"
                                onclick="aumentarQuantidade(${index})"
                                aria-label="Aumentar quantidade"
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


    modalCarrinho.setAttribute(
        "aria-hidden",
        "true"
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
   SALVAR CARRINHO NO NAVEGADOR
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

        const carrinhoSalvo =
            localStorage.getItem(
                "minhaConfeccaoCarrinho"
            );


        if (!carrinhoSalvo) {
            return;
        }


        const dados =
            JSON.parse(carrinhoSalvo);


        if (Array.isArray(dados)) {

            carrinho = dados;

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
   BUSCA
========================================================= */

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
   BUSCAR PRODUTOS
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
   INICIAR APP
========================================================= */

carregarCarrinho();

atualizarCarrinho();
