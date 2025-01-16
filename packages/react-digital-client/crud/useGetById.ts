import React from 'react';
import { type Entity, EntityHelper, type EntityRaw, type Result } from '../../core';
import useDigitalQuery from '../useDigitalQuery';
import useDigitalClient from '../useDigitalClient';
import type { MutationConfig } from '../types';

type Callback<T> = MutationConfig<Result<T>, null>;

/**
 * Hook to get an entity by its id.
 * @param endpoint The API endpoint.
 * @param id The id of the entity.
 * @param options The options of the hook.
 *  - `onSuccess` The callback to be called on fetch success.
 *  - `onError` The callback to be called on fetch error.
 */
export default function useGetById<T extends Entity>(
    endpoint: string,
    id: string | number | undefined,
    options?: {
        onSuccess?: Callback<T>['onSuccess'];
        onError?: Callback<T>['onError'];
    },
) {
    const { queryClient } = useDigitalClient();

    const { data, isLoading, refetch } = useDigitalQuery<Result<EntityRaw>>(
        !id ? undefined : `${endpoint}/${id}`,
        {
            onSuccess: async (e) => {
                await options?.onSuccess?.({ ...e, value: EntityHelper.build<T>(e.value) });
            },
            onError: async (e) => {
                await options?.onError?.(e);
            },
        },
    );

    const entity = React.useMemo(
        () => data?.value ? EntityHelper.build<T>(data.value) : undefined,
        [data],
    );

    const invalidateQuery = React.useCallback(async () => {
        await queryClient.invalidateQueries({
            predicate: query => query.queryKey[0] === `${endpoint}/${id}`,
        });
    }, [endpoint, id, queryClient]);
    
    const refetchQuery = React.useCallback(async () => {
        await invalidateQuery();
        await refetch();
    }, [invalidateQuery, refetch]);

    return {
        entity,
        isQuerying: isLoading,
        invalidateQuery,
        refetchQuery,
    };
}
