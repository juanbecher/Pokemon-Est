import styled from "@emotion/styled";
import { prisma } from "../utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";
import { css, cx } from "@emotion/css";

const Separator = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
`;

const PokemonList = styled.div`
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

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votedFor, votedAgainst } = pokemon._count;
  if (votedFor + votedAgainst === 0) {
    return 0;
  }
  return (votedFor / (votedFor + votedAgainst)) * 100;
};
const Result: React.FC<{ pokemons: PokemonQueryResult , totalVotes: number}> = ({ pokemons, totalVotes }) => {

  if (!pokemons ) return null;

  pokemons = pokemons.sort((a,b) => generateCountPercent(b) - generateCountPercent(a))

  return (
    <>
      <Separator size={"50px"} />
      <h1>Results - Cutest Pokemon </h1>
      <Separator size={"50px"} />
      <h3>Total votes: {totalVotes}</h3>
      <PokemonList>
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
      </PokemonList>

      <Separator size={"100px"} />
    </>
  );
};

export async function getStaticProps() {
  const pokemons = await getPokemonInOrder();
  const votes = await prisma.vote.findMany();
  
  const totalVotes = votes.length
  console.log(totalVotes)
  return {
    props: { pokemons, totalVotes}, // will be passed to the page component as props
  };
}

export default Result;
