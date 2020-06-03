import * as mapFunctional from './map.ts';

export type num = number;
export type bool = boolean;
export type iter<T> = ArrayLike<T> | T[];
export type callback<T, U> = (value: T, index: num, array: iter<T>) => U;

export function equals(objectX: any, objectY: any): bool {
	return objectX.equals(objectY);
}

export function isNull<T>(object: T): bool {
	return !object;
}

export function _each<T>(array: iter<T>, func: callback<T, void>): void {
	let len = array.length;

	for (let i = 0; i < len; i++) {
		func(array[i], i, array);
	}
}

export function _map<T, U>(array: iter<T>, func: callback<T, U>): U[] {
	let len = array.length;
	let res = new Array<U>(len);

	_each<T>(array, (value, index, array) => {
		res[index] = func(value, index, array);
	});

	return res;
}

export function _filter<T>(array: iter<T>, func: callback<T, bool>): T[] {
	let len = array.length;
	let res = new Array<T>(len);
	let cnt = 0;

	_each<T>(array, (value, index, array) => {
		if (func(value, index, array)) {
			res[cnt++] = array[index];
		}
	});

	res.length = cnt;

	return res;
}

export function _curryeach<T>(func: callback<T, void>) {
	return (array: iter<T>) => _each(array, func);
}


export function _currymap<T, U>(func: callback<T, U>) {
	return (array: iter<T>) => _map(array, func);
}

export function _curryfilter<T>(func: callback<T, bool>) {
	return (array: iter<T>) => _filter(array, func);
}

export function _slice<T>(array: T[], start: num, end: num) {
	let res: T[];

	res = _filter<T>(array, (_, index) => {
		return start <= index && index <= end;
	});

	return res;
}

export function _rest<T>(array: iter<T>, start: num = 1): T[] {
	let len = array.length;
	let res = new Array<T>(len - start);
	let cnt = 0;

	_each<T>(array, (value, index) => {
		if (index >= start) {
			res[cnt++] = value;
		}
	});

	return res;
}

type reduceFunc<T, U = T> = (acc: U, cur: T, index: num, arr: iter<T>) => U;

export function _reduce<T, U>(array: iter<T>, func: reduceFunc<T, U>, memo: U): U {
	_each<T>(array, (value, index, array) => {
		memo = func(memo, value, index, array);
	});

	return memo;
}

export function _include<T>(array: iter<T>, item: T): bool {
	let len = array.length;

	for (let i = 0; i < len; i++) {
		if (equals(item, array[i])) {
			return true;
		}
	}

	return false;
}

export function _pipe<T>(...funcs: ((arg: T) => T)[]): (arg: T) => T {
	return (arg: T): T => {
		let memo = arg;

		return _go(memo, ...funcs);
	};
}

export function _go<T>(init: T, ...funcs: ((arg: T) => T)[]) {
	let memo = init;

	_each<(arg: T) => T>(funcs, (func) => {
		memo = func(memo);
	});

	return memo;
}

export function _concat<T>(array: T[], ...items: T[]): T[] {
	let len = array.length;

	_each<T>(items, (_, index) => {
		array[len + index] = items[index];
	});

	return array;
}

export { mapFunctional };

