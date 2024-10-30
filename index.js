// Alguns casos de teste
const jsonDataString = '{"name": "","rooms": ["Living Room", "01", "#", "02"],"age": "#","gender": "M","companies": {"name": "#","document": "0000000000","address": "","country": "Brazil"},"hobbies": ["#"],"contact": {"email": "example@example.com","phone": "#"}}';
const jsonData = {
    name: "",
    rooms: ["Living Room", "01", "#", "02"],
    age: "#",
    gender: "M",
    companies: {
        name: "#",
        document: undefined,
        address: "",
    },
    hobbies: ["#"],
    contact: {
        email: "example@example.com",
        phone: ["Living Room", {
            name: "#",
            document: undefined,
            address: "",
        }, "#", "02"],
    }
};
const jsonDataEmptyObj = {};
const jsonDataEmptyArray = [];
// Retorna o próprio número, pois o JSON.parse reconhece como um JSON válido tanto um número quanto a string de um número
const jsonDataNumberString = "233";
const jsonDataNumber = 233;

const jsonDataNull = null;
const jsonDataInvalid1 = "Teste JSON inválido";
const jsonDataInvalid2 = "";
const jsonDataInvalid3 = '{"name": "Henrique" "age": 30}';
const jsonDataInvalid4 = undefined;

function cleanedJson(data, removeEmptyArrayObj) {
    // Como estou validando o parâmetro inicial, ele sempre irá iniciar com um JSON válido; portanto, preciso tratar apenas os casos do tipo Array e do tipo Objeto.
    // Estou utilizando recursividade para contemplar os N níveis do JSON inicial e não apenas o primeiro nível.
    if (Array.isArray(data)) { // Verifica se data é do tipo array.
        if (removeEmptyArrayObj) {// Verifica se deve remover os Array e Objetos vazios
            return data
                .map(item => cleanedJson(item)) // Chama a função recursivamente para cada item do array
                .filter(item => item !== null && item !== undefined && item !== "" && item !== "#") // Filtra os itens que não são null, undefined, "" e "#"
                .filter(item => !(Array.isArray(item) && item.length === 0)) // Remove arrays vazios
                .filter(item => !(typeof item === "object" && item && Object.keys(item).length === 0)); // Remove objetos vazios
        }

        return data
            .map(item => cleanedJson(item)) // Chama a função recursivamente para cada item do array
            .filter(item => item !== null && item !== undefined && item !== "" && item !== "#") // Filtra os itens que não são null, undefined, "" e "#"

    } else if (data && typeof data === "object") { // Verifica se data é do tipo objeto.
        if (removeEmptyArrayObj) { // Verifica se deve remover os Array e Objetos vazios
            return Object.fromEntries( // Converte o objeto em um array de pares [chave, valor]
                Object.entries(data).map(([key, value]) => [key, cleanedJson(value)]) // Para cada par [chave, valor], chama a função recursivamente para o valor
                    .filter(([, value]) => value !== null && value !== undefined && value !== "" && value !== "#") // Filtra os valores que não são null, undefined, "" e "#"
                    .filter(([, value]) => !(Array.isArray(value) && value.length === 0)) // Remove arrays vazios
                    .filter(([, value]) => !(typeof value === "object" && value && Object.keys(value).length === 0)) // Remove objetos vazios
            );
        }
        return Object.fromEntries( // Converte o objeto em um array de pares [chave, valor]
            Object.entries(data).map(([key, value]) => [key, cleanedJson(value)]) // Para cada par [chave, valor], chama a função recursivamente para o valor
                .filter(([, value]) => value !== null && value !== undefined && value !== "" && value !== "#"))// Filtra os valores que não são null, undefined, "" e "#"

    }
    // Retorna quando o parâmetro data não é um Array ou um Objeto
    return data;
}

function desafioTopazio(inputJson, removeEmptyArrayObj) {
    try {
        // Verifica se o parâmetro é um objeto; caso não seja, faz o JSON.parse para verificar se é um JSON válido
        let objJson = typeof inputJson === 'object' ? inputJson : JSON.parse(inputJson);
        // Chama a função que manipula o inputJson passando como primeiro parametro o InputJson validado e segundo paramentro um booleano que define se deve ou nao remover os arrays e objetos vazios.
        let result = cleanedJson(objJson, removeEmptyArrayObj);
        // A variavel local result contém o resultado final, como o JSON.parse reconhece null como um JSON válido, verifico se result não é null para garantir que não seja aceito parâmetro inicial null.
        return result !== null ? result : "JSON inválido";
    } catch (error) {
        return "JSON inválido"; // Se falhar, não é um JSON válido
    }
}

//Como não estava claro na descrição se era permitido no resultado final chaves com valor array vazio e objeto vazio, criei um parametro booleano que caso for true ele trata esses casos.
//O primeiro parametro se refere ao Payload de entrada e o segundo é o booleano que verifica se o usuário deseja (true), ou não (false), remover as chaves cujo o valor é array vazio ou objeto vazio. 
const output = desafioTopazio(jsonDataString, true); //Constante result recebe o  Payload de saída

// Imprime no terminal o objeto limpo em formato JSON, com espaçamento de 2 para melhor legibilidade
console.log(JSON.stringify(output, null, 2));
