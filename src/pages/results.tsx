import styled from "@emotion/styled";
import { prisma } from "../utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Layout from "../../components/Layout";
import PokemonList from "../../components/PokemonList";
import ScrollTop from "../../components/ScrollTop";
import React, { useState } from "react";
import InputText from '../../components/InputText'
import TextField from '@mui/material/TextField';

const Separator = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  p{
    text-align:left;
    margin: 10px 5px;
  }
`

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votedFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votedFor: true,
          votedAgainst: true,
        },
      },
    },
  });
};

export type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votedFor, votedAgainst } = pokemon._count;
  if (votedFor + votedAgainst === 0) {
    return 0;
  }
  return (votedFor / (votedFor + votedAgainst)) * 100;
};

const Result: React.FC<{
  pokemons: PokemonQueryResult;
  totalVotes: number;
}> = ({ pokemons, totalVotes }) => {
  
  if (!pokemons) return null;
  
  pokemons = pokemons.sort(
    (a, b) => generateCountPercent(b) - generateCountPercent(a)
  );
  const [pokemon_list, setPokemon_list] = useState(pokemons)
  
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input =  e.target.value
    setPokemon_list(pokemons.filter(pokemon => pokemon.name.includes(input)))
  }

  return (
    <Layout>
      <Separator size={"50px"} />
      <h1>Results - Cutest Pokemon </h1>
      <Separator size={"50px"} />
      <Container>
      <InputText handleFilter={handleFilter}/>
      <p>Total votes: {totalVotes.toLocaleString()}</p>
      <PokemonList pokemons={pokemon_list} />
      </Container>
      
      <Separator size={"100px"} />
      
      <ScrollTop/>
      

    </Layout>
  );
};

export async function getStaticProps() {
  const pokemons = await getPokemonInOrder();
  const votes = await prisma.vote.findMany();

  const totalVotes = votes.length;
  return {
    props: { pokemons, totalVotes }, // will be passed to the page component as props
    revalidate: 60 * 5, // revalidate every 5 min
  };
}

export default Result;
