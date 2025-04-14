// Mostrar e esconder o menu de navegação
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector(".menu");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuBtn) {
    menu.style.display = "none";
  }
});

const rendaInput = document.getElementById("renda");
const despesaForm = document.getElementById("despesa-form");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const listaDespesas = document.getElementById("lista-despesas");
const restanteP = document.getElementById("restante");

// Cria o elemento de mensagem vazia
const mensagemVazia = document.createElement("p");
mensagemVazia.textContent = "Nenhuma despesa cadastrada ainda.";
mensagemVazia.classList.add("mensagem-vazia");
listaDespesas.parentElement.appendChild(mensagemVazia);

// Função para formatar o valor corretamente
function formatarValor(valor) {
    valor = valor.replace(",", ".").replace(/\s+/g, "");
    const valorConvertido = parseFloat(valor);
    return isNaN(valorConvertido) ? 0 : valorConvertido;
}

// Atualiza o valor restante
function atualizarRestante() {
    const renda = formatarValor(rendaInput.value);
    const despesas = Array.from(listaDespesas.children).map(li => {
        return formatarValor(li.querySelector(".valor").textContent.replace("R$ ", "").replace(",", "."));
    }).reduce((acc, valor) => acc + valor, 0);

    const restante = renda - despesas;

    if (isNaN(restante)) {
        restanteP.textContent = "Renda disponível após despesas: R$ 0,00";
    } else {
        restanteP.textContent = `Renda disponível após despesas: ${restante.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;
    }

    atualizarMensagemVazia();
}

// Atualiza a exibição da mensagem de lista vazia
function atualizarMensagemVazia() {
    mensagemVazia.style.display = listaDespesas.children.length === 0 ? "block" : "none";
}

// Salva as despesas no localStorage
function salvarDespesasNoLocalStorage() {
    const despesas = Array.from(listaDespesas.children).map(li => ({
        descricao: li.querySelector(".descricao").textContent,
        valor: li.querySelector(".valor").textContent.replace("R$ ", "").replace(",", ".")
    }));
    localStorage.setItem("despesas", JSON.stringify(despesas));
}

// Carrega despesas salvas ao abrir
function carregarDespesasDoLocalStorage() {
    const despesas = JSON.parse(localStorage.getItem("despesas")) || [];

    despesas.forEach(d => {
        adicionarDespesa(d.descricao, parseFloat(d.valor));
    });

    atualizarRestante();
}

// Adiciona uma nova despesa
function adicionarDespesa(descricao, valor) {
    const li = document.createElement("li");
    li.classList.add("despesa-item");

    li.innerHTML = `
        <span class="descricao">${descricao}</span>
        <span class="valor">R$ ${valor.toFixed(2).replace(".", ",")}</span>
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>
    `;

    listaDespesas.appendChild(li);

    li.querySelector(".editar").addEventListener("click", function () {
        descricaoInput.value = descricao;
        valorInput.value = valor.toString().replace(".", ",");
        li.remove();
        atualizarRestante();
        salvarDespesasNoLocalStorage();
    });

    li.querySelector(".excluir").addEventListener("click", function () {
        li.remove();
        atualizarRestante();
        salvarDespesasNoLocalStorage();
    });

    atualizarMensagemVazia();
}

// Submissão do formulário de despesa
despesaForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = descricaoInput.value.trim();
    const valor = formatarValor(valorInput.value);

    if (descricao && valor > 0) {
        adicionarDespesa(descricao, valor);
        descricaoInput.value = "";
        valorInput.value = "";

        atualizarRestante();
        salvarDespesasNoLocalStorage();
    } else {
        alert("Por favor, preencha a descrição e o valor da despesa.");
    }
});

// Salva a renda ao digitar
rendaInput.addEventListener("input", function () {
    localStorage.setItem("renda", rendaInput.value);
    atualizarRestante();
});

// Ao carregar a página, recupera os dados
window.addEventListener("load", function () {
    const rendaSalva = localStorage.getItem("renda");
    if (rendaSalva) {
        rendaInput.value = rendaSalva;
    }
    carregarDespesasDoLocalStorage();
});
