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
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input.id)
      return {name: pokemon.name, sprites: pokemon.sprites, id: pokemon.id};
    },
  }).mutation('vote-for-pokemon', {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number()
    }),
    async resolve({input}) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainst: input.votedAgainst,
          votedFor: input.votedFor,
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