// Mostrar e esconder o menu de navegação
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector(".menu");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Impede que o clique feche o menu
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
});

// Fecha o menu se clicar fora dele
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== menuBtn) {
    menu.style.display = "none";
  }
});

// Referências dos campos e lista de despesas
const rendaInput = document.getElementById("renda");
const despesaForm = document.getElementById("despesa-form");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const listaDespesas = document.getElementById("lista-despesas");
const restanteP = document.getElementById("restante");

// Função para formatar e garantir que o valor seja um número válido
function formatarValor(valor) {
    if (typeof valor !== "string") valor = String(valor);
    valor = valor.replace(/\./g, "").replace(",", ".").replace(/\s+/g, "");
    const valorConvertido = parseFloat(valor);
    return isNaN(valorConvertido) ? 0 : valorConvertido;
}

// Função para atualizar o valor restante
function atualizarRestante() {
    const renda = formatarValor(rendaInput.value);
    const despesas = Array.from(listaDespesas.children).map(li => {
        const textoValor = li.querySelector(".valor").textContent;
        const valorDespesa = textoValor.replace(/[^\d,]/g, "");
        return formatarValor(valorDespesa);
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
}

// Função para adicionar uma despesa
despesaForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const descricao = descricaoInput.value;
    const valor = formatarValor(valorInput.value);

    if (descricao && valor > 0) {
        const li = document.createElement("li");
        li.classList.add("despesa-item");

        li.innerHTML = `
            <span class="descricao">${descricao}</span>
            <span class="valor">${valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}</span>
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;

        listaDespesas.appendChild(li);

        descricaoInput.value = "";
        valorInput.value = "";

        atualizarRestante();

        const editarBtn = li.querySelector(".editar");
        editarBtn.addEventListener("click", function () {
            descricaoInput.value = descricao;
            valorInput.value = valor;
            li.remove();
            atualizarRestante();
        });

        const excluirBtn = li.querySelector(".excluir");
        excluirBtn.addEventListener("click", function () {
            li.remove();
            atualizarRestante();
        });
    } else {
        alert("Por favor, preencha a descrição e o valor da despesa.");
    }
});

// Atualizar valor restante quando a renda for alterada
rendaInput.addEventListener("input", function () {
    atualizarRestante();
});
