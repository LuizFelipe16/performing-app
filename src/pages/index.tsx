import Head from 'next/head';
import { FormEvent, useCallback, useState } from 'react';
import { SearchResults } from '../components/SearchResults';

type Results = {
  totalPrice: number;
  data: any[];
}

export default function Home() {
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: []
  });
  const [search, setSearch] = useState('');

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: 'currency',
      currency: 'BRL'
    });

    const products = data.map((product: any) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatter.format(product.price)
      }
    });

    const totalPrice = data.reduce((total: any, product: any) => {
      return total + product.price;
    }, 0);

    setResults({ totalPrice, data: products });
  }

  // 1° applying useCallback
  const addToWishlist = useCallback(async (id: number) => {
    // toda vez que o componente Home renderiza, essa função é criada do zero
    // ocupa um novo espaço na memória, como essa função está sendo passada, toda vez que ele for
    // recriada, o componente vai perceber que a função é diferente, pois ele faz um comparação
    // de igualdade referencial, que vai fazer a função ser recriada

    console.log(id);
  }, []); // dependências: qualquer informação que precisamos do componente Home

  return (
    <div>
      <Head><title>PerformingApp</title></Head>

      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPriceNew={results.totalPrice}
        onAddToWishlist={addToWishlist}
      />
    </div>
  );
}