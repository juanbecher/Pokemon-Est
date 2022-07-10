import styled from "@emotion/styled";
import { css, cx } from "@emotion/css";
import Image from "next/image";
import React from "react";
import type { PokemonQueryResult } from "../src/pages/results";

const Container = styled.div`
  width: 600px;
  margin: 0 auto;
`;
const PokemonCard = styled.div`
  margin: 10px 0;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border: 1px solid #133e6f;
  border-radius: 5px;
  background-color: #12305175;
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
                margin-left:50px;
              `}
            >
              <Image
                src={pokemon.spriteUrl}
                width={96}
                height={96}
                alt="PokemonImg"
              />
              <h3>{pokemon.name.toUpperCase()}</h3>
            </div>
            <div>
              <h3>{generateCountPercent(pokemon).toFixed(2)} %</h3>
            </div>
            <Index><p>{index + 1}</p></Index>
          </PokemonCard>
        );
      })}
    </Container>
  );
};

export default PokemonList;
