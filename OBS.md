
compartilhe conhecimento e pense em como ajudar outras pessoas:

1. pense em como melhorar as aplicações;
2. crie soluções
3. adicione funcionalidades aos projetos
4. busque formas de ressaltar suas habilidades

ajude as oportunidades a encontrarem você

______________________


# Formas de renderização

  -> Pai para filho: sempre que o conteúdo pai for re-renderizado, o filho é renderizado novamente

  ```tsx
  <Pai>
    <Filho />
  </Pai>
  ```
  -> Propriedade: se a propriedade mudar, o componente é re-renderizado

  ```tsx
  <Pai>
    <Filho title="título" />
  </Pai>
  ```

  -> Hooks (useState, useContext, useReducer): causam alterações que impactam em novas renderizações nos componentes

  ```tsx
  <Pai>
    <Filho title="título" />
  </Pai>
  ```

# O que é o Fluxo de Renderização do React 
  
  - Quando React percebe que precisa re-renderizar o componente ele: 
  
  1. Vai gerar uma nova versão do componente que precisa ser renderizado (essa é guardada em memória, em uma representação na DOM daquele componente);
  2. Compara a nova versão com a versão anterior que está na página;
  3. Se houverem alterações entre as versões, o react renderiza a nova versão em tela;

  - E como ele sabe que existe alteração entre as versões? 
  Usa um algoritimo chamado de [Reconciliation], do tipo *diffing*, feito para calcular a diferença entre duas estruturas, ele precisa disso porque em certas situações surge a necessidade ->
  
  Ex: Imagine que você tem esse elemento: 

```html
<div className="before" title="stuff"></div>
```
  E então precisa mudar/alterar a className dele para:

```html
<div className="after" title="stuff"></div>
```
  Faz sentido esse componente ser re-renderizado completamente, sendo que houve uma alteração de uma propriedade básica? Até faz, se for em um escopo pequeno assim, mas em uma aplicação, isso é custoso.

  Então esse algoritimo estabelece algumas regras para encontrar compoentes alterados ou removidos na tela, entendendo as diferenças e fazendo o necessário, aplica apenas as modificações necessárias na DOM;

  -> Para entender/aprofundar mais: _reactjs.org/docs/reconcilliation.html_

# Lembrete: React já é muito performático, então se preocupar antecipadamente não é ideal



# Prática

- criação do serverjs com jsonserver que vai simular uma api

- desenvolvimento da aplicação

- aprendendo sobre [ReactDevTools]: {
  option Highlight: podemos ver quais componentes estão sendo afetados e renderizados novamente em um contorno azul.

  Na pagina de home, quando digitamos na search box, aquele estado, a propriedade muda e então ele precisa ser renderizado novamente, porém isso afeta também o estado dos results, o que faz com que seja renderizado novamente junto e os componentes filhos que seriam os produtos também são renderizados novamente, tudo seguindo as regras e formas do ciclo de renderização.

  Porém isso não siginifca que estão sendo criados do zero novamente, apenas que o react está comparando na DOM os componentes, não que realmente está recriando, pois as vewzes se tal atributo não mudou, então não precisa, mas existe um custo nessa comparação, mais alto ou mais baixo, e pra ver isso existe o Profiler

  Serve para entender quais componentes da nossa página renderizaram a partir de uma ação e quanto isso demorou, vendo quais estão mais demorando. E dentro ele também diz porque o componente foi renderizado, uma das três formas.

  - usando essa aplicação ele mostrou que por mais que o tempo de renderização esteja baixo, o custo para fazer a comparação de mil itens, somando, é muito;

  - outra coisa são os commits: enquanto estamos em record, cada vez que mudamos ao algo e causa o efeito de comparação, ele deixa gravado cada uma para nós compararmos.
}

[Módulo2]

# Primeira ferramenta: Vai evitar que o react faça a recalculação em componentes filhos quando sabemos que o conteúdo deles não vai mudar só porque o conteúdo do Pai mudou 
  Memo: formas de utilizar (aquivo ProductItem)

  O que ele vai fazer é comparar se a algum dado daquele componente que tenha mudado, comparando a versão antiga com a "nova", caso não tenha:

  Ele vai evitar que a primeira etapa do Fluxo de Renderização aconteça. Caso nenhuma propriedade do componente tenha sido alterada.

  Por padrão ele faz uma comparação chamado de: `Shallow Compare -> Comparação Rasa`, ele verifica a igualdade das informações que temos nas propriedades, porém no javascript, se por exemplo compararmos dois objetos dessa forma: {} === {}, ele vai automaticamente dizer que o resultado é false, pois executa o que é chamado de igualdade referencial, ele não compara os objetos, apenas compara se os objetos estão ocupando a mesma posição na memória; Quando usamos o Memo e a propriedade é um objeto, ele vai ver se o objeto que tinhamos antes é igual ao objeto que temos agora, e isso vai retornar false como falamos e como resultado ele vai renderizar o componente de novo, mesmo que tecnicamente o conteúdo não tenha mudado.

  Então quando temos propriedades que são objetos e não textos ou coisas que possam ser comparadas usando operadores de igualdade complexa (===), precisamos mandar um segundo parâmetro no memo, que seria uma função que vai retornar se o componente é igual ou não: continua no arquivo

  *Coment*: isso ajuda demais kkk no vídeo da pra ver melhor os resultados.

  Lembrando, usar de forma descenssária pode prejudicar mais do que ajudar, pois nesse exemplo foi necessária uma comparação profunda que custa mais, então as vezes é melhor deixar o próprio React fazer sua comparação que é mais rápida

  - Quando devemos utilizar o Memo:

  1. Pure Functional Components: para componentes que são criados para abstrair alguma parte visual da nossa aplicação. Funções Puras são aquelas que dado os mesmos parâmetros, sempre vão retornar o mesmo resultado, no caso de componente, sempre que recebermos a mesma propriedade no componente (product), ele vai renderizar o mesmo html. Dizemos que algo não é puro quando está conectado com algo externo a aplicação, que vai devolver um valor diferente em certas condições;

  2. Renders to Often: para componentes que vão renderizar muito, podemos usar o devTools, e conforme vamos usando a aplicação, podemos perceber os componentes que estão renderizando além da conta.

  3. Re-renders with same props: para componentes que forem renderizados poucas vezes, mas sempre vão estar com as mesmas propriedades

  4. Medium to Big Size: ganhamos muita performace com Memo para componentes que estão entre esses dois tamanhos, para componentes pequenos, os custos acabam não fazendo diferença, seria algo prematuro.

