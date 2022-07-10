import styled from "@emotion/styled";
import { css, cx } from "@emotion/css";
import Image from "next/image";
import React from "react";
import { PokemonQueryResult } from "../src/pages/results";

const Container = styled.div`
width: 600px;
margin: 0 auto;
`;
const PokemonCard = styled.div`

border: 1px solid white;
position: relative;
display: grid;
grid-template-columns: 1fr 1fr;
align-items: center;
border-radius:5px;
`;

const Index = styled.p`
  position: absolute;
  padding: 4px;
  top: 0px;
  left: 0px;
  background-color: #6c6b6b;
  border-radius: 5px 0;
`
const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votedFor, votedAgainst } = pokemon._count;
  if (votedFor + votedAgainst === 0) {
    return 0;
  }
  return (votedFor / (votedFor + votedAgainst)) * 100;
};
const PokemonList: React.FC<{pokemons : PokemonQueryResult}> = ({pokemons}) => {
    return(
        <Container>
        {pokemons.map((pokemon,index) => {
          return (
            <PokemonCard key={pokemon.id}>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Image src={pokemon.spriteUrl} width={96} height={96} />
                <h3>{pokemon.name.toUpperCase()}</h3>
              </div>
              <div>
                <h3>{generateCountPercent(pokemon).toFixed(2)} %</h3>
              </div>
              <Index>
                {index}
              </Index>
            </PokemonCard>
          );
        })}
      </Container>
    )
}

export default PokemonList;