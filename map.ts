import { bool, num } from './';

export type mapCallback<K, V, R> = (value: V, key: K, map: Map<K, V>) => R;

export type Nullable<T> = T | null;

export function meach<K, V>(map: Map<K, V>, func: mapCallback<K, V, void>) {
	for (let [key, value] of map) {
		func(value, key, map);
	}
}

export function mmap<K, V, T, U>(map: Map<K, V>, func: mapCallback<K, V, [T, U]>) {
	let res = new Map<T, U>();

	meach(map, (v, k, m) => {
		res.set(...func(v, k, m));
	});

	return res;
}

export function mfilter<K, V>(map: Map<K, V>, func: mapCallback<K, V, bool>) {
	let res = new Map<K, V>();

	meach(map, (v, k, m) => {
		if (func(v, k, m)) {
			res.set(k, v);
		}
	});

	return res;
}

export function mcurryeach<K, V>(func: mapCallback<K, V, void>) {
	return (map: Map<K, V>) => meach(map, func);
}

export function mcurrymap<K, V, T, U>(func: mapCallback<K, V, [T, U]>) {
	return (map: Map<K, V>) => mmap(map, func);
}

export function mcurryfilter<K, V>(func: mapCallback<K, V, bool>) {
	return (map: Map<K, V>) => mfilter(map, func);
}

export interface IMapResult<K, V> {
	key: K;
	value: V;
}

export function mget<K, V>(map: Map<K, V>, pos: num): Nullable<IMapResult<K, V>> {
	let i = -1;

	for (let [key, value] of map) {
		if (++i === pos) {
			return { key, value };
		}
	}

	return null;
}