# useMemo: 

  - ele apenas evita que alguma coisa, que ocupe muito processamento (um cálculo extenso, ou uma chamada a api por exemplo), seja refeito toda vez que aquele componente renderizar.

  - vamos aplicar o exemplo no arquivo(SearchResults.tsx)

  pode usar ele para memorizar (memorization) entre as renderizações desse componente para que ele não precisa ser recalculado toda vez

  Outro uso importante do useMemo é para quando queremos que ele evite que determinada variavel ocupe um novo lugar dentro da memória quando estamios utilizando essa variável para ela ser repassada a um componente filho.

  - Quando devemos utilizar o useMemo:

  1. Cálculos pesados!
  2. Igualdade Referencial (ao repassar a informação a um componente filho, mesmo se for uma variável de cálculo simples, que assim vai evitar que crie do zero ela)



# useCallback

  - Parecido com o anterior, mas serve para memorizar uma função e não um valor;

  - Erro comum: "uma função tem muito código dentro dela, então recriar ela é custoso para o js", não, não é pela quantidade de código.

  O uso disso está na igualdade referencial

  O que fez: criação da função addtowishlist e repasse para o componente searchresults e dele ao productitem.

  - Quando devemos utilizar o useCallback:

  Quando criamos uma função, e essa vai ser repassada pros componentes filho da nossa aplicação, é importante que ela utilize o useCallback, e isso também é válido principalmente para aquelas funções de Contexts, pois elas serão importadas por vários outros componentes;

# Formatação de Dados

  - Um grande erro é fazer formatação ou cálculo na hora da renderização do componente!
  
  No exemplo do totalPrice por exemplo, sabemos quando esse cálculo deve ocorrer, sempre que buscarmos novos dados, então faz mais sentido colocar ele dentro da função de buscar e fazer o cálculo junto, nesse momento e não quando já tivermos feito a busca e os componentes forem exibidos em tela.

  A mesma coisa cabe aos preços, datas e vários outros, a questão é encontrar o momento ideal para fazer a formatação dos dados, para assim ela não precisar ser refeita desnecessariamente, atingindo a performance.

  Então trabalhe com os dados sempre que buscar e não quando renderizar.

# Code Splitting / Dynamic Import

  Funcionalidade de podermos importar um componente, fucionalidade ou algo assim, somente no momento que formos utilizar, isso faz diferença no bundle;

  Normalmente o Next, o react ou qualquer outro, cria um arquivo bundle.js que contem todas as funcionalidades, componentes e etc no mesmo arquivo, ao gerar isso, esse auxiliar vai olhando os arquivos, ve os imports e vão incluindo no bundle, todo o código necessário pra aplicação

  O problema é que certas funcionalidades dentro do app só vão ser utilizadas caso o usuário tome determinada ação, 

  - vamos criar o addProducttowishlist e adicionar isso ao Productitem

  O que é Code Splitting ou Laze Loading: quando utilizamos um componente e nem sempre ele vai ficar vísivel em tela, podemos colocar esse componente em um carregamento preguiçoso: carregar o código desse componente apenas quando ele for ser exibido em tela, e não em build, no primeiro momento em que a aplicação for carregada.

  - agora fazer o dynamic import do next e aplicar;

  Em uma internet lenta, essa porra demora demais, por isso usamos a propriedade loading, um componente que vai ser renderizado no lugar até isso aí ser importado;

  - Usar porque Cada import resulta em mais carregamento.

  Resumindo: renderizar um componente ou uma função só quando precisar;

# Virtualização

  Permite que mostremos em tela, no html, somente os itens que estejam visíveis no navegador do usuário, ótimo para muitos dados em tela.

  - yarn add react-virtualized

  O exemplo é o scroll da tela, afinal, renderizar uma lista com mil itens, quem caralhos vê de fato mil itens na tela

  - começamos no arquivo SearchResult.tsx a implementação com o componente List
  - implementamos a função de renderizar o elemento

  Isso é muito louco em tela kkk realmente não aparece, não é criado no html caso não precise

  Pode ser usado pra scrool, tabela, listas, layouts masonry ou collections

# Bundle Analyzer

  Entender o nosso bundle e entender os pontos críticos dele

  - yarn add @next/bundle-analyzer

  Usamos antes de fazer deploy para ver as dependências que estão junto do app e quais estão mais impactando no código final;