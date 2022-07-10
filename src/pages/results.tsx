import styled from "@emotion/styled";
import { prisma } from "../utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Layout from "../../components/Layout";
import PokemonList from "../../components/PokemonList";
import ScrollTop from "../../components/ScrollTop";

const Separator = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
`;

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

  return (
    <Layout>
      <Separator size={"50px"} />
      <h1>Results - Cutest Pokemon </h1>
      <Separator size={"50px"} />
      <h3>Total votes: {totalVotes.toLocaleString()}</h3>
      <PokemonList pokemons={pokemons} />
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
