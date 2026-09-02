let carrinho = [];

const botoesComprar = document.querySelectorAll(".comprar");
const linkCarrinho = document.getElementById("link-carrinho");

const modalCarrinho = document.getElementById("carrinho-modal");
const fecharCarrinho = document.getElementById("fechar-carrinho");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("carrinho-total");
const finalizarCompra = document.getElementById("finalizar-compra");


// ================================
// ADICIONAR PRODUTO
// ================================

botoesComprar.forEach((botao) => {

    botao.addEventListener("click", function () {

        const produto = this.closest(".produto");

        if (!produto) return;

        const nome = produto.querySelector("h3").textContent.trim();

        const precoTexto = produto
            .querySelector(".preco")
            .textContent
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();

        const preco = Number(precoTexto);

        const imagemElemento = produto.querySelector("img");

        const imagem = imagemElemento
            ? imagemElemento.src
            : "";

        const produtoExistente = carrinho.find(
            item => item.nome === nome
        );

        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            carrinho.push({
                nome: nome,
                preco: preco,
                imagem: imagem,
                quantidade: 1
            });

        }

        atualizarCarrinho();

        abrirCarrinho();

    });

});


// ================================
// ATUALIZAR CARRINHO
// ================================

function atualizarCarrinho() {

    let quantidadeTotal = 0;
    let valorTotal = 0;

    carrinho.forEach((produto) => {

        quantidadeTotal += produto.quantidade;

        valorTotal += produto.preco * produto.quantidade;

    });


    // Atualiza contador

    if (linkCarrinho) {

        if (quantidadeTotal === 0) {

            linkCarrinho.textContent = "🛒 Carrinho";

        } else {

            linkCarrinho.textContent =
                `🛒 Carrinho (${quantidadeTotal})`;

        }

    }


    // Atualiza lista

    if (!listaCarrinho) return;


    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `;

    } else {

        listaCarrinho.innerHTML = "";

        carrinho.forEach((produto, index) => {

            const item = document.createElement("div");

            item.className = "item-carrinho";

            item.innerHTML = `

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

                <div class="info-carrinho">

                    <h3>${produto.nome}</h3>

                    <p>
                        R$ ${produto.preco
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

            listaCarrinho.appendChild(item);

        });

    }


    // Atualiza total

    if (totalCarrinho) {

        totalCarrinho.textContent =
            `R$ ${valorTotal
                .toFixed(2)
                .replace(".", ",")}`;

    }

}


// ================================
// AUMENTAR QUANTIDADE
// ================================

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    atualizarCarrinho();

}


// ================================
// DIMINUIR QUANTIDADE
// ================================

function diminuirQuantidade(index) {

    carrinho[index].quantidade--;

    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();

}


// ================================
// REMOVER PRODUTO
// ================================

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


// ================================
// ABRIR CARRINHO
// ================================

function abrirCarrinho() {

    if (modalCarrinho) {

        modalCarrinho.classList.add("ativo");

    }

}


// ================================
// FECHAR CARRINHO
// ================================

if (fecharCarrinho) {

    fecharCarrinho.addEventListener("click", function () {

        modalCarrinho.classList.remove("ativo");

    });

}


// ================================
// CLICAR NO ÍCONE DO CARRINHO
// ================================

if (linkCarrinho) {

    linkCarrinho.addEventListener("click", function (evento) {

        evento.preventDefault();

        abrirCarrinho();

    });

}


// ================================
// FINALIZAR COMPRA
// ================================

if (finalizarCompra) {

    finalizarCompra.addEventListener("click", function () {

        if (carrinho.length === 0) {

            alert("Seu carrinho está vazio.");

            return;

        }

        alert(
            "Compra selecionada! Em breve vamos configurar o pagamento."
        );

    });

}


// ================================
// BUSCA
// ================================

const formBusca = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");

if (formBusca) {

    formBusca.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const termo = campoBusca.value
            .trim()
            .toLowerCase();

        const produtos =
            document.querySelectorAll(".produto");

        produtos.forEach((produto) => {

            const nome = produto
                .querySelector("h3")
                .textContent
                .toLowerCase();

            if (
                termo === "" ||
                nome.includes(termo)
            ) {

                produto.style.display = "";

            } else {

                produto.style.display = "none";

            }

        });

    });

}


// ================================
// NEWSLETTER
// ================================

const formNewsletter =
    document.getElementById("form-newsletter");

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


// ================================
// INICIAR
// ================================

atualizarCarrinho();
