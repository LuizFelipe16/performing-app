import { useMemo } from "react";
import { List, AutoSizer, ListRowRenderer } from "react-virtualized";
import { ProductItem } from "./ProductItem";

interface SearchResultsProps {
  totalPriceNew: number;

  results: Array<{
    id: number;
    price: number;
    title: string;
    priceFormatted: string;
  }>

  onAddToWishlist: (id: number) => void;
}

export function SearchResults({ results, onAddToWishlist, totalPriceNew }: SearchResultsProps) {
  // 1° applying useMemo
  // antes do usememo, no vídeo esse calculo dobrou o tempo de renderização
  // antes a cada digitação isso era re-renderizado
  const totalPrice = useMemo(() => {
    return results.reduce((total, product) => {
      return total + product.price;
    }, 0);
  }, [results]); // em que caso eu quero que esse memo seja refeito
  // .

  // 2° After applying the virtualization
  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    // sempre precisa ter um div por volta que recebe a key
    // style é quem controla se o elemento deve ou não ficar em tela
    return (
      <div key={key} style={style}>
        <ProductItem product={results[index]} onAddToWishlist={onAddToWishlist} />
      </div>
    );
  }

  return (
    <div>
      <h2>{totalPrice}</h2>
      {/* 1° After applying the virtualization */}
      <List
        // altura que a lista vai ocupar, se não sabe e quer que ocupa o máximo: AutoSizer
        height={300}
        // cada linha da lista vai ter x de altura
        rowHeight={30}
        // largura que a lista vai ocupar
        width={900}
        // quantos itens devem ser pré-carregados pra cima e pra baixo, para quando ela dar scroll
        // ele já estar ali
        overscanRowCount={5}
        // quantos itens tem na lista ao todo
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />

      {/* Before applying the virtualization */}
      {/* {results.map(product => {
        return (
          <ProductItem key={product.id} product={product} onAddToWishlist={onAddToWishlist} />
        );
      })} */}
    </div>
  );
}