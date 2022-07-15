import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PokemonClient } from 'pokenode-ts';
import { inferProcedureOutput } from "@trpc/server";
import {prisma} from '../../../utils/prisma'


export const appRouter = trpc
  .router()
  .query('get-pokemons-by-id', {
    input: z
      .object({
        list_id: z.number().array(),
      }),
    async resolve({ input }) {
      const [first, second] = input.list_id
      let bothPokemon = await prisma.pokemon.findMany({
        where: { id: { in: [first, second] } },
      });
      console.log("pokemon length: ", bothPokemon.length)
      if(bothPokemon.length != 2){
        console.log("entro al api")
        const api = new PokemonClient();
        let first_pokemon
        let second_pokemon

        if(bothPokemon[0].id != first || bothPokemon.length == 0){
          console.log("calling api 1 ")
          first_pokemon = await api.getPokemonById(first)
          await prisma.pokemon.create({data : {name: first_pokemon.name , spriteUrl:first_pokemon.sprites.front_default || '', id: first}})
          bothPokemon = [{name: first_pokemon.name , spriteUrl:first_pokemon.sprites.front_default || '', id: first}, bothPokemon[0]]
        }
        if(bothPokemon[0].id != second || bothPokemon.length == 0){
          console.log("calling api 2 ")
          second_pokemon = await api.getPokemonById(second)
          await prisma.pokemon.create({data : {name: second_pokemon.name , spriteUrl:second_pokemon.sprites.front_default || '', id: second}})
          bothPokemon = [bothPokemon[0], {name: second_pokemon.name , spriteUrl:second_pokemon.sprites.front_default || '', id: second}]
        }

        // return {firstPokemon: first_pokemon , secondPokemon: second_pokemon}
      }
      
      return {firstPokemon: bothPokemon[0] , secondPokemon: bothPokemon[1]}
      // return [bothPokemon[0] , bothPokemon[1]]
    },
  }).mutation('vote-for-pokemon', {
    input: z.object({
      votedForId: z.number(),
      votedAgainstId: z.number()
    }),
    async resolve({input}) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainstId,
          votedForId: input.votedForId
        },
      });
      return {success: true, vote: voteInDb }
    }
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;