import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from "@emotion/styled";
import { css, cx } from "@emotion/css";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import { Button, capitalize, CircularProgress } from "@mui/material";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Layout from "../../components/Layout";
const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 1rem;
  align-items: center;
`;

const PokemonCard = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Separator = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
`;

const Home: NextPage = () => {
  const [pokemonsId, setPokemonId] = useState(() => getOptionsForVote());

  const [first, second] = pokemonsId;

  const {data: pokemonPair, isLoading} = trpc.useQuery(["get-pokemons-by-id", { list_id: pokemonsId }]);
  // const secondPokemon = trpc.useQuery(["get-pokemons-by-id", { id: second }]);
  // console.log("EN index pokemonpair; ", pokemonPair)
  const voteMutation = trpc.useMutation(["vote-for-pokemon"]);

  const voteForPokemon = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedForId: first, votedAgainstId: second });
    } else {
      voteMutation.mutate({ votedForId: second, votedAgainstId: first });
    }
    setPokemonId(getOptionsForVote());
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <Layout>
        <Separator size={"50px"} />

        <h1>Which is the cutest pokemon?</h1>

        <Separator size={"100px"} />
        <ContentContainer>
          {isLoading ||
          !pokemonPair  ? (
            <div
              className={css`
                padding: 100px;
              `}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <PokemonListing
                pokemon={pokemonPair.firstPokemon}
                vote={() => voteForPokemon(first)}
              />
              <div>
                <p>vs</p>
              </div>
              <PokemonListing
                pokemon={pokemonPair.secondPokemon}
                vote={() => voteForPokemon(second)}
              />
            </>
          )}
        </ContentContainer>
      </Layout>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemons-by-id">['firstPokemon'];

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <PokemonCard>
      {!props.pokemon.id ? (
        <CircularProgress />
      ) : (
        <Image src={props.pokemon.spriteUrl} width={256} height={256} />
      )}

      <h3>{capitalize(props.pokemon.name)}</h3>
      <Separator size={"50px"} />
      <Button
        className={css`
          width: 50%;
          margin: 0 auto;
        `}
        variant="contained"
        onClick={() => props.vote()}
      >
        Vote
      </Button>
    </PokemonCard>
  );
};
export default Home;
