import styled from "@emotion/styled";
import { css, cx } from "@emotion/css";
import Image from "next/image";
import React from "react";
import type { PokemonQueryResult } from "../src/pages/results";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;
const PokemonCard = styled.div`
  margin: 10px 0;
  padding: 0 5px;
  position: relative;
  display: flex;
  justify-content: space-between;
  /* grid-template-columns: 1fr 1fr; */
  align-items: center;
  border: 1px solid #133e6f;
  border-radius: 5px;
  background-color: #12305175;
  @media (min-width: 768px) {
    padding: 0 8%;
  }
  
`;

const Index = styled.div`
  position: absolute;
  display: flex;
  p{margin: auto;}
  width: 46px;
  height: 46px;
  padding: 5px;
  top: 25px;
  left: 5px;
  background-color: #6c6b6b;
  border-radius: 50px;
`;

const Index2 = styled.div`
  /* position: ; */
  display: flex;
  p{margin: auto;}
  width: 46px;
  height: 46px;
  padding: 5px;
  /* top: 25px;
  left: 5px; */
  background-color: #6c6b6b;
  border-radius: 50px;
`;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votedFor, votedAgainst } = pokemon._count;
  if (votedFor + votedAgainst === 0) {
    return 0;
  }
  return (votedFor / (votedFor + votedAgainst)) * 100;
};
const PokemonList: React.FC<{ pokemons: PokemonQueryResult }> = ({
  pokemons,
}) => {
  if (!pokemons) return null;
  return (
    <Container>
      {pokemons.map((pokemon: PokemonQueryResult[number], index: number) => {
        return (
          <PokemonCard key={pokemon.id}>
            <div
              className={css`
                display: flex;
                align-items: center;
                /* margin-left:50px; */
              `}
            >
              <Index2><p>{index + 1}</p></Index2>
              <Image
                src={pokemon.spriteUrl}
                width={96}
                height={96}
                alt="PokemonImg"
              />
              <h4>{pokemon.name.toUpperCase()}</h4>
            </div>
            <div className={css`
              border-left: 3px solid #133e6f;
              padding-left:10px;
              height: 40px;
              width: 90px;
              display:flex;
              align-items: center;
            `}>
              <h4>{generateCountPercent(pokemon).toFixed(2)} %</h4>
            </div>
            {/* <Index><p>{index + 1}</p></Index> */}
          </PokemonCard>
        );
      })}
    </Container>
  );
};

export default PokemonList;
