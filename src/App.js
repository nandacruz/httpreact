import './App.css';

import {useState} from 'react';
import { useFetch } from './hooks/UseFetch';

const url = "http://localhost:3000/products";

function App() {

  //products: é a variável de estado, que armazenará o valor atual (neste caso, a lista de produtos).
  //setProducts: é a função usada para atualizar o valor de products. Sempre que você quiser alterar o valor de products, deve usar setProducts(novoValor).
  //O hook useState é uma função do React que permite adicionar estado a um componente funcional.
  //O valor passado como argumento ([]) é o valor inicial do estado — neste caso, um array vazio, indicando que inicialmente não há produtos.
  const [products, setProducts] = useState([]);

  //4 - Custom hook
  const {data: items, httpConfig, loading, error} = useFetch(url);

  const [name, setName] = useState([]);
  const [price, setPrice] = useState([]);


  /* 1 - Resgatando dados

  // Hook do React que executa um efeito colateral após o componente ser renderizado.
  useEffect(() =>{

    async function fetchData() {
      const res = await fetch(url);// Faz uma requisição HTTP para a URL definida na variável 'url' e espera a resposta.

      const data = await res.json();// Converte a resposta da requisição (em formato JSON) em um objeto JavaScript.
  
      setProducts(data);// Atualiza o estado 'products' com os dados recebidos da API.

    }

    fetchData(); // Chama a função fetchData() para buscar os dados assim que o componente for montado.

  },[]);// O array vazio indica que esse efeito deve ser executado apenas uma vez, quando o componente for montado.
  */
  

  // 2 - Adição de produtos

  // Função que será chamada ao enviar um formulário
  const handleSubmit = async (e) => {

      // Evita o comportamento padrão do formulário (recarregar a página)
      e.preventDefault();

      // Cria um objeto `product` com as variáveis `name` e `price`
      const product = {
        name,  
        price, 
      };

      // Exibe o objeto `product` no console (para fins de depuração)
      //console.log(product);

      
      // Envia uma requisição HTTP POST para o servidor com os dados do produto
      //const res = await fetch(url, {
        //method: "POST", // Método HTTP
        //headers: {
         // "Content-Type": "application/json", // Informa que os dados estão em formato JSON
        //},
        //body: JSON.stringify(product), // Converte o objeto `product` em uma string JSON
      //});

      //3 - carregamento dinâmico
      // Aguarda a resposta da requisição e converte para JSON (ou seja, o produto que acabou de ser adicionado)
      //const addedProduct = await res.json();

      // Atualiza o estado `products`, adicionando o novo produto à lista anterior
      // `...prevProducts` copia os produtos já existentes, e `addedProduct` é adicionado no final
      //setProducts((prevProducts) =>[...prevProducts, addedProduct]);

      //5 - Refatorando código
      httpConfig(product, "POST");
      
      // Limpa o campo de nome (reseta para vazio)
      setName("");

      // Limpa o campo de preço (reseta para vazio)
      setPrice("");
  };  

  //8 - Apagar produto
  const handleDelete = async (id) =>{
    
    httpConfig(id, "DELETE");

    //console.log("produto", id);
   
  }

  return (
    <div className="App">
      <h1>Lista de Produtos</h1>
      {/*6-loading*/}
      {loading && <p>Carregando dados...</p>}

      {/*7 Tratando erros*/}
      {error && <p>{error}</p>}

      {!error && (
        <ul>
          {/* Verifica se "items" existe (não é null ou undefined.Se "items" existir, executa o map para percorrer cada item do array)*/}
          {items && items.map((product) => (
            <li key={product.id}> {/*// Cria um elemento de lista <li> para cada produto. A prop 'key' ajuda o React a identificar cada item de forma única (melhora performance e evita bugs em listas).*/}
              Nome: {product.name}, Price R$: {product.price}{/*// Mostra os dados do produto: o nome e o preço. As chaves {} são usadas para inserir valores JavaScript no JSX.*/}    
              <input type="button" value="X" onClick={() => handleDelete(product.id)} />          
            </li>
          ))}
        </ul>
      )}
      <div className="add-product">
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            {/* Atualiza o estado `name` toda vez que o usuário digita algo*/}
            <input type="text" value={name} name="name" onChange={(e) => setName(e.target.value)} />  
          </label>
          <label>
            Preço:
            <input type="number" value={price} name="price" onChange={(e) => setPrice(e.target.value)} />
          </label>
          {/*7 - Loading no POST*/}
          {loading && <input type="submit" disabled value="Aguarde" />}
          {!loading && <input type="submit" value="Criar Produto" />}
          
        </form>
      </div>
    </div>
  );
}

export default App;
