import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from "@emotion/styled";
import { css, cx } from "@emotion/css";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";
import { Button, CircularProgress } from "@mui/material";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";

const TitleContainer = styled.div`
  text-align: center;
`;
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

// const ImagenContainer = styled.div`
//   /* display: flex;
//   height: 256px;
//   width: 256px;
//   img {
//     width: 100%;
//     object-fit: cover;
//     object-position: center;
//   } */
// `;

const Separator = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  max-height: ${(props) => props.size};
`;

const Home: NextPage = () => {
  const [pokemonId, setPokemonId] = useState(() => getOptionsForVote());

  const [first, second] = pokemonId;

  const pokemon1 = trpc.useQuery(["get-pokemons-by-id", { id: first }]);
  const pokemon2 = trpc.useQuery(["get-pokemons-by-id", { id: second }]);

  const voteMutation = trpc.useMutation(['vote-for-pokemon'])
  const voteForPokemon = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({votedFor: first, votedAgainst: second})
    }else{
      voteMutation.mutate({votedFor: second, votedAgainst: first})
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
      <main>
        <Separator size={"50px"} />
        <TitleContainer>
          <h1>Which is the cuitest pokemon?</h1>
        </TitleContainer>

        <Separator size={"100px"} />
        <ContentContainer>
          {pokemon1.isLoading || pokemon2.isLoading || !pokemon1.data || !pokemon2.data ? (
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
                pokemon={pokemon1.data}
                vote={() => voteForPokemon(first)}
              />
              <div>
                <p>vs</p>
              </div>
              <PokemonListing
                pokemon={pokemon2.data}
                vote={() => voteForPokemon(second)}
              />
            </>
          )}
        </ContentContainer>
      </main>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemons-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <PokemonCard>
      {/* <ImagenContainer> */}
        {!props.pokemon.sprites.front_default ? <CircularProgress /> : <Image src={props.pokemon.sprites.front_default} width={256} height={256}/>}
       
        {/* <img src={props.pokemon.sprites.front_default || undefined} /> */}
      {/* </ImagenContainer> */}
      <h3>{props.pokemon.name.toUpperCase()}</h3>
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
