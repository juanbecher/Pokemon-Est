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
        id: z.number(),
      }),
    async resolve({ input }) {
      let pokemon_db = await prisma.pokemon.findFirst({
      where: {id: input.id}} )
      if(!pokemon_db){
        const api = new PokemonClient();
        const pokemon = await api.getPokemonById(input.id)
        await prisma.pokemon.create({data : {name: pokemon.name , spriteUrl:pokemon.sprites.front_default || '', id: input.id}})
        return {name: pokemon.name, spriteUrl: pokemon.sprites.front_default, id: pokemon.id};
      }
      
      return {name: pokemon_db.name, spriteUrl: pokemon_db.spriteUrl, id: pokemon_db.id};
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