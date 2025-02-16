const firebaseConfig = {
    apiKey: "AIzaSyC6Yl-B2bEfyWrhXGNCTHVqTWgXg2tH0Oc",
    authDomain: "horas-complementares-26f39.firebaseapp.com",
    databaseURL: "https://horas-complementares-26f39-default-rtdb.firebaseio.com",
    projectId: "horas-complementares-26f39",
    storageBucket: "horas-complementares-26f39.appspot.com",
    messagingSenderId: "59492546049",
    appId: "1:59492546049:web:716911d664dc73f517b200"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
//ponto de conexão com o banco do Firebase
var db = firebase.firestore();

//captura os elementos do html
var formulario = document.getElementById("formularioid")
var atividade = document.getElementById("classificacaoAtv")
var horasPorCategoria ={}

/*Preenchimento do valor do select 
a cada mudança no select atividade, o select de atividades é limpo e preenchido com as opções correspondentes*/
atividade.addEventListener("change", function(){
    limparSelect()

    if(atividade.value == "Ensino"){
        
        //criação um vetor das opções do select do tipo ensino
        var opcoesAtividade = [
            {value: "", text: "Selecione uma opção"}, // Adiciona uma opção vazia
            {value: "estagio", text:"Estágio Extracurricular", percentual: 0.7, limite: 40},
            {value: "monitoria", text:"Monitoria", percentual: 0.7, limite: 40},
            {value:"concurso", text:"Concurso e campeonatos de atividade acadêmicas", percentual: 0.7, limite: 50},
            {value: "tcc", text: "Presença comprovada a defesas de TCC", percentual: 0.5, limite: 3},
            {value: "cursoArea", text: "Cursos Profissionalizantes Específicos na área", percentual: 0.8, limite: 40},
            {value: "cursosGeral", text: "Cursos Profissionalizantes em geral", percentual: 0.2, limite: 10}
        ];
      
    }

    if(atividade.value == "Pesquisa"){
    
        //criação das opções do select do tipo pesquisa
        var opcoesAtividade = [
            {value: "", text: "Selecione uma opção"}, // Adiciona uma opção vazia
            {value: "iniciacao", text:"Iniciação Científica", percentual: 0.8, limite: 40},
            {value: "periodico", text:"Publicação de artigos em periódicos científicos", percentual: 1.0, limite: 10},
            {value: "congresso", text:"Publicação de artigos completos em anais de congressos", percentual: 1.0, limite: 7},
            {value: "livro", text: "Publicação de capítulo de livro", percentual: 1.0, limite: 7},
            {value: "resumo", text: "Publicação de resumos de artigos em anais", percentual: 1.0, limite: 5},
            {value: "patente", text: "Registro de patentes como autor/coautor", percentual: 1.0, limite: 40},
            {value: "pesquisa", text: "Premiação resultante de pesquisa científica", percentual: 1.0, limite: 10},
            {value: "ColabSeminario", text: "Colaborador em atividades como Seminários e Congressos", percentual: 1.0, limite: 10},
            {value: "ouvinte", text: "Palestras, Seminários e Congressos de Pesquisa - ouvinte", percentual: 0.8, limite: 10},
            {value: "apresentador", text: "Palestras, Seminários e Congressos de Pesquisa - apresentador", percentual: 1.0, limite: 15}
        ];
    }

    if(atividade.value == "Extensão"){
    
        //criação das opções do select
        var opcoesAtividade = [
            {value: "", text: "Selecione uma opção"}, // Adiciona uma opção vazia
            {value: "projeto", text:"Projeto de extensão", percentual: 0.1, limite: 40},
            {value: "atividade", text:"Atividades culturais", percentual: 0.8, limite: 5},
            {value: "tecnica", text:"Visitas Técnicas", percentual: 1.0, limite: 40},
            {value: "feira", text: "Visitas a Feiras e Exposições", percentual: 0.2, limite: 5},
            {value: "idioma", text: "Cursos de Idiomas", percentual: 0.6, limite: 20},
            {value: "ouvinte", text: "Palestras, Seminários e Congressos Extensionistas - ouvinte", percentual: 0.8, limite: 10},
            {value: "apresentador", text: "Palestras, Seminários e Congressos Extensionistas - apresentador", percentual: 1.0, limite: 15},
            {value: "empresa", text: "Projeto Empresa Júnior", percentual:0.2, limite: 20},
        ];
    }

    //chama a função para criar o select    
    var select = criarSelect(opcoesAtividade)

    //adiciona o select ao formulário na última opção
    formulario.appendChild(select)
})

document.getElementById("btnSalvar").addEventListener("click", function () {

    // Captura os valores do formulário
    var nomeAtividade = document.getElementById("nomeid").value
    var horasInput = parseFloat(document.getElementById("horasid").value)
    var select = document.getElementById("escolha")

    if(!nomeAtividade){
        alert("Por favor, insira um nome para a atividade.")
        return
    }

    if (!atividade || atividade === "") {
        alert("Por favor, selecione uma classificação de atividade.")
        return
    }

    if (isNaN(horasInput) || horasInput <= 0) {
        alert("Por favor, insira um valor válido para as horas.")
        return
    }

    if (!select) {
        alert("Por favor, selecione uma classificação para a atividade.")
        return
    }

    var selectSelecionado = select.options[select.selectedIndex]//seleciona a opção escolhida no select
    var percentual = parseFloat(selectSelecionado.dataset.percentual)//captura o percentual da opção escolhida
    var limite = parseInt(selectSelecionado.dataset.limite)//captura o limite da opção escolhida
    var categoria = document.getElementById("classificacaoAtv").value //captura a categoria da atividade

    if (isNaN(percentual) || isNaN(limite)) {
        alert("Erro ao capturar valores da opção selecionada.")
        return
    }

    // Chama a função para realizar o cálculo de horas acumuladas
    var horasAcumuladas = calcularHorasAcumuladas(horasInput, percentual, limite, categoria)


    // Adiciona a linha na tabela após salvar os dados
    adicionarLinhaTabela(horasAcumuladas)

    // Atualiza a tabela de horas por categoria e preenche com os valores calculados
    atualizarTabelaHorasPorCategoria()

    // Limpa os campos do formulário após salvar
    document.getElementById("nomeid").value = ""
    document.getElementById("horasid").value = ""
    limparSelect()
    
})

// Função para criar o select
function criarSelect(opcoesAtividade) {
    var select = document.createElement("select")
    select.id = "escolha"
    select.name = "escolha"
    
    adicionarOpcoes(select, opcoesAtividade)// Adiciona as opções ao select
    
    return select // Retorna o select criado
}

// Função para adicionar opções ao select
function adicionarOpcoes(select, opcoesAtividade) {
    opcoesAtividade.forEach(opcao => {
        var option = document.createElement("option")
        option.value = opcao.value

        if(opcao.text === 'Selecione uma opção'){
            option.textContent = `${opcao.text}`
        }
        else{
            option.textContent = `${opcao.text} (Aproveita ${opcao.percentual * 100}% com limite de ${opcao.limite}h)`
        }
        
        option.dataset.percentual = opcao.percentual
        option.dataset.limite = opcao.limite
 
        select.appendChild(option)
    })
}
// Função para limpar o select
function limparSelect(){
    var selectExistente = document.getElementById("escolha")
    var classificacaoAtv = document.getElementById("classificacaoAtv")

    if(selectExistente){
        selectExistente.remove()
        classificacaoAtv.value = "" // Define o valor para "vazio" ou qualquer valor padrão
    }
 } 

// Função para calcular as horas acumuladas
function calcularHorasAcumuladas(horasInformadas, percentual, limite, categoria) {
    var horasCalculadas = (horasInformadas * percentual)

    horasCalculadas = Math.round(horasCalculadas) //arredonda para o inteiro mais próximo

    //verifica se as horas calculadas são maiores que o limite e se for, ajusta o valor para o limite
    if (horasCalculadas > limite) {
        horasCalculadas = limite
        alert(`Limite de ${limite} horas para a atividade excedido. Aproveitado ${limite} horas.`)
    }
   //verifica se a categoria já existe em horasPorCategoria, se não existir, cria a categoria e inicializa com 0
    if (!horasPorCategoria[categoria]) {
        horasPorCategoria[categoria] = 0
    }

    if (horasPorCategoria[categoria] + horasCalculadas > 90) {

        var horasRestantes = 90 - horasPorCategoria[categoria]
        horasCalculadas = horasRestantes

        alert(`Limite de 90 horas para a categoria ${categoria} excedido. Aproveitado ${horasRestantes} horas.`)
    }

    horasPorCategoria[categoria] += horasCalculadas
    return horasCalculadas
    
}

//função para atualizar as horas por categoria
function atualizarTabelaHorasPorCategoria() {

    var tabela = document.getElementById("tabelaResultado").getElementsByTagName('tbody')[0]
    tabela.innerHTML = "" // Limpa o conteúdo atual

    for (var categoria in horasPorCategoria) {
      
        var linha = document.createElement("tr")
        var colunaCategoria = document.createElement("td")
        var colunaHoras = document.createElement("td")

        colunaCategoria.textContent = categoria
        colunaHoras.textContent = horasPorCategoria[categoria]

        linha.appendChild(colunaCategoria)
        linha.appendChild(colunaHoras)
        tabela.appendChild(linha)


        var cadastroHoraCategoria = db.collection('horaCategorias').doc(categoria);

        // Obtém o documento específico da categoria
        cadastroHoraCategoria.get().then(function(doc) {
            if (doc.exists) {
                // Exclui o documento anterior
                cadastroHoraCategoria.delete().then(function() {
                    // Cria um novo documento com a categoria e as horas
                    cadastroHoraCategoria.set({
                        categoria: categoria,
                        horas: horasPorCategoria[categoria]
                    })
                })
            } else {
                // Cria um novo documento com a categoria e as horas
                cadastroHoraCategoria.set({
                    categoria: categoria,
                    horas: horasPorCategoria[categoria]
                })
            }
        })
    }
}


// Função para adicionar uma linha na tabela
function adicionarLinhaTabela(horasAcumuladas) {
    var aux_Tabela = document.getElementById("tabelaid").getElementsByTagName('tbody')[0]
    var linha = document.createElement("tr")
    var coluna = document.createElement("td")
    var coluna1 = document.createElement("td")
    var coluna2 = document.createElement("td")
    var coluna3 = document.createElement("td")
    var coluna4 = document.createElement("td")

    // Coleta dos dados para as colunas da tabela
    coluna.textContent = document.getElementById("nomeid").value
    coluna1.textContent = document.getElementById("classificacaoAtv").value

    var tipoAtividade = document.getElementById("escolha").options[document.getElementById("escolha").selectedIndex].textContent
    var apenasTipoAtividade = tipoAtividade.split('(')[0]// Remove a parte após o parêntese para não aparece o limite e o percentual na tabela
    coluna2.textContent = apenasTipoAtividade

    coluna3.textContent = document.getElementById("horasid").value
    coluna4.textContent = horasAcumuladas


    linha.appendChild(coluna)
    linha.appendChild(coluna1)
    linha.appendChild(coluna2)
    linha.appendChild(coluna3)
    linha.appendChild(coluna4)

    // Inserindo os valores na tabela
    aux_Tabela.appendChild(linha)

    const cadastroAtividade = db.collection('atividades').doc()
    
    cadastroAtividade.set({
        nome: document.getElementById("nomeid").value,
        classificacao: document.getElementById("classificacaoAtv").value,
        tipo: apenasTipoAtividade,
        horas: document.getElementById("horasid").value,
        horasAproveitas: horasAcumuladas,
    })

}

// Função para gerar o arquivo Excel
function gerarExcel() {
    // Buscar dados da coleção horaCategorias
    const dadosHoraCategorias = []

    db.collection('horaCategorias').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        dadosHoraCategorias.push({
          Atividade: data.categoria,
          Categoria: data.horas
        })
      })

      // Buscar dados da coleção atividades
      const dadosAtividades = []
      db.collection('atividades').get().then((snapshot2) => {
        snapshot2.forEach((doc) => {
          const data = doc.data();
          dadosAtividades.push({
            Atividade: data.nome,
            Categoria: data.classificacao,
            TipoDeAtividade: data.tipo,
            HorasInformadas: data.horas,
            HorasAproveitadas: data.horasAproveitas
          })
        })

        // Aqui, estou simplesmente concatenando os dados, mas você pode estruturar conforme necessário
        const dadosCombinados = [...dadosAtividades, {}, {Atividade:"Categoria", Categoria:"HorasTotais"}, ...dadosHoraCategorias]

        // Criar a planilha Excel com os dados combinados
        const ws = XLSX.utils.json_to_sheet(dadosCombinados, { skipHeader: false })

        // Ajustar as larguras das colunas, se necessário
        const colunas = ws["!cols"] || [];
        ws["!cols"] = [
          { wpx: 100 }, 
          { wpx: 100 }, 
          { wpx: 300 }, 
          { wpx: 50 }, 
          { wpx: 50 }
        ]


        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Atividades Cadastradas")

        // Gerar o arquivo Excel e fazer o download
        XLSX.writeFile(wb, "Atividades_Cadastradas.xlsx");

      }).catch((error) => {
        console.error("Erro ao buscar dados da coleção outrosDados:", error)
      })
    }).catch((error) => {
      console.error("Erro ao buscar dados da coleção horaCategorias:", error)
    })
  }

    