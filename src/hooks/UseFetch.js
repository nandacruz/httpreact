import { useState,useEffect } from "react";


//custom hook
// Hook personalizado que recebe uma URL e retorna os dados obtidos da API
export const useFetch = (url) => {
      // Estado que armazena os dados retornados pela requisição
      const [data, setData] = useState(null);

      //5- refatorando POST
      // Define o estado 'config' que guardará as configurações da requisição (headers, body, etc.)
      const[config, setConfig] = useState(null);

      //Define o estado 'method' que armazenará o método da requisição (por exemplo, "POST")
      const[method, setMethod] = useState(null);

      //Define o estado 'callFetch' que pode ser usado para forçar uma nova chamada de fetch (não está sendo usado diretamente aqui ainda)
      const[callFetch, setCallFetch] = useState(false);

      //6 - loading
      const[loading, setLoading] = useState(false);

      //7 - Tratando erros
      const[error, setError] = useState(null);

      //8 - Desafio 6
      const[itemId, setItemId] = useState(null);

      // Função responsável por configurar a requisição HTTP
      const httpConfig = (data, method) => {

         // Verifica se o método passado é "POST"
        if(method === "POST"){

          // Define a configuração da requisição com método, cabeçalho e corpo em JSON
          setConfig({
            method,
            headers: {
              // Indica que o corpo da requisição será JSON
              "Content-type": "application/json", 

            },
             // Converte os dados em string JSON
            body: JSON.stringify(data),
          });

          // Define o método (será usado no useEffect anterior para disparar a requisição)
          setMethod(method);
        }
        
        //7 - Deletando produtos*********
        if(method === "DELETE"){
          // Define a configuração da requisição com método, cabeçalho e corpo em JSON
          setConfig({
            method,
            headers: {
              // Indica que o corpo da requisição será JSON
              "Content-type": "application/json", 

            },            
          });

          // Define o método (será usado no useEffect anterior para disparar a requisição)
          setMethod(method);  
          setItemId(data);
        }
        //***********/


      };

      // Hook do React que executa um efeito colateral após o componente ser renderizado.
      useEffect(() => {
        // Função assíncrona que busca os dados da URL
        const fetchData = async () => {

          //6 - loading
          setLoading(true);

          try {
            // Faz uma requisição HTTP para a URL definida na variável 'url' e espera a resposta.
            const res = await fetch(url);
            
            // Converte a resposta da requisição (em formato JSON) em um objeto JavaScript.      
            const json = await res.json();
      
            // Atualiza o estado 'data' com os dados recebidos da API.
            setData(json);            
          } catch (error) {

            console.log(error.mensage);

            setError("Ocorreu um problema ao carregar os dados, tente novamente mais tarde");
          }

          

          //7 - loading
          setLoading(false);          
        }
    
        // Chama a função para buscar os dados
        fetchData();
    
      }, [url, callFetch]); // O efeito será executado sempre que a URL mudar

      //5 - refatorando post
      useEffect(()=>{

        // Define uma função assíncrona chamada httpRequest
        const httpRequest = async () => {

          let json;

          // Verifica se o método da requisição é POST
          if(method === "POST"){

            // Cria um array com a URL e as configurações da requisição
            let fetchOptions = [url,config];

            // Usa o operador spread (...) para passar os elementos do array como argumentos da função fetch
            // Isso equivale a: fetch(url, config)
            const res = await fetch(...fetchOptions);

             // Converte a resposta da requisição para JSON
            json = await res.json();            
          }

          //7 - Deletando produtos  
          if(method === "DELETE"){

            const deleteUrl = `${url}/${itemId}`;

            const res = await fetch(deleteUrl,config);

            json = await res.json();

            
          }

          // Atualiza o estado com o resultado da requisição
          setCallFetch(json);
        };
        // Chama a função httpRequest assim que o useEffect for executado
        httpRequest();

      // O useEffect será executado sempre que config, method ou url mudarem  
      },[config, method, url]);
    
      // Retorna os dados buscados para quem usar esse hook
      return {data, httpConfig, loading, error};
};
    